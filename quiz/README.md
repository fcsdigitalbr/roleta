# Quiz CasaldaBet + Dashboard de Leads

Quiz em 7 etapas com dois finais (roleta 1 e 2) e dashboard para acompanhar leads, IPs e cliques.

## Requisitos

- **Node.js** 16 ou superior ([nodejs.org](https://nodejs.org))

## Rodar localmente

Na pasta do projeto:

```bash
npm install
npm start
```

O servidor sobe em **http://localhost:3000**.

- **Quiz:** [http://localhost:3000](http://localhost:3000) ou [http://localhost:3000/etapa1.html](http://localhost:3000/etapa1.html)
- **Login (dashboard):** [http://localhost:3000/login](http://localhost:3000/login) — senha padrão: **S12121972**
- **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (após fazer login)

Para produção, defina: `DASHBOARD_PASSWORD=sua_senha` e `SESSION_SECRET=um_segredo_forte`. Ex.: `DASHBOARD_PASSWORD=xxx SESSION_SECRET=yyy npm start`.

### Autenticação (boas práticas no backend)

- **Login obrigatório:** acesso ao dashboard e à API de leads só após login em `/login`.
- **Comparação timing-safe:** a senha é comparada por hash (SHA-256) com `crypto.timingSafeEqual` para evitar vazamento por tempo de resposta.
- **Rate limiting:** até 5 tentativas de login por IP a cada 15 minutos (proteção contra brute force).
- **Sessão segura:** cookie `httpOnly`, `sameSite` (strict em produção), `secure` em HTTPS.
- **Validação:** senha limitada em tamanho e sanitizada; nenhum dado sensível em log.

## Estrutura

| Caminho | Descrição |
|--------|-----------|
| `etapa1.html` … `etapa6.html` | Etapas do quiz |
| `forms-roleta1/`, `forms-roleta2/` | Páginas de destino (quem conhece / quem não conhece) |
| `login/` | Página de login do dashboard |
| `dashboard/` | Dashboard de leads (protegido por senha) |
| `server.js` | Servidor Express (API de tracking + arquivos estáticos) |
| `data/events.json` | Eventos de tracking (criado ao rodar) |
| `data/form-submissions.json` | Submissões dos formulários (roleta1/roleta2) |
| `lib/logger.js` | Logger (logs em `logs/app.log` e `logs/error.log`) |

### Formulário na página da roleta (tracking de preenchimento)

- O quiz **não** tem formulário: **forms-roleta1** e **forms-roleta2** só exibem a mensagem e o botão "Acessar minha recompensa", que leva à página da roleta.
- O **formulário fica na página da roleta**. Para os eventos de preenchimento serem trackeados e aparecerem no dashboard, a página da roleta deve enviar os dados para esta API:
  - **POST /api/lead** — ao enviar o formulário na roleta: body JSON `{ ramo: "LIDER" | "NOVO", nome, email, telefone }`. O backend valida e grava em `data/form-submissions.json`.
  - **POST /api/track** — (opcional) para eventos: ex. `{ event: "form_start" }` ao focar no form, `{ event: "form_submit", ramo: "LIDER" }` ao submeter. Assim o funil no dashboard reflete o uso do form na roleta.
- Se a roleta estiver em **outro domínio**, use a URL completa da API do quiz (ex.: `https://seu-quiz.com/api/lead`). CORS está habilitado.
- No **dashboard** continuam a aparecer: tabela de leads com Nome, E-mail, Telefone (quando a roleta tiver enviado **POST /api/lead**), "Formulários preenchidos" e "Últimas submissões de formulário".

### Logs e erros

- **Logs:** `logs/app.log` (todas as mensagens) e `logs/error.log` (apenas erros). O logger é usado em rotas críticas e no handler de erros global.
- **Tratamento de erros:** rotas com `try/catch` e `next(err)`; middleware global de erro retorna 500 (JSON ou HTML) e registra no log.
- **Saúde do sistema:** **GET /api/health** retorna `ok`, timestamp e contagem de eventos e submissões; útil para monitoramento.

O rastreamento (IP, etapas, cliques) e o envio de formulários só funcionam quando as páginas são acessadas pelo mesmo servidor (ex.: `http://localhost:3000`). Abrir os HTML direto no disco (`file://`) não envia dados.
