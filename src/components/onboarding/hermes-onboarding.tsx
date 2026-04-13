'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ProviderLogo } from '@/components/provider-logo'

const KNOWN_PROVIDER_PREFIXES = [
  'openrouter',
  'anthropic',
  'openai',
  'openai-codex',
  'nous',
  'ollama',
  'zai',
  'kimi-coding',
  'minimax',
  'minimax-cn',
]

function stripProviderPrefix(model: string): string {
  if (!model) return model
  const slash = model.indexOf('/')
  if (slash === -1) return model
  const prefix = model.slice(0, slash)
  if (KNOWN_PROVIDER_PREFIXES.includes(prefix)) {
    return model.slice(slash + 1)
  }
  return model
}

const ONBOARDING_KEY = 'hermes-onboarding-complete'

type Step = 'welcome' | 'connect' | 'provider' | 'test' | 'done'

type GatewayStatusResponse = {
  capabilities?: {
    health?: boolean
    chatCompletions?: boolean
    models?: boolean
    streaming?: boolean
    sessions?: boolean
    skills?: boolean
    memory?: boolean
    config?: boolean
    jobs?: boolean
  }
  hermesUrl?: string
}

const PROVIDERS = [
  {
    id: 'nous',
    name: 'Nous Portal',
    logo: '/providers/nous.png',
    desc: 'Grátis via OAuth',
    authType: 'oauth',
  },
  {
    id: 'openai-codex',
    name: 'OpenAI Codex',
    logo: '/providers/openai.png',
    desc: 'Grátis via ChatGPT Pro',
    authType: 'oauth',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    logo: '/providers/anthropic.png',
    desc: 'Chave de API necessária',
    authType: 'api_key',
    envKey: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    logo: '/providers/openrouter.png',
    desc: 'Chave de API necessária',
    authType: 'api_key',
    envKey: 'OPENROUTER_API_KEY',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    logo: '/providers/ollama.png',
    desc: 'Modelos locais, sem chave necessária',
    authType: 'none',
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-compat)',
    logo: '/providers/openai.png',
    desc: 'Qualquer endpoint compatível com OpenAI',
    authType: 'custom',
  },
]

function getEnhancedFeatureNames(
  capabilities?: GatewayStatusResponse['capabilities'],
): Array<string> {
  if (!capabilities) return []
  const features: Array<{ enabled?: boolean; label: string }> = [
    { enabled: capabilities.sessions, label: 'Sessões' },
    { enabled: capabilities.skills, label: 'Skills' },
    { enabled: capabilities.memory, label: 'Memória' },
    { enabled: capabilities.config, label: 'Config. no app' },
    { enabled: capabilities.jobs, label: 'Jobs' },
  ]

  return features
    .filter((feature) => feature.enabled)
    .map((feature) => feature.label)
}

export function HermesOnboarding() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState<Step>('welcome')
  const [backendStatus, setBackendStatus] = useState<
    'idle' | 'checking' | 'ready' | 'error'
  >('idle')
  const [backendInfo, setBackendInfo] = useState<GatewayStatusResponse | null>(
    null,
  )
  const [backendMessage, setBackendMessage] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [availableModels, setAvailableModels] = useState<Array<string>>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [testStatus, setTestStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle')
  const [testMessage, setTestMessage] = useState('')
  const [configuredModel, setConfiguredModel] = useState('')

  const [oauthStep, setOauthStep] = useState<
    'idle' | 'loading' | 'waiting' | 'success' | 'error'
  >('idle')
  const [oauthUserCode, setOauthUserCode] = useState('')
  const [oauthVerificationUrl, setOauthVerificationUrl] = useState('')
  const [oauthError, setOauthError] = useState('')
  const oauthPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const provider = PROVIDERS.find((p) => p.id === selectedProvider)
  const needsApiKey =
    provider?.authType === 'api_key' || provider?.authType === 'custom'
  const needsBaseUrl =
    provider?.id === 'ollama' || provider?.authType === 'custom'
  const isOAuth = provider?.authType === 'oauth'
  const capabilities = backendInfo?.capabilities
  const canEditConfig = Boolean(capabilities?.config)
  const enhancedFeatures = getEnhancedFeatureNames(capabilities)
  const canFetchModels = Boolean(capabilities?.models)
  const backendSupportsChat = Boolean(capabilities?.chatCompletions)

  const loadCurrentConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/hermes-config')
      if (!res.ok) return
      const data = (await res.json()) as {
        activeModel?: string
        activeProvider?: string
      }
      if (data.activeModel) {
        const normalizedModel = stripProviderPrefix(data.activeModel)
        setConfiguredModel(normalizedModel)
        setSelectedModel((current) => current || normalizedModel)
      }
      if (data.activeProvider) {
        setSelectedProvider((current) => current || data.activeProvider || null)
      }
    } catch {}
  }, [])

  const loadModels = useCallback(async () => {
    if (!canFetchModels) return
    try {
      const modelsRes = await fetch('/api/models')
      if (!modelsRes.ok) return
      const modelsData = (await modelsRes.json()) as {
        data?: Array<{ id?: string }>
        models?: Array<{ id?: string }>
      }
      const rawModels = modelsData.data || modelsData.models || []
      const models = rawModels
        .map((model) => (typeof model.id === 'string' ? model.id : ''))
        .filter(Boolean)
        .slice(0, 20)

      setAvailableModels(models)
      setSelectedModel(
        (current) => current || stripProviderPrefix(models[0] || ''),
      )
    } catch {
      setAvailableModels([])
    }
  }, [canFetchModels])

  const checkBackend = useCallback(async () => {
    setBackendStatus('checking')
    setBackendMessage('')

    try {
      const res = await fetch('/api/gateway-status')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = (await res.json()) as GatewayStatusResponse
      setBackendInfo(data)

      if (data.capabilities?.chatCompletions) {
        setBackendStatus('ready')
        setBackendMessage(
          data.capabilities.sessions
            ? 'Backend conectado. Chat principal funciona, e as melhorias do gateway Hermes estão disponíveis.'
            : 'Backend conectado. Chat principal pronto.',
        )
        return
      }

      if (data.capabilities?.health) {
        setBackendStatus('error')
        setBackendMessage(
          'O backend está acessível, mas /v1/chat/completions ainda não está disponível.',
        )
        return
      }

      setBackendStatus('error')
      setBackendMessage('Nenhum backend compatível detectado ainda.')
    } catch (err) {
      setBackendInfo(null)
      setBackendStatus('error')
      setBackendMessage(
        err instanceof Error ? err.message : 'Verificação de conexão falhou',
      )
    }
  }, [])

  const saveProviderConfig = useCallback(async () => {
    if (!selectedProvider) return true
    if (!canEditConfig) return true

    setSaving(true)
    setSaveError('')

    try {
      const prov = PROVIDERS.find((p) => p.id === selectedProvider)
      const body: Record<string, unknown> = {
        config: { model: { provider: selectedProvider } },
      }

      if (prov?.envKey && apiKey) {
        body.env = { [prov.envKey]: apiKey }
      }
      if (baseUrl) {
        body.config = { model: { provider: selectedProvider, baseUrl } }
      }

      const res = await fetch('/api/hermes-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)

      await loadCurrentConfig()
      await loadModels()
      return true
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Falha ao salvar')
      return false
    } finally {
      setSaving(false)
    }
  }, [
    apiKey,
    baseUrl,
    canEditConfig,
    loadCurrentConfig,
    loadModels,
    selectedProvider,
  ])

  const saveModelSelection = useCallback(async () => {
    const modelToSave = stripProviderPrefix(selectedModel || configuredModel)
    if (!modelToSave) return true

    setConfiguredModel(modelToSave)

    if (!canEditConfig || !selectedProvider) return true

    try {
      const res = await fetch('/api/hermes-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            model: { provider: selectedProvider, default: modelToSave },
          },
        }),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      return true
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Falha ao salvar modelo')
      return false
    }
  }, [canEditConfig, configuredModel, selectedModel, selectedProvider])

  const testConnection = useCallback(async () => {
    setTestStatus('testing')
    setTestMessage('')

    try {
      const res = await fetch('/api/send-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionKey: 'new',
          friendlyId: 'new',
          message:
            'Reply with one short sentence confirming the backend connection works.',
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const reader = res.body?.getReader()
      if (!reader) throw new Error('Nenhum stream retornado')

      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const matches = chunk.match(/(?:delta|text|content)":"([^"]+)"/g)
        if (matches) {
          for (const match of matches) {
            text += match.replace(/.*":"/, '').replace(/"$/, '')
          }
        }
      }

      setTestMessage(text.slice(0, 240) || 'Teste de chat bem-sucedido.')
      setTestStatus('success')
      void checkBackend()
    } catch (err) {
      setTestMessage(err instanceof Error ? err.message : 'Conexão falhou')
      setTestStatus('error')
    }
  }, [checkBackend])

  const startNousOAuth = useCallback(async () => {
    setOauthStep('loading')
    setOauthError('')

    try {
      const res = await fetch('/api/oauth/device-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'nous' }),
      })
      const data = (await res.json()) as {
        device_code?: string
        user_code?: string
        verification_uri_complete?: string
        interval?: number
        error?: string
      }

      if (!res.ok || data.error) {
        setOauthError(data.error || 'Falha ao iniciar OAuth')
        setOauthStep('error')
        return
      }

      setOauthUserCode(data.user_code || '')
      setOauthVerificationUrl(data.verification_uri_complete || '')
      setOauthStep('waiting')

      if (data.verification_uri_complete) {
        window.open(data.verification_uri_complete, '_blank')
      }

      const intervalMs = Math.max((data.interval || 5) * 1000, 3000)
      oauthPollRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch('/api/oauth/poll-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: 'nous',
              deviceCode: data.device_code,
            }),
          })
          const pollData = (await pollRes.json()) as {
            status: string
            message?: string
          }

          if (pollData.status === 'success') {
            if (oauthPollRef.current) clearInterval(oauthPollRef.current)
            setOauthStep('success')
            await saveProviderConfig()
            await loadModels()
            return
          }

          if (pollData.status === 'error') {
            if (oauthPollRef.current) clearInterval(oauthPollRef.current)
            setOauthError(pollData.message || 'Autenticação falhou')
            setOauthStep('error')
          }
        } catch {}
      }, intervalMs)
    } catch (err) {
      setOauthError(
        err instanceof Error ? err.message : 'Falha ao iniciar OAuth',
      )
      setOauthStep('error')
    }
  }, [loadModels, saveProviderConfig])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setShow(true)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (oauthPollRef.current) clearInterval(oauthPollRef.current)
    }
  }, [])

  useEffect(() => {
    if (oauthPollRef.current) clearInterval(oauthPollRef.current)
    setOauthStep('idle')
    setOauthUserCode('')
    setOauthVerificationUrl('')
    setOauthError('')
  }, [selectedProvider])

  useEffect(() => {
    if (show) {
      void loadCurrentConfig()
    }
  }, [loadCurrentConfig, show])

  const complete = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShow(false)
  }, [])

  if (!show) return null

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-card)',
    border: '1px solid var(--theme-border)',
    color: 'var(--theme-text)',
  }
  const mutedStyle: React.CSSProperties = { color: 'var(--theme-muted)' }
  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--theme-bg)',
    border: '1px solid var(--theme-border)',
    color: 'var(--theme-text)',
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center px-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl p-8"
          style={cardStyle}
        >
          {step === 'welcome' && (
            <div className="space-y-4 text-center">
              <img
                src="/hermes-avatar.webp"
                alt="Hermes"
                className="mx-auto size-20 rounded-2xl"
                style={{
                  filter: 'drop-shadow(0 8px 24px rgba(99,102,241,0.3))',
                }}
              />
              <h2 className="text-xl font-bold">Bem-vindo ao Hermes Workspace</h2>
              <p className="text-sm" style={mutedStyle}>
                Funciona com qualquer backend compatível com OpenAI. As APIs do gateway
                Hermes desbloqueiam sessões, memória, skills e outros extras automaticamente.
              </p>
              <button
                onClick={() => {
                  setStep('connect')
                  void checkBackend()
                }}
                className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Conectar Backend
              </button>
              <button onClick={complete} className="text-xs" style={mutedStyle}>
                Pular configuração
              </button>
            </div>
          )}

          {step === 'connect' && (
            <div className="space-y-4 text-center">
              <div className="text-4xl">🔌</div>
              <h2 className="text-lg font-bold">Conectar Seu Backend</h2>
              <p className="text-sm" style={mutedStyle}>
                Comece verificando que o Hermes Workspace pode alcançar seu
                backend compatível com OpenAI.
              </p>

              {backendStatus === 'checking' && (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={mutedStyle}
                >
                  <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                  Verificando capacidades do backend...
                </div>
              )}

              {backendStatus === 'ready' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-500">
                    <span className="size-2 rounded-full bg-green-500" />
                    {backendMessage}
                  </div>
                  <div
                    className="rounded-xl p-3 text-left text-xs"
                    style={cardStyle}
                  >
                    <p style={mutedStyle}>URL do Backend</p>
                    <p className="mt-1 font-mono">
                      {backendInfo?.hermesUrl || 'Configurado automaticamente'}
                    </p>
                  </div>
                </div>
              )}

              {backendStatus === 'error' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-red-400">
                    <span className="size-2 rounded-full bg-red-500" />
                    {backendMessage}
                  </div>
                  <div
                    className="rounded-xl p-3 text-left text-xs"
                    style={{ ...cardStyle, borderColor: 'var(--theme-border)' }}
                  >
                    <p className="font-medium text-white">
                      Backends compatíveis
                    </p>
                    <p className="mt-2" style={mutedStyle}>
                      Use qualquer backend que exponha{' '}
                      <code>/v1/chat/completions</code>. Se você apontar o Hermes
                      Workspace para um gateway Hermes, recursos aprimorados são
                      desbloqueados automaticamente.
                    </p>
                    <div
                      className="mt-3 rounded-lg px-3 py-2 font-mono text-[11px]"
                      style={{ background: 'rgba(0,0,0,0.2)' }}
                    >
                      pnpm dev
                    </div>
                    <div
                      className="mt-2 rounded-lg px-3 py-2 font-mono text-[11px]"
                      style={{ background: 'rgba(0,0,0,0.2)' }}
                    >
                      hermes --gateway
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => void checkBackend()}
                  className="flex-1 rounded-xl border py-3 text-sm font-semibold transition-colors"
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  Tentar novamente
                </button>
                <button
                  onClick={() => {
                    setStep('provider')
                    void loadModels()
                  }}
                  disabled={backendStatus !== 'ready'}
                  className="flex-1 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'provider' && (
            <div className="space-y-4">
              <h2 className="text-center text-lg font-bold">
                Escolher Provedor e Modelo
              </h2>
              <p className="text-center text-xs" style={mutedStyle}>
                {canEditConfig
                  ? 'Salve as configurações do provedor aqui, depois escolha um modelo antes de testar o chat.'
                  : 'Este backend gerencia as configurações do provedor fora do Hermes Workspace. Confirme o modelo que deseja usar e teste o chat.'}
              </p>

              <div className="rounded-xl p-3 text-xs" style={cardStyle}>
                <p style={mutedStyle}>Modo do backend</p>
                <p className="mt-1">
                  {backendInfo?.capabilities?.sessions
                    ? 'Gateway Hermes detectado'
                    : 'Backend portátil compatível com OpenAI'}
                </p>
                {configuredModel ? (
                  <p className="mt-2" style={mutedStyle}>
                    Modelo atual:{' '}
                    <span className="font-mono text-accent-400">
                      {configuredModel}
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvider(p.id)
                      setApiKey('')
                      setBaseUrl('')
                      setSaveError('')
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all',
                      selectedProvider === p.id ? 'ring-2 ring-accent-500' : '',
                    )}
                    style={cardStyle}
                  >
                    <ProviderLogo
                      provider={p.id}
                      size={40}
                      className="shrink-0 rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-xs" style={mutedStyle}>
                        {p.desc}
                      </div>
                    </div>
                    {selectedProvider === p.id ? (
                      <span className="ml-auto size-2.5 shrink-0 rounded-full bg-green-500" />
                    ) : null}
                  </button>
                ))}
              </div>

              {selectedProvider &&
                isOAuth &&
                selectedProvider === 'nous' &&
                canEditConfig && (
                  <div
                    className="space-y-3 rounded-xl p-4 text-left"
                    style={{ ...cardStyle, borderColor: 'var(--theme-border)' }}
                  >
                    {oauthStep === 'idle' && (
                      <button
                        onClick={startNousOAuth}
                        className="w-full rounded-lg bg-accent-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                      >
                        Conectar com Nous Portal
                      </button>
                    )}
                    {oauthStep === 'loading' && (
                      <div
                        className="flex items-center justify-center gap-2 py-2 text-sm"
                        style={mutedStyle}
                      >
                        <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                        Iniciando fluxo OAuth...
                      </div>
                    )}
                    {oauthStep === 'waiting' && (
                      <div className="space-y-3">
                        <div
                          className="flex items-center gap-2 text-sm"
                          style={mutedStyle}
                        >
                          <span className="size-2 animate-pulse rounded-full bg-yellow-400" />
                          Aguardando aprovação...
                        </div>
                        {oauthUserCode ? (
                          <div className="space-y-1 text-center">
                            <p className="text-xs" style={mutedStyle}>
                              Seu código
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-widest">
                              {oauthUserCode}
                            </p>
                          </div>
                        ) : null}
                        {oauthVerificationUrl ? (
                          <button
                            onClick={() =>
                              window.open(oauthVerificationUrl, '_blank')
                            }
                            className="w-full rounded-lg border py-2 text-xs font-medium"
                            style={{ borderColor: 'var(--theme-border)' }}
                          >
                            Abrir Nous Portal ↗
                          </button>
                        ) : null}
                      </div>
                    )}
                    {oauthStep === 'success' && (
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <span>✓</span>
                        <span>Autenticado com sucesso.</span>
                      </div>
                    )}
                    {oauthStep === 'error' && (
                      <div className="space-y-2">
                        <p className="text-xs text-red-400">
                          {oauthError || 'Autenticação falhou'}
                        </p>
                        <button
                          onClick={startNousOAuth}
                          className="w-full rounded-lg bg-accent-500 py-2 text-xs font-medium text-white"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    )}
                  </div>
                )}

              {selectedProvider &&
                isOAuth &&
                selectedProvider === 'openai-codex' &&
                canEditConfig && (
                  <div
                    className="space-y-2 rounded-xl p-4 text-left"
                    style={{ ...cardStyle, borderColor: 'var(--theme-border)' }}
                  >
                    <p className="text-sm font-medium">Execute no seu terminal</p>
                    <div
                      className="rounded-lg px-3 py-2 font-mono text-xs"
                      style={{ background: 'rgba(0,0,0,0.2)' }}
                    >
                      hermes auth login openai-codex
                    </div>
                    <p className="text-xs" style={mutedStyle}>
                      Após o fluxo de login ser concluído, clique abaixo para atualizar
                      as configurações do provedor.
                    </p>
                    <button
                      onClick={async () => {
                        await saveProviderConfig()
                        await loadModels()
                      }}
                      className="w-full rounded-lg bg-accent-500 py-2 text-xs font-medium text-white"
                    >
                      Já me autentiquei
                    </button>
                  </div>
                )}

              {selectedProvider && (needsApiKey || needsBaseUrl) && (
                <div className="space-y-2 pt-1">
                  {needsBaseUrl ? (
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium"
                        style={mutedStyle}
                      >
                        {selectedProvider === 'ollama'
                          ? 'Ollama URL'
                          : 'Base URL'}
                      </label>
                      <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder={
                          selectedProvider === 'ollama'
                            ? 'http://localhost:11434'
                            : 'https://api.example.com/v1'
                        }
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                        style={inputStyle}
                      />
                    </div>
                  ) : null}
                  {needsApiKey ? (
                    <div>
                      <label
                        className="mb-1 block text-xs font-medium"
                        style={mutedStyle}
                      >
                        API Key
                      </label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                        style={inputStyle}
                      />
                    </div>
                  ) : null}
                </div>
              )}

              <div>
                <label
                  className="mb-1 block text-xs font-medium"
                  style={mutedStyle}
                >
                  Modelo
                </label>
                {availableModels.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(e) =>
                      setSelectedModel(stripProviderPrefix(e.target.value))
                    }
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                    style={inputStyle}
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {stripProviderPrefix(model)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder={configuredModel || 'gpt-4.1'}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-500"
                    style={inputStyle}
                  />
                )}
                <p className="mt-2 text-xs" style={mutedStyle}>
                  {canFetchModels
                    ? 'Os modelos foram buscados do backend quando disponíveis.'
                    : 'Se o seu backend não expõe /v1/models, insira o nome do modelo manualmente.'}
                </p>
              </div>

              {!canEditConfig ? (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
                  A edição de provedor no app não está disponível neste backend. Isso
                  é opcional. Se o backend já está configurado, continue para
                  o teste de chat.
                </div>
              ) : null}

              {saveError ? (
                <p className="text-xs text-red-400">{saveError}</p>
              ) : null}

              <div className="flex gap-2">
                {selectedProvider &&
                canEditConfig &&
                (needsApiKey || needsBaseUrl) ? (
                  <button
                    onClick={() => void saveProviderConfig()}
                    disabled={
                      saving || (needsApiKey && !apiKey && !needsBaseUrl)
                    }
                    className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                ) : null}
                <button
                  onClick={async () => {
                    let ok = true
                    if (
                      selectedProvider &&
                      canEditConfig &&
                      (!isOAuth || oauthStep === 'success')
                    ) {
                      ok = await saveProviderConfig()
                    }
                    if (ok) {
                      ok = await saveModelSelection()
                    }
                    if (ok) {
                      setStep('test')
                      setTestStatus('idle')
                      setTestMessage('')
                    }
                  }}
                  disabled={!backendSupportsChat}
                  className="flex-1 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 'test' && (
            <div className="space-y-4 text-center">
              <div className="text-4xl">🧪</div>
              <h2 className="text-lg font-bold">Testar Chat</h2>
              <p className="text-sm" style={mutedStyle}>
                Verifique se o chat principal funciona primeiro. Os recursos avançados do Hermes
                são opcionais e aparecem automaticamente quando suportados.
              </p>

              <div
                className="rounded-xl p-3 text-left text-xs"
                style={cardStyle}
              >
                <p style={mutedStyle}>Backend</p>
                <p className="mt-1 font-mono">
                  {backendInfo?.hermesUrl || 'Configurado automaticamente'}
                </p>
                {selectedModel || configuredModel ? (
                  <p className="mt-2" style={mutedStyle}>
                    Modelo:{' '}
                    <span className="font-mono text-accent-400">
                      {stripProviderPrefix(selectedModel || configuredModel)}
                    </span>
                  </p>
                ) : null}
              </div>

              {testStatus === 'idle' ? (
                <button
                  onClick={testConnection}
                  className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Enviar Mensagem de Teste
                </button>
              ) : null}

              {testStatus === 'testing' ? (
                <div
                  className="flex items-center justify-center gap-2 text-sm"
                  style={mutedStyle}
                >
                  <span className="size-2 animate-pulse rounded-full bg-accent-500" />
                  Aguardando a resposta do backend...
                </div>
              ) : null}

              {testStatus === 'success' ? (
                <div className="space-y-3">
                  <div
                    className="rounded-xl p-3 text-left text-sm"
                    style={cardStyle}
                  >
                    <span className="font-medium text-green-500">
                      Assistente:
                    </span>{' '}
                    <span>{testMessage}</span>
                  </div>
                  <button
                    onClick={() => setStep('done')}
                    className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Continuar
                  </button>
                </div>
              ) : null}

              {testStatus === 'error' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-3 text-left text-sm">
                    <p className="mb-1 font-medium text-red-400">
                      Teste de chat falhou
                    </p>
                    <p className="text-xs" style={mutedStyle}>
                      {testMessage}
                    </p>
                    {testMessage.includes('401') ||
                    testMessage.toLowerCase().includes('key') ? (
                      <p className="mt-2 text-xs text-yellow-400">
                        Verifique suas credenciais do provedor e acesso à conta.
                      </p>
                    ) : testMessage.toLowerCase().includes('model') ? (
                      <p className="mt-2 text-xs text-yellow-400">
                        Confirme que o modelo selecionado existe neste backend.
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-yellow-400">
                        Confirme que o backend está em execução e ainda acessível pelo
                        Hermes Workspace.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={testConnection}
                      className="flex-1 rounded-lg bg-accent-500 py-2 text-xs font-medium text-white"
                    >
                      Tentar novamente
                    </button>
                    <button
                      onClick={() => setStep('provider')}
                      className="flex-1 rounded-lg border py-2 text-xs font-medium"
                      style={{ borderColor: 'var(--theme-border)' }}
                    >
                      ← Voltar
                    </button>
                  </div>
                  <button
                    onClick={() => setStep('done')}
                    className="mx-auto block text-xs"
                    style={mutedStyle}
                  >
                    Pular por agora
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {step === 'done' && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-bold">Workspace Pronto</h2>
              <p className="text-sm" style={mutedStyle}>
                Chat principal configurado.{' '}
                {enhancedFeatures.length > 0
                  ? 'Este backend também expõe melhorias do gateway Hermes.'
                  : 'Se você conectar um gateway Hermes depois, recursos aprimorados são desbloqueados automaticamente.'}
              </p>
              <div
                className="grid grid-cols-3 gap-2 text-xs"
                style={mutedStyle}
              >
                <div className="rounded-xl p-2" style={cardStyle}>
                  <div className="mb-1 text-lg">💬</div>
                  <div>Chat Pronto</div>
                </div>
                <div className="rounded-xl p-2" style={cardStyle}>
                  <div className="mb-1 text-lg">🔗</div>
                  <div>
                    {enhancedFeatures.length > 0 ? 'Aprimorado' : 'Portátil'}
                  </div>
                </div>
                <div className="rounded-xl p-2" style={cardStyle}>
                  <div className="mb-1 text-lg">🧠</div>
                  <div>
                    {enhancedFeatures.length > 0
                      ? enhancedFeatures.length
                      : 'Opcional'}{' '}
                    Extras
                  </div>
                </div>
              </div>
              {enhancedFeatures.length > 0 ? (
                <p className="text-xs" style={mutedStyle}>
                  Disponível agora: {enhancedFeatures.join(', ')}.
                </p>
              ) : null}
              <button
                onClick={complete}
                className="w-full rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
              >
                Abrir Workspace
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
