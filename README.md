# Plataforma de IA Ajudante

Uma plataforma para geração inteligente de propostas e currículos utilizando inteligência artificial, com foco em eficiência, histórico de gerações e notificações em tempo real.

## Funcionalidades

* **Geração de propostas com IA:** crie propostas a partir da descrição da solicitação.
* **Geração de currículos:** gere currículos fornecendo descrição da vaga, idioma, senioridade, área de foco e mercado.
* **Processos assíncronos:** tanto a geração de propostas quanto de currículos são realizadas de forma assíncrona para melhor desempenho.
* **Histórico de gerações:** acompanhe todas as propostas e currículos gerados.
* **Notificações em tempo real (SSE):**

  * TOAST para informar quando o processo foi concluído.
  * Atualização automática do histórico sem necessidade de recarregar a página.
* **Cache eficiente com Redis:** armazenamento de dados frequentemente acessados para melhorar a performance.