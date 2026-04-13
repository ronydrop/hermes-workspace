import type { Step } from 'react-joyride'

export const tourSteps: Array<Step> = [
  // Step 1: Welcome
  {
    target: 'body',
    placement: 'center',
    title: 'Bem-vindo ao Hermes Workspace! ⚕',
    content: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <img
          src="/hermes-avatar.webp"
          alt="Hermes"
          style={{ width: 48, height: 48, borderRadius: 12 }}
        />
        <p style={{ textAlign: 'center', margin: 0 }}>
          Seu centro de comando com IA para gerenciar agentes, chats, arquivos e
          mais. Vamos fazer um tour rápido!
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  // Step 2: Sidebar
  {
    target: '[data-tour="sidebar-container"]',
    placement: 'right',
    title: 'Navegação na Barra Lateral',
    content:
      'Navegue entre todas as suas ferramentas aqui. Recolha/expanda seções para personalizar seu workspace.',
  },
  // Step 3: New Session
  {
    target: '[data-tour="new-session"]',
    placement: 'right',
    title: 'Iniciar uma Nova Sessão',
    content:
      'Clique aqui para iniciar uma nova sessão de chat com IA. Cada conversa é salva automaticamente.',
  },
  // Step 4: Dashboard
  {
    target: '[data-tour="dashboard"]',
    placement: 'right',
    title: 'Seu Painel',
    content:
      'Visão geral de sessões, uso e atividade. Veja tudo de relance.',
  },
  // Step 5: Agent Hub
  {
    target: '[data-tour="agent-hub"]',
    placement: 'right',
    title: 'Hub de Agentes',
    content:
      'Gerencie seus agentes de IA e configurações. Crie agentes personalizados com comportamentos especializados.',
  },
  // Step 7: Skills
  {
    target: '[data-tour="skills"]',
    placement: 'right',
    title: 'Biblioteca de Skills',
    content:
      'Navegue e instale skills de agentes para expandir capacidades. Adicione novas ferramentas e habilidades aos seus agentes.',
  },
  // Step 8: Terminal
  {
    target: '[data-tour="terminal"]',
    placement: 'right',
    title: 'Terminal Integrado',
    content:
      'Terminal integrado para comandos rápidos. Execute comandos shell sem sair do Hermes Workspace.',
  },
  // Step 9: Usage Meter (in header)
  {
    target: '[data-tour="usage-meter"]',
    placement: 'bottom',
    title: 'Monitor de Uso',
    content:
      'Monitore o uso do seu provedor de IA em tempo real. Acompanhe custos e consumo de API.',
  },
  // Step 10: Settings
  {
    target: '[data-tour="settings"]',
    placement: 'right',
    title: 'Configurações e Personalização',
    content:
      'Configure provedores, temas, cores de destaque e muito mais. Faça o Hermes Workspace ser seu.',
  },
  // Step 11: Finish
  {
    target: 'body',
    placement: 'center',
    title: 'Tudo pronto! 🎉',
    content:
      'Comece a conversar com sua IA, explore as ferramentas e personalize o Hermes Workspace para o seu fluxo de trabalho. Precisa de ajuda? Pressione ? para ver todos os atalhos de teclado.',
  },
]
