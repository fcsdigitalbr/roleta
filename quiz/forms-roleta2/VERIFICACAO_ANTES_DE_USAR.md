# Verificação antes de usar / publicar

Use este checklist para ter certeza de que as alterações estão corretas antes de publicar ou enviar o projeto.

---

## 1. Roleta – velocidade ao clicar em “Girar”

**Arquivo:** `mNbMpDY6yqS3.com/js/prom.wof.compiled_1772546486.js`

| Item | Valor atual | Confere? |
|------|-------------|----------|
| Easing | `Power1.easeOut` (menos “travando” no final) | ☐ |
| Duração ao montar | 0,6 s, 4 giros | ☐ |
| Duração ao clicar “Girar” | 0,5 s, 4 giros | ☐ |

**Teste manual:** Abra a página → preencha o form → aceite termos → clique **GIRAR A ROLETA!**. A roleta deve girar em ~0,5 s até parar no prêmio, sem ficar “quase parando” por muito tempo.

---

## 2. Formulário → roleta (submit)

**Arquivo:** `mNbMpDY6yqS3.com/play/CZ75LXsr/index.html`

| Item | Comportamento esperado | Confere? |
|------|------------------------|----------|
| Submit interceptado | Listener em captura; `preventDefault` + `stopImmediatePropagation` | ☐ |
| Dados enviados à planilha | `enviarLeadsParaPlanilha(dadosLeads)` com os campos do form | ☐ |
| Roleta liberada na hora | `setTimeout(liberarERodarRoleta, 150)` após o submit | ☐ |

**Teste manual:** Preencha nome, e-mail, WhatsApp, ID, marque os termos e clique em **GIRAR A ROLETA!**. O formulário deve sumir, a roleta aparecer e girar sozinha em seguida (~0,5 s).

---

## 3. Planilha (Google Sheets)

**Arquivo:** `mNbMpDY6yqS3.com/Planilha_roleta_AppsScript.gs`

| Item | Confere? |
|------|----------|
| `doGet` retorna JSON com `ok: true` | ☐ |
| `doPost` lê `postData.contents`, faz parse e grava linha na planilha | ☐ |

**Teste manual:** Com a URL do Web App configurada em `CONFIG_ROLETA_CASAL_DA_BET.PLANILHA_LEADS_URL`, envie o form e confira se uma nova linha aparece na planilha com os dados preenchidos.

---

## 4. Configuração no index.html

| Item | Onde ver | Confere? |
|------|----------|----------|
| URL da planilha | `CONFIG_ROLETA_CASAL_DA_BET.PLANILHA_LEADS_URL` | ☐ |
| Se ainda for placeholder `SEU_SCRIPT_ID`, a planilha não receberá dados até trocar pela URL real | Linha ~382 do index.html | ☐ |

---

## 5. Resumo do que foi alterado (roleta rápida)

- **prom.wof.compiled_1772546486.js**
  - Easing: `Expo.easeOut` → `Power1.easeOut`
  - Animação inicial: `duration: 0.6`, `spins: 4`
  - No clique “Girar”: `duration: 0.5`, `spins: 4`

Nenhuma outra parte do projeto foi alterada para a velocidade da roleta. O fluxo de submit (interceptar form, enviar para planilha, liberar roleta) continua como já estava.

---

## Teste rápido em 3 passos

1. Abrir `index.html` (ou a URL do site) no navegador.
2. Preencher o formulário, marcar termos e clicar **GIRAR A ROLETA!**.
3. Verificar: formulário some → roleta aparece → gira em ~0,5 s e para no prêmio → tela de ganhou/perdeu.

Se esses 3 passos funcionarem, as alterações estão ok para uso.
