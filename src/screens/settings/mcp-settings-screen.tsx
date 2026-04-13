import {
  Add01Icon,
  ArrowLeft01Icon,
  Copy01Icon,
  Delete02Icon,
  Edit01Icon,
  RefreshIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { writeTextToClipboard } from '@/lib/clipboard'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type Transport = 'stdio' | 'http'

type McpServer = {
  name: string
  transport: Transport
  command?: string
  args?: Array<string>
  env?: Record<string, string>
  url?: string
  headers?: Record<string, string>
  timeout?: number
  connectTimeout?: number
  auth?: unknown
}

type McpServersResponse = {
  ok?: boolean
  code?: string
  message?: string
  servers?: Array<McpServer>
}

type ServerDraft = {
  name: string
  transport: Transport
  command: string
  args: string
  envText: string
  url: string
  headersText: string
  timeout: string
}

const EMPTY_DRAFT: ServerDraft = {
  name: '',
  transport: 'stdio',
  command: '',
  args: '',
  envText: '',
  url: '',
  headersText: '',
  timeout: '',
}

function recordToLines(value?: Record<string, string>): string {
  if (!value) return ''
  return Object.entries(value)
    .map(([key, entry]) => `${key}=${entry}`)
    .join('\n')
}

function parseKeyValueLines(value: string): Record<string, string> | undefined {
  const entries = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const separatorIndex = line.indexOf('=')
      if (separatorIndex === -1) return []
      const key = line.slice(0, separatorIndex).trim()
      const entry = line.slice(separatorIndex + 1).trim()
      return key ? [[key, entry] as const] : []
    })

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function parseArgs(value: string): Array<string> | undefined {
  const items = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  return items.length > 0 ? items : undefined
}

function buildDraft(server?: McpServer | null): ServerDraft {
  if (!server) return EMPTY_DRAFT
  return {
    name: server.name,
    transport: server.transport,
    command: server.command ?? '',
    args: (server.args ?? []).join(', '),
    envText: recordToLines(server.env),
    url: server.url ?? '',
    headersText: recordToLines(server.headers),
    timeout: server.timeout ? String(server.timeout) : '',
  }
}

function formatServerSummary(server: McpServer): string {
  if (server.transport === 'http') return server.url || 'Nenhuma URL configurada'
  const args = server.args?.join(' ') || ''
  return (
    [server.command, args].filter(Boolean).join(' ').trim() ||
    'Nenhum comando configurado'
  )
}

function yamlScalar(value: string): string {
  if (/^[A-Za-z0-9_./:@${}-]+$/.test(value)) return value
  return JSON.stringify(value)
}

function yamlArray(values: Array<string>): string {
  return `[${values.map((value) => yamlScalar(value)).join(', ')}]`
}

function yamlMap(value: Record<string, string>, indent: string): Array<string> {
  return Object.entries(value).map(
    ([key, entry]) => `${indent}${key}: ${yamlScalar(entry)}`,
  )
}

function buildYamlSnippet(servers: Array<McpServer>): string {
  if (servers.length === 0) return 'mcp_servers: {}'

  const lines = ['mcp_servers:']
  for (const server of servers) {
    lines.push(`  ${server.name}:`)
    if (server.transport === 'http') {
      if (server.url) lines.push(`    url: ${yamlScalar(server.url)}`)
      if (server.headers && Object.keys(server.headers).length > 0) {
        lines.push('    headers:')
        lines.push(...yamlMap(server.headers, '      '))
      }
    } else {
      if (server.command)
        lines.push(`    command: ${yamlScalar(server.command)}`)
      if (server.args && server.args.length > 0) {
        lines.push(`    args: ${yamlArray(server.args)}`)
      }
      if (server.env && Object.keys(server.env).length > 0) {
        lines.push('    env:')
        lines.push(...yamlMap(server.env, '      '))
      }
    }
    if (typeof server.timeout === 'number')
      lines.push(`    timeout: ${server.timeout}`)
    if (typeof server.connectTimeout === 'number') {
      lines.push(`    connect_timeout: ${server.connectTimeout}`)
    }
    if (
      server.auth &&
      typeof server.auth === 'object' &&
      !Array.isArray(server.auth)
    ) {
      lines.push('    auth:')
      lines.push(
        ...Object.entries(server.auth as Record<string, unknown>).map(
          ([key, value]) => `      ${key}: ${yamlScalar(String(value))}`,
        ),
      )
    }
  }

  return lines.join('\n')
}

function validateDraft(
  draft: ServerDraft,
  existingNames: Array<string>,
  originalName?: string,
): string | null {
  const name = draft.name.trim()
  if (!name) return 'O nome do servidor é obrigatório.'
  if (!/^[A-Za-z0-9_-]+$/.test(name)) {
    return 'Use letras, números, sublinhados ou hifens para o nome do servidor.'
  }
  if (existingNames.includes(name) && name !== originalName) {
    return 'Já existe um servidor com esse nome.'
  }
  if (draft.transport === 'stdio' && !draft.command.trim()) {
    return 'O comando é obrigatório para servidores stdio.'
  }
  if (draft.transport === 'http' && !draft.url.trim()) {
    return 'A URL é obrigatória para servidores HTTP.'
  }
  if (draft.timeout.trim()) {
    const timeout = Number(draft.timeout)
    if (!Number.isFinite(timeout) || timeout <= 0) {
      return 'O timeout deve ser um número positivo.'
    }
  }
  return null
}

function ServerDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  draft: ServerDraft
  setDraft: React.Dispatch<React.SetStateAction<ServerDraft>>
  onSave: () => void
  editingName?: string
}) {
  const { open, onOpenChange, draft, setDraft, onSave, editingName } = props

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(720px,96vw)]">
        <div className="space-y-5 p-5 md:p-6">
          <div className="space-y-1">
            <DialogTitle>
              {editingName ? 'Editar Servidor MCP' : 'Adicionar Servidor MCP'}
            </DialogTitle>
            <DialogDescription>
              Configure os detalhes do servidor e gere um trecho YAML atualizado.
            </DialogDescription>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                Nome
              </span>
              <Input
                value={draft.name}
                placeholder="filesystem"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <div className="md:col-span-2">
              <Tabs
                value={draft.transport}
                onValueChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    transport: value as Transport,
                  }))
                }
              >
                <TabsList className="rounded-xl border border-primary-200 bg-primary-50 p-1">
                  <TabsTrigger value="stdio">Stdio</TabsTrigger>
                  <TabsTrigger value="http">HTTP</TabsTrigger>
                </TabsList>
                <TabsContent value="stdio" className="mt-4 space-y-4">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                      Comando
                    </span>
                    <Input
                      value={draft.command}
                      placeholder="npx"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          command: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                      Argumentos
                    </span>
                    <Input
                      value={draft.args}
                      placeholder="-y, @modelcontextprotocol/server-filesystem, /tmp"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          args: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                      Variáveis de Ambiente
                    </span>
                    <textarea
                      value={draft.envText}
                      rows={4}
                      placeholder={'API_KEY=${MCP_API_KEY}\nLOG_LEVEL=debug'}
                      className="min-h-[108px] w-full rounded-lg border border-primary-200 bg-surface px-3 py-2 text-sm text-primary-900 outline-none placeholder:text-primary-500"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          envText: event.target.value,
                        }))
                      }
                    />
                  </label>
                </TabsContent>
                <TabsContent value="http" className="mt-4 space-y-4">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                      URL
                    </span>
                    <Input
                      value={draft.url}
                      placeholder="https://api.github.com/mcp"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          url: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                      Cabeçalhos
                    </span>
                    <textarea
                      value={draft.headersText}
                      rows={4}
                      placeholder={
                        'Authorization=Bearer ${GITHUB_TOKEN}\nX-Workspace=hermes'
                      }
                      className="min-h-[108px] w-full rounded-lg border border-primary-200 bg-surface px-3 py-2 text-sm text-primary-900 outline-none placeholder:text-primary-500"
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          headersText: event.target.value,
                        }))
                      }
                    />
                  </label>
                </TabsContent>
              </Tabs>
            </div>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-primary-600">
                Timeout (segundos)
              </span>
              <Input
                type="number"
                min={1}
                value={draft.timeout}
                placeholder="30"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    timeout: event.target.value,
                  }))
                }
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <DialogClose>Cancelar</DialogClose>
            <Button onClick={onSave}>
              {editingName ? 'Salvar Alterações' : 'Adicionar Servidor'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}

export function McpSettingsScreen() {
  const [servers, setServers] = useState<Array<McpServer>>([])
  const [originalServers, setOriginalServers] = useState<Array<McpServer>>([])
  const [loading, setLoading] = useState(true)
  const [reloadPending, setReloadPending] = useState(false)
  const [reloadAvailable, setReloadAvailable] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingName, setEditingName] = useState<string | undefined>()
  const [draft, setDraft] = useState<ServerDraft>(EMPTY_DRAFT)

  useEffect(() => {
    async function loadServers() {
      setLoading(true)
      try {
        const response = await fetch('/api/mcp/servers')
        const payload = (await response
          .json()
          .catch(() => ({}))) as McpServersResponse
        const loadedServers = Array.isArray(payload.servers)
          ? payload.servers
          : []
        setServers(loadedServers)
        setOriginalServers(loadedServers)
        if (payload.ok === false) setReloadAvailable(false)
        setNotice(payload.message ?? null)
      } catch {
        setNotice(
          'Não foi possível carregar a configuração MCP do Hermes. Você ainda pode rascunhar servidores aqui.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadServers()
  }, [])

  const yamlSnippet = useMemo(() => buildYamlSnippet(servers), [servers])

  const isDirty = useMemo(() => {
    return JSON.stringify(servers) !== JSON.stringify(originalServers)
  }, [servers, originalServers])

  function openAddDialog() {
    setEditingName(undefined)
    setDraft(EMPTY_DRAFT)
    setDialogOpen(true)
  }

  function openEditDialog(server: McpServer) {
    setEditingName(server.name)
    setDraft(buildDraft(server))
    setDialogOpen(true)
  }

  function handleSave() {
    const error = validateDraft(
      draft,
      servers.map((server) => server.name),
      editingName,
    )

    if (error) {
      toast(error, { type: 'error' })
      return
    }

    const nextServer: McpServer = {
      ...(servers.find((server) => server.name === editingName) ?? {}),
      name: draft.name.trim(),
      transport: draft.transport,
      command: draft.transport === 'stdio' ? draft.command.trim() : undefined,
      args: draft.transport === 'stdio' ? parseArgs(draft.args) : undefined,
      env:
        draft.transport === 'stdio'
          ? parseKeyValueLines(draft.envText)
          : undefined,
      url: draft.transport === 'http' ? draft.url.trim() : undefined,
      headers:
        draft.transport === 'http'
          ? parseKeyValueLines(draft.headersText)
          : undefined,
      timeout: draft.timeout.trim() ? Number(draft.timeout) : undefined,
    }

    setServers((current) => {
      const remaining = current.filter((server) => server.name !== editingName)
      return [...remaining, nextServer].sort((a, b) =>
        a.name.localeCompare(b.name),
      )
    })
    setDialogOpen(false)
    toast(
      editingName
        ? 'Servidor MCP atualizado no rascunho local.'
        : 'Servidor MCP adicionado ao rascunho local.',
      {
        type: 'success',
      },
    )
  }

  async function handleCopySnippet() {
    try {
      await writeTextToClipboard(yamlSnippet)
      setOriginalServers(servers)
      toast('Trecho YAML copiado.', { type: 'success' })
    } catch {
      toast('Área de transferência indisponível.', { type: 'error' })
    }
  }

  async function handleReload() {
    setReloadPending(true)
    try {
      const response = await fetch('/api/mcp/reload', { method: 'POST' })
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        message?: string
      }
      toast(
        payload.message ||
          (payload.ok ? 'Recarregamento solicitado.' : 'Recarregamento indisponível.'),
        {
          type: payload.ok ? 'success' : 'info',
        },
      )
    } catch {
      toast('Não foi possível acessar o endpoint de recarregamento.', { type: 'error' })
    } finally {
      setReloadPending(false)
    }
  }

  return (
    <div className="min-h-full bg-surface">
      <main className="mx-auto w-full max-w-5xl px-4 py-6 text-primary-900 md:px-6 md:py-8">
        <div className="space-y-5">
          <header className="rounded-2xl border border-primary-200 bg-primary-50/80 p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-2 w-fit"
                  render={
                    <Link to="/settings">
                      <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        size={16}
                        strokeWidth={1.8}
                      />
                      Voltar às Configurações
                    </Link>
                  }
                />
                <div>
                  <h1 className="text-lg font-semibold text-primary-900">
                    Servidores MCP
                  </h1>
                  <p className="mt-1 text-sm text-primary-600">
                    Revise os servidores MCP configurados, rascunhe alterações localmente e
                    copie o YAML em
                    <code className="mx-1 rounded bg-white px-1.5 py-0.5 font-mono text-xs">
                      config.yaml
                    </code>
                    até que as gravações de configuração do gateway sejam implementadas.
                  </p>
                </div>
              </div>
              <Button size="sm" onClick={openAddDialog}>
                <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.8} />
                Adicionar Servidor
              </Button>
            </div>
          </header>

          {notice ? (
            <div className="rounded-2xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-600 shadow-sm">
              {notice}
            </div>
          ) : null}

          {isDirty ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
              Você tem alterações não salvas. Copie o YAML abaixo e cole em
              seu{' '}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                config.yaml
              </code>
              .
            </div>
          ) : null}

          <section className="rounded-2xl border border-primary-200 bg-primary-50/80 p-4 shadow-sm md:p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-medium text-primary-900">
                  Servidores Configurados
                </h2>
                <p className="mt-1 text-xs text-primary-600">
                  {servers.length} servidor{servers.length === 1 ? '' : 'es'} no
                  rascunho local atual.
                </p>
              </div>
              {reloadAvailable ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReload}
                  disabled={reloadPending}
                >
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    size={16}
                    strokeWidth={1.8}
                  />
                  {reloadPending ? 'Recarregando...' : 'Recarregar Servidores MCP'}
                </Button>
              ) : (
                <span
                  className="text-xs text-primary-400"
                  title="Recarregamento MCP não disponível neste gateway"
                >
                  Recarregamento indisponível
                </span>
              )}
            </div>

            {loading ? (
              <div className="rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-primary-600">
                Carregando servidores MCP...
              </div>
            ) : null}

            {!loading && servers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-primary-300 bg-white px-4 py-8 text-center text-sm text-primary-600">
                Nenhum servidor MCP encontrado ainda. Adicione um para gerar um trecho de configuração inicial.
              </div>
            ) : null}

            {servers.length > 0 ? (
              <div className="grid gap-3">
                {servers.map((server) => (
                  <article
                    key={server.name}
                    className="rounded-2xl border border-primary-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg">
                            {server.transport === 'http' ? '🌐' : '📡'}
                          </span>
                          <h3 className="text-sm font-semibold text-primary-900">
                            {server.name}
                          </h3>
                          <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary-700">
                            {server.transport}
                          </span>
                        </div>
                        <p className="truncate text-sm text-primary-700">
                          {formatServerSummary(server)}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary-500">
                          <span>
                            timeout:{' '}
                            {server.timeout ? `${server.timeout}s` : 'padrão'}
                          </span>
                          {server.connectTimeout ? (
                            <span>connect: {server.connectTimeout}s</span>
                          ) : null}
                          {server.auth ? <span>autenticação configurada</span> : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(server)}
                        >
                          <HugeiconsIcon
                            icon={Edit01Icon}
                            size={14}
                            strokeWidth={1.8}
                          />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'text-red-600 hover:bg-red-50 hover:text-red-700',
                          )}
                          onClick={() => {
                            setServers((current) =>
                              current.filter(
                                (entry) => entry.name !== server.name,
                              ),
                            )
                            toast(`${server.name} removido do rascunho local.`, {
                              type: 'success',
                            })
                          }}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={14}
                            strokeWidth={1.8}
                          />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-primary-200 bg-primary-50/80 p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-base font-medium text-primary-900">
                  YAML Gerado
                </h2>
                <p className="mt-1 text-sm text-primary-600">
                  Adicione isso ao seu{' '}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
                    config.yaml
                  </code>{' '}
                  sob{' '}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
                    mcp_servers
                  </code>
                  .
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopySnippet}>
                <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={1.8} />
                Copiar para Área de Transferência
              </Button>
            </div>

            <pre className="mt-4 overflow-x-auto rounded-2xl border border-primary-200 bg-white p-4 text-xs leading-6 text-primary-800">
              <code>{yamlSnippet}</code>
            </pre>
          </section>
        </div>
      </main>

      <ServerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        draft={draft}
        setDraft={setDraft}
        onSave={handleSave}
        editingName={editingName}
      />
    </div>
  )
}
