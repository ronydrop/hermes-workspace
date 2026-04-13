import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Copy01Icon,
  Link01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useRef, useState } from 'react'
import { ProviderIcon } from './provider-icon'
import type { ProviderAuthType } from '@/lib/provider-catalog'
import {
  HERMES_CONFIG_PATH,
  PROVIDER_CATALOG,
  buildConfigExample,
  getAuthTypeLabel,
  getProviderInfo,
} from '@/lib/provider-catalog'
import { writeTextToClipboard } from '@/lib/clipboard'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConnectionRestart } from '@/components/connection-overlay'
import { cn } from '@/lib/utils'

type WizardStep = 'provider' | 'auth' | 'instructions' | 'verify'
type CopyState = 'idle' | 'copied' | 'failed'
type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type VerifyState = 'checking' | 'success' | 'warning'

type ProviderWizardProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pre-fill with an existing provider for editing */
  editProvider?: ProviderSummaryForEdit | null
}

export type ProviderSummaryForEdit = {
  id: string
  name: string
}

type StepItem = {
  id: WizardStep
  label: string
}

type AuthTypeMeta = {
  title: string
  description: string
}

const WIZARD_STEPS: Array<StepItem> = [
  { id: 'provider', label: 'Escolher Provedor' },
  { id: 'auth', label: 'Escolher Auth' },
  { id: 'instructions', label: 'Instruções de Config' },
  { id: 'verify', label: 'Verificar' },
]

const AUTH_TYPE_ORDER: Array<ProviderAuthType> = [
  'api-key',
  'cli-token',
  'oauth',
  'local',
]

function getAuthTypeMeta(authType: ProviderAuthType): AuthTypeMeta {
  if (authType === 'api-key') {
    return {
      title: 'API Key',
      description: 'Cole sua chave de API — salva diretamente na config local',
    }
  }

  if (authType === 'cli-token') {
    return {
      title: 'CLI Token',
      description:
        'Use seu token de auth do Claude CLI existente (do Claude Code / claude.ai)',
    }
  }

  if (authType === 'oauth') {
    return {
      title: 'OAuth',
      description: 'Faça login pelo navegador — inicia o fluxo OAuth automaticamente',
    }
  }

  return {
    title: 'Local',
    description: 'Sem autenticação necessária (Ollama)',
  }
}

function getStepIndex(step: WizardStep): number {
  return WIZARD_STEPS.findIndex(function findStep(item) {
    return item.id === step
  })
}

/**
 * Poll GET /api/models for up to `timeoutMs` (default 10 s).
 * Resolves true if the given providerId appears in the response, false on timeout.
 */
async function pollForProvider(
  providerId: string,
  timeoutMs = 10_000,
): Promise<boolean> {
  const deadline = Date.now() + timeoutMs
  const interval = 1_500

  while (Date.now() < deadline) {
    try {
      const res = await fetch('/api/models')
      if (res.ok) {
        const data = (await res.json()) as {
          configuredProviders?: Array<string>
        }
        const configured = Array.isArray(data.configuredProviders)
          ? data.configuredProviders
          : []
        if (
          configured.some((p) => p.toLowerCase() === providerId.toLowerCase())
        ) {
          return true
        }
      }
    } catch {
      // network blip — keep polling
    }

    const remaining = deadline - Date.now()
    if (remaining <= 0) break
    await new Promise((r) =>
      globalThis.setTimeout(r, Math.min(interval, remaining)),
    )
  }

  return false
}

export function ProviderWizard({
  open,
  onOpenChange,
  editProvider,
}: ProviderWizardProps) {
  const { triggerRestart } = useConnectionRestart()

  const [step, setStep] = useState<WizardStep>('provider')
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  )
  const [selectedAuthType, setSelectedAuthType] =
    useState<ProviderAuthType | null>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showManualSnippet, setShowManualSnippet] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const [verifyState, setVerifyState] = useState<VerifyState>('checking')
  const pollingRef = useRef(false)

  const currentStepIndex = getStepIndex(step)
  const selectedProvider = selectedProviderId
    ? getProviderInfo(selectedProviderId)
    : null
  const configExample =
    selectedProvider && selectedAuthType
      ? buildConfigExample(selectedProvider, selectedAuthType)
      : ''

  // When opened with editProvider, jump straight to auth step
  useEffect(() => {
    if (open && editProvider) {
      setSelectedProviderId(editProvider.id)
      setSelectedAuthType(null)
      setStep('auth')
    }
  }, [open, editProvider])

  function resetState() {
    setStep('provider')
    setSelectedProviderId(null)
    setSelectedAuthType(null)
    setCopyState('idle')
    setSaveState('idle')
    setSaveError('')
    setApiKeyInput('')
    setShowManualSnippet(false)
    setVerificationMessage('')
    setVerifyState('checking')
    pollingRef.current = false
  }

  function handleDialogOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      resetState()
    }
  }

  function handleSelectProvider(providerId: string) {
    setSelectedProviderId(providerId)
    setSelectedAuthType(null)
    setCopyState('idle')
    setVerificationMessage('')
    setVerifyState('checking')
    setStep('auth')
  }

  function handleChooseAuthType(authType: ProviderAuthType) {
    setSelectedAuthType(authType)
    setCopyState('idle')
    setVerificationMessage('')
    setVerifyState('checking')
    setStep('instructions')
  }

  async function handleCopyConfig() {
    if (!configExample) return

    try {
      await writeTextToClipboard(configExample)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  async function handleSaveApiKey() {
    if (!selectedProvider || !apiKeyInput.trim()) return

    setSaveState('saving')
    setSaveError('')

    const profileKey = `${selectedProvider.id}:default`
    const patch = {
      auth: {
        profiles: {
          [profileKey]: {
            provider: selectedProvider.id,
            apiKey: apiKeyInput.trim(),
          },
        },
      },
    }

    const providerName = selectedProvider.name
    const providerId = selectedProvider.id
    const patchBody = JSON.stringify({
      raw: JSON.stringify(patch, null, 2),
      reason: `Studio: add ${providerName} API key`,
    })

    async function saveConfigAndRestart() {
      const res = await fetch('/api/config-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: patchBody,
      })

      const data = (await res.json()) as { ok: boolean; error?: string }

      if (!data.ok) {
        throw new Error(data.error || 'Failed to save config')
      }
    }

    try {
      // Move to verify step, then trigger the restart flow
      setSaveState('saved')
      setVerifyState('checking')
      setVerificationMessage(
        `${providerName} API key saved. Hermes is restarting…`,
      )
      setStep('verify')

      // Shows confirm dialog: user can click "Restart & Apply" or "Cancel"
      await triggerRestart(saveConfigAndRestart)

      // After restart, poll /api/models to confirm provider is visible
      if (!pollingRef.current) {
        pollingRef.current = true
        setVerificationMessage(
          `Checking if ${providerName} models are available…`,
        )

        const found = await pollForProvider(providerId)

        if (found) {
          setVerifyState('success')
          setVerificationMessage(
            `${providerName} is connected and models are available.`,
          )
        } else {
          setVerifyState('warning')
          setVerificationMessage(
            `Hermes restarted, but ${providerName} models haven't appeared yet. ` +
              `Check your API key or wait a moment and refresh.`,
          )
        }
        pollingRef.current = false
      }
    } catch (err) {
      setSaveState('error')
      setSaveError(err instanceof Error ? err.message : 'Network error')
    }
  }

  function handleDone() {
    onOpenChange(false)
    resetState()
  }

  const verifyIconColor =
    verifyState === 'success'
      ? 'text-green-600'
      : verifyState === 'warning'
        ? 'text-amber-600'
        : 'text-primary-600'

  const verifyBorderColor =
    verifyState === 'success'
      ? 'border-green-200 bg-green-50/60'
      : verifyState === 'warning'
        ? 'border-amber-200 bg-amber-50/60'
        : 'border-primary-200 bg-primary-100/70'

  const verifyTitle =
    verifyState === 'success'
      ? 'Conexão Verificada ✓'
      : verifyState === 'warning'
        ? 'Conectado (modelos pendentes)'
        : 'Verificando conexão…'

  return (
    <DialogRoot open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="left-auto right-0 top-[var(--titlebar-h,0px)] h-[calc(100dvh-var(--titlebar-h,0px))] w-screen translate-x-0 translate-y-0 overflow-hidden rounded-none border-primary-200 bg-primary-50/95 backdrop-blur-sm duration-300 ease-out sm:w-[min(860px,100vw)] sm:rounded-l-2xl data-[state=open]:scale-100 data-[state=closed]:scale-100 data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full">
        <div className="flex h-full min-h-0 flex-col">
          <div className="border-b border-primary-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DialogTitle className="text-balance">
                  {editProvider
                    ? `Editar Provedor: ${editProvider.name}`
                    : 'Assistente de Configuração de Provedor'}
                </DialogTitle>
                <DialogDescription className="text-pretty">
                  Adicione credenciais de provedor com segurança. As chaves de API ficam locais no seu
                  arquivo de configuração Hermes e nunca são enviadas ao Studio.
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={function onClose() {
                  handleDialogOpenChange(false)
                }}
                aria-label="Fechar assistente de configuração de provedor"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={20}
                  strokeWidth={1.5}
                />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-5 sm:pb-5">
            <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WIZARD_STEPS.map(function mapStep(item, index) {
                const isComplete = index < currentStepIndex
                const isCurrent = index === currentStepIndex

                return (
                  <li
                    key={item.id}
                    className={cn(
                      'rounded-xl border px-2.5 py-2',
                      isCurrent && 'border-primary-400 bg-primary-100/70',
                      isComplete && 'border-green-500/30 bg-green-500/10',
                      !isCurrent &&
                        !isComplete &&
                        'border-primary-200 bg-primary-50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex size-5 items-center justify-center rounded-full border text-xs font-medium tabular-nums',
                          isCurrent && 'border-primary-500 text-primary-800',
                          isComplete && 'border-green-500/40 text-green-600',
                          !isCurrent &&
                            !isComplete &&
                            'border-primary-300 text-primary-600',
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate text-xs font-medium text-primary-800">
                        {item.label}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>

            {step === 'provider' ? (
              <section className="mt-5">
                <h3 className="text-base font-medium text-primary-900 text-balance">
                  Passo 1: Escolher Provedor
                </h3>
                <p className="mt-1 text-sm text-primary-600 text-pretty">
                  Selecione o provedor que deseja configurar.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PROVIDER_CATALOG.map(function mapProvider(provider) {
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={function onSelectProvider() {
                          handleSelectProvider(provider.id)
                        }}
                        className="rounded-2xl border border-primary-200 bg-primary-50/70 p-3 text-left transition-colors hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/70"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary-200 bg-primary-100/70">
                            <ProviderIcon providerId={provider.id} />
                          </span>
                          <h4 className="text-sm font-medium text-primary-900 text-balance">
                            {provider.name}
                          </h4>
                        </div>

                        <p className="mt-2 text-xs text-primary-600 text-pretty line-clamp-2">
                          {provider.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {provider.authTypes.map(function mapAuth(authType) {
                            return (
                              <span
                                key={authType}
                                className="rounded-full border border-primary-300 bg-primary-100 px-2 py-0.5 text-xs text-primary-700"
                              >
                                {getAuthTypeLabel(authType)}
                              </span>
                            )
                          })}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}

            {step === 'auth' && selectedProvider ? (
              <section className="mt-5">
                <h3 className="text-base font-medium text-primary-900 text-balance">
                  Passo 2: Escolher Tipo de Auth
                </h3>
                <p className="mt-1 text-sm text-primary-600 text-pretty">
                  {selectedProvider.name} suporta{' '}
                  {selectedProvider.authTypes
                    .map(function mapAuthType(authType) {
                      return getAuthTypeLabel(authType)
                    })
                    .join(', ')}
                  .
                </p>

                <div className="mt-3 rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                  <p className="text-xs text-primary-700 text-pretty">
                    Caminho do arquivo de configuração:{' '}
                    <code className="font-mono">{HERMES_CONFIG_PATH}</code>
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {AUTH_TYPE_ORDER.map(function mapAuthType(authType) {
                    const meta = getAuthTypeMeta(authType)
                    const supported =
                      selectedProvider.authTypes.includes(authType)

                    return (
                      <button
                        key={authType}
                        type="button"
                        disabled={!supported}
                        onClick={function onChooseAuthType() {
                          handleChooseAuthType(authType)
                        }}
                        className={cn(
                          'rounded-2xl border p-3 text-left transition-colors',
                          supported
                            ? 'border-primary-200 bg-primary-50/70 hover:border-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800/80'
                            : 'cursor-not-allowed border-primary-200 bg-primary-50/40 opacity-50',
                        )}
                      >
                        <h4 className="text-sm font-medium text-primary-900 text-balance">
                          {meta.title}
                        </h4>
                        <p className="mt-1 text-xs text-primary-600 text-pretty">
                          {meta.description}
                        </p>
                        {!supported ? (
                          <p className="mt-2 text-xs text-primary-500 text-pretty">
                            Não suportado por {selectedProvider.name}.
                          </p>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={function onBack() {
                      // If editing, close wizard instead of going back to provider picker
                      if (editProvider) {
                        handleDialogOpenChange(false)
                      } else {
                        setStep('provider')
                      }
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={20}
                      strokeWidth={1.5}
                    />
                    Voltar
                  </Button>
                </div>
              </section>
            ) : null}

            {step === 'instructions' && selectedProvider && selectedAuthType ? (
              <section className="mt-5">
                <h3 className="text-base font-medium text-primary-900 text-balance">
                  Passo 3: Adicionar Chave de API
                </h3>

                {selectedAuthType === 'oauth' ? (
                  <>
                    <p className="mt-1 text-sm text-primary-600 text-pretty">
                      Isso executará{' '}
                      <code className="font-mono text-primary-800">
                        hermes setup
                      </code>{' '}
                      no terminal para iniciar o fluxo OAuth. Uma janela do navegador
                      será aberta para você fazer login com o Google.
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                      <Button
                        size="sm"
                        onClick={function onLaunchOAuth() {
                          window.open('/terminal', '_blank')
                          setVerificationMessage(
                            'Execute "hermes setup" no terminal e selecione Google OAuth quando solicitado. ' +
                              'Uma janela do navegador será aberta para login. Ao concluir, o Hermes reiniciará automaticamente.',
                          )
                          setVerifyState('warning')
                          setStep('verify')
                        }}
                        >
                          Abrir Terminal
                        </Button>

                        <div className="rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                          <p className="text-xs text-primary-700 text-pretty">
                            No terminal, execute:
                          </p>
                          <pre className="mt-1 rounded-lg bg-primary-200/60 px-2 py-1.5 text-xs font-mono text-primary-900">
                            hermes setup
                          </pre>
                          <p className="mt-1.5 text-xs text-primary-600 text-pretty">
                            Selecione <strong>Google Antigravity</strong> →{' '}
                            <strong>OAuth</strong>. Uma aba do navegador será aberta para
                            login no Google.
                          </p>
                        </div>

                        <div className="rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                          <p className="text-xs text-primary-700 text-pretty">
                            Sem acesso ao terminal?{' '}
                            <a
                              href="https://github.com/NousResearch/hermes-agent"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-800 underline decoration-primary-400 hover:text-primary-900"
                            >
                              Veja a documentação do Hermes Agent
                            </a>{' '}
                            para instruções de configuração.
                          </p>
                        </div>
                      </div>
                    </>
                ) : selectedAuthType === 'cli-token' ? (
                  <>
                    <p className="mt-1 text-sm text-primary-600 text-pretty">
                      Se você tem o Claude Code ou o Claude CLI instalado,
                      o Hermes pode usar o mesmo token de auth. Execute o comando de configuração
                      para detectar e importar automaticamente.
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                      <Button
                        size="sm"
                        onClick={function onLaunchCLI() {
                          window.open('/terminal', '_blank')
                          setVerificationMessage(
                            'Execute "hermes setup" no terminal e selecione Anthropic → CLI Token. ' +
                              'Ele detectará suas credenciais do Claude CLI e as importará automaticamente.',
                          )
                          setVerifyState('warning')
                          setStep('verify')
                        }}
                        >
                          Abrir Terminal
                        </Button>

                        <div className="rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                          <p className="text-xs text-primary-700 text-pretty">
                            No terminal, execute:
                          </p>
                          <pre className="mt-1 rounded-lg bg-primary-200/60 px-2 py-1.5 text-xs font-mono text-primary-900">
                            hermes setup
                          </pre>
                          <p className="mt-1.5 text-xs text-primary-600 text-pretty">
                            Selecione <strong>Anthropic</strong> →{' '}
                            <strong>Setup Token (Claude CLI)</strong>. Ele
                            detectará suas credenciais Claude existentes em{' '}
                            <code className="font-mono">~/.claude/</code>.
                          </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2">
                          <p className="text-xs text-amber-800 text-pretty">
                            <strong>Requisito:</strong> Claude Code ou Claude CLI
                            deve estar instalado e autenticado primeiro. Execute{' '}
                            <code className="font-mono">claude</code> no terminal
                            para verificar.
                          </p>
                        </div>

                        <div className="rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                          <p className="text-xs text-primary-700 text-pretty">
                            Sem acesso ao terminal?{' '}
                            <a
                              href="https://github.com/NousResearch/hermes-agent"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-800 underline decoration-primary-400 hover:text-primary-900"
                            >
                              Veja a documentação do Hermes Agent
                            </a>{' '}
                            para instruções de configuração do CLI token.
                          </p>
                        </div>
                      </div>
                    </>
                ) : selectedAuthType === 'api-key' ? (
                  <>
                    <p className="mt-1 text-sm text-primary-600 text-pretty">
                      Cole sua chave de API do {selectedProvider.name} abaixo. Ela será
                      salva diretamente no seu arquivo de configuração local.
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={apiKeyInput}
                          onChange={function onInputChange(e) {
                            setApiKeyInput(e.target.value)
                          }}
                          placeholder={`sk-... ou sua chave de API do ${selectedProvider.name}`}
                          className="flex-1 rounded-xl border border-primary-300 bg-white px-3 py-2 text-sm text-primary-900 placeholder:text-primary-400 focus:border-accent-400 focus:outline-none focus:ring-1 focus:ring-accent-400/50"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          disabled={
                            !apiKeyInput.trim() || saveState === 'saving'
                          }
                          onClick={function onSave() {
                            void handleSaveApiKey()
                          }}
                        >
                          {saveState === 'saving'
                            ? 'Salvando…'
                            : saveState === 'saved'
                              ? 'Salvo ✓'
                              : 'Salvar & Conectar'}
                        </Button>
                      </div>

                      {saveState === 'error' ? (
                        <p className="text-xs text-red-600">{saveError}</p>
                      ) : null}

                      {saveState === 'saved' ? (
                        <p className="text-xs text-green-600">
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={14}
                            strokeWidth={1.5}
                            className="inline mr-1"
                          />
                          Chave salva! O Hermes está reiniciando para aplicar as alterações.
                        </p>
                      ) : null}
                    </div>

                    <a
                      href={selectedProvider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm text-primary-700 underline decoration-primary-400 hover:text-primary-900"
                    >
                      <HugeiconsIcon
                        icon={Link01Icon}
                        size={20}
                        strokeWidth={1.5}
                      />
                      Obtenha sua chave de API do {selectedProvider.name}
                    </a>

                    <div className="mt-4 rounded-xl border border-primary-200 bg-primary-100/70 px-3 py-2">
                      <p className="text-xs text-primary-700 text-pretty">
                        As chaves de API são armazenadas localmente em{' '}
                        <code className="font-mono">{HERMES_CONFIG_PATH}</code>,
                        nunca enviadas ao Studio.
                      </p>
                    </div>

                    {/* Manual fallback */}
                    <button
                      type="button"
                      onClick={function toggleManual() {
                        setShowManualSnippet(!showManualSnippet)
                      }}
                      className="mt-3 text-xs text-primary-500 hover:text-primary-700 underline"
                    >
                      {showManualSnippet ? 'Ocultar' : 'Mostrar'} trecho de configuração
                      manual
                    </button>

                    {showManualSnippet ? (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={function onCopyConfig() {
                              void handleCopyConfig()
                            }}
                          >
                            <HugeiconsIcon
                              icon={Copy01Icon}
                              size={20}
                              strokeWidth={1.5}
                            />
                            Copiar trecho
                          </Button>
                          {copyState === 'copied' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                size={20}
                                strokeWidth={1.5}
                              />
                              Copiado
                            </span>
                          ) : null}
                        </div>
                        <pre className="overflow-x-auto rounded-2xl border border-primary-200 bg-primary-100/80 p-3 text-xs text-primary-900">
                          <code className="font-mono tabular-nums">
                            {configExample}
                          </code>
                        </pre>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-primary-600 text-pretty">
                      Nenhuma configuração adicional necessária. Apenas certifique-se de que o
                      serviço está sendo executado localmente.
                    </p>
                  </>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={function onBack() {
                      setStep('auth')
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={20}
                      strokeWidth={1.5}
                    />
                    Voltar
                  </Button>
                  {selectedAuthType === 'local' ? (
                    <Button
                      size="sm"
                      onClick={function onDone() {
                        handleDone()
                      }}
                    >
                      Concluir
                    </Button>
                  ) : null}
                </div>
              </section>
            ) : null}

            {step === 'verify' ? (
              <section className="mt-5">
                <h3 className="text-base font-medium text-primary-900 text-balance">
                  Passo 4: Verificar
                </h3>
                <div
                  className={cn(
                    'mt-3 rounded-2xl border p-4',
                    verifyBorderColor,
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-medium text-balance',
                      verifyIconColor,
                    )}
                  >
                    {verifyTitle}
                  </p>
                  <p className="mt-1 text-sm text-primary-600 text-pretty">
                    {verificationMessage || 'Aguardando resposta do Hermes…'}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={function onBack() {
                      setStep('instructions')
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={20}
                      strokeWidth={1.5}
                    />
                    Voltar
                  </Button>
                  <Button
                    size="sm"
                    onClick={function onDone() {
                      handleDone()
                    }}
                  >
                    Concluir
                  </Button>
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}
