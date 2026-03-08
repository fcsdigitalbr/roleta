# Boas práticas e guia de configuração – Roleta Casal da Bet

Este documento consolida os requisitos do projeto e as configurações necessárias para a roleta funcionar corretamente. Consulte também os arquivos referenciados abaixo.

---

## Requisitos do projeto (MAPA_DO_PROJETO.md)

| # | Requisito | Onde conferir |
|---|-----------|----------------|
| 1 | Formulário de cadastro (nome, e-mail, WhatsApp, ID Casal da Bet) | `index.html` – campos configuráveis via PROMDATA |
| 2 | Aceitar termos e condições (checkbox centralizado) | Container de termos no formulário |
| 3 | Ao enviar o form, usuário pode girar a roleta | Submit interceptado; roleta (iframe) liberada após envio |
| 4 | Dados do form enviados para Google Sheets | `CONFIG_ROLETA_CASAL_DA_BET.PLANILHA_LEADS_URL` em `index.html` |
| 5 | Planilha: Planilha_roleta | Apps Script anexado ao mesmo projeto |
| 6 | Background da home (desktop/mobile) | CSS `.page_bg_image` com imagens em `img/` |
| 7 | Notificações aleatórias (“Fulano ganhou X”) | Barra no topo; script inline em `index.html` |
| 8 | Identidade Casal da Bet (título, badge, textos) | PROMDATA e textos na página |
| 9 | Layout responsivo (mobile e desktop) | Bootstrap + estilos customizados |

---

## Configuração da roleta (Guia em `roleta/`)

- **Prêmios e segmentos:** configurados em `roleta/clean-integration/wheel.js` (array `SEGMENTS`). Para alterar prêmios, edite o campo `prize` de cada segmento.
- **Imagem da roleta:** URL em `wheel.js` (`WHEEL_IMAGE_URL`). Padrão do projeto: CDN da roleta.
- **Duração do giro:** `SPIN_DURATION_MS` em `wheel.js` (em milissegundos).

Consulte também:
- `roleta/Guia de Configuração da Roleta de Prêmios.md`
- `roleta/Mapeamento da Roleta de Prêmios.md`

---

## Integração iframe (roleta na página principal)

- A roleta é exibida em um **iframe** que carrega `roleta/clean-integration/wheel-embed.html`.
- O **botão de girar** é o **submit do formulário** na página principal; não há botão dentro do iframe.
- **Comportamento da roleta:** giro lento contínuo (idle) até o usuário clicar em girar; ao clicar, giro realista (~4,8 s) e resultado sempre “Sem prêmio” / “Não deu desta vez” / “Quase lá!” (tela de perdeu).
- **Visual:** sem círculo branco ao redor da roleta (override em `.roleta-iframe-wrapper`); iframe sem barras de rolagem (`scrolling="no"`, `overflow: hidden` na página embed).
- **Scroll:** ao clicar em girar, a posição de scroll da página é preservada (sem “pulo”).
- Comunicação: a página principal envia `postMessage({ type: 'ROLETA_SPIN' })` ao iframe; o iframe responde com `postMessage({ type: 'ROLETA_RESULT', ... })`.
- Garantir que o iframe e a página principal estejam no **mesmo domínio** (ou configurar `postMessage` com origem permitida) para a comunicação funcionar.

---

## Checklist antes de publicar (VERIFICACAO_ANTES_DE_USAR.md)

1. **Planilha Google**
   - [ ] URL do Web App em `CONFIG_ROLETA_CASAL_DA_BET.PLANILHA_LEADS_URL` (não deixar `SEU_SCRIPT_ID`).
   - [ ] Apps Script implantado; teste enviando o formulário e conferindo nova linha na planilha.

2. **Formulário → roleta**
   - [ ] Preencher form, aceitar termos, clicar em **GIRAR A ROLETA!**.
   - [ ] Formulário some, iframe da roleta aparece e gira sozinho; em seguida exibe tela de ganhou ou perdeu.

3. **Teste rápido**
   - [ ] Abrir a página → preencher form → marcar termos → enviar.
   - [ ] Roleta (iframe) aparece e gira; resultado (ganhou/perdeu) é exibido.

---

## Referências

- `MAPA_DO_PROJETO.md` – mapa e requisitos gerais
- `VERIFICACAO_ANTES_DE_USAR.md` – checklist de verificação
- `mNbMpDY6yqS3.com/INSTRUCOES_GOOGLE_SHEETS.md` – passo a passo da planilha
- `mNbMpDY6yqS3.com/roleta/Guia de Configuração da Roleta de Prêmios.md` – configuração de prêmios e segmentos
