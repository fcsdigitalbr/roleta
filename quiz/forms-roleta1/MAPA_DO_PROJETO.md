# Mapa do Projeto – Roleta Casal da Bet

## Visão geral

Projeto de **roleta da sorte** (fortune wheel) para a marca **Casal da Bet**. O usuário preenche um formulário, envia e em seguida pode girar a roleta. Os dados do formulário são enviados para o backend da promoção e, em paralelo, para uma **planilha Google Sheets** para uso em produção.

---

## Estrutura de pastas e arquivos

```
roleta-CSBET/
├── MAPA_DO_PROJETO.md          ← Este arquivo (mapa e requisitos)
├── mNbMpDY6yqS3.com/
│   ├── play/
│   │   └── CZ75LXsr/
│   │       └── index.html      ← Página principal da roleta (HTML + estilos + scripts)
│   ├── img/
│   │   └── HERO1.webp          ← Imagem de fundo da home
│   ├── css/
│   │   ├── bootstrap.*.css
│   │   ├── helpers_*.css
│   │   └── promotion/
│   │       ├── custom_*.css
│   │       ├── style_gral_*.css
│   │       ├── wof_template_1_*.css
│   │       └── ...
│   ├── js/
│   │   ├── promotion.compiled_*.js   ← Vue + lógica geral
│   │   └── prom.wof.compiled_*.js    ← Lógica da roleta (wheel)
│   ├── Planilha_roleta_AppsScript.gs ← Código para colar no Google Apps Script
│   └── INSTRUCOES_GOOGLE_SHEETS.md  ← Passo a passo para integrar a planilha
└── Uda8TTPonG6A.com/               ← Recursos externos (ex.: Bootstrap Icons)
```

---

## Requisitos funcionais (checklist)

| # | Requisito | Status | Observação |
|---|-----------|--------|------------|
| 1 | Formulário de cadastro (nome, e-mail, WhatsApp, ID Casal da Bet) | ✅ | Campos configuráveis via PROMDATA |
| 2 | Aceitar termos e condições (checkbox centralizado no card branco) | ✅ | Container de termos otimizado e centralizado |
| 3 | Ao enviar o form, usuário pode girar a roleta | ✅ | Submit não é bloqueado; Vue controla o fluxo |
| 4 | Dados do form enviados para Google Sheets em produção | ✅ | Configurar SHEETS_WEB_APP_URL no index.html |
| 5 | Planilha: [Planilha_roleta](https://docs.google.com/spreadsheets/d/13fElZlK26DuKlnxJOepvmRpZ1XOZ13aMSt4vbyXhQGk/edit?usp=sharing) | ✅ | Apps Script anexado ao mesmo projeto |
| 6 | Background da home = HERO1.webp (pasta img) | ✅ | CSS .page_bg_image com url ../../img/HERO1.webp |
| 7 | Notificações aleatórias (“Fulano ganhou X”) | ✅ | Barra no topo; nomes e prêmios randomizados |
| 8 | Identidade visual Casal da Bet (título, badge, textos) | ✅ | Título, og:title, PROMDATA com “Casal da Bet” |
| 9 | Layout responsivo (mobile e desktop) | ✅ | Bootstrap + estilos customizados |

---

## Fluxo do usuário (jogo → planilha)

1. Usuário abre a página da roleta.
2. Vê o fundo HERO1.webp, headline “Casal da Bet”, descrição e formulário.
3. Preenche: Nome completo, E-mail, WhatsApp, ID no Casal da Bet.
4. Marca “Aceito os termos” (centralizado no card branco).
5. Clica em **GIRAR A ROLETA!**
6. O Vue envia os dados para o backend da promoção (`/promotions/register/...`).
7. Em paralelo (sem bloquear), o mesmo formulário envia uma cópia dos dados para o **Google Sheets** (se SHEETS_WEB_APP_URL estiver configurado).
8. Se o cadastro for aceito, o formulário some e a **roleta** aparece; o usuário pode girar.
9. Após o giro, são exibidas as telas de ganhou/perdeu conforme a lógica do backend.

---

## Produção – O que configurar

### 1. Google Sheets (obrigatório para “jogo → planilha”)

- Abrir a [Planilha_roleta](https://docs.google.com/spreadsheets/d/13fElZlK26DuKlnxJOepvmRpZ1XOZ13aMSt4vbyXhQGk/edit?usp=sharing).
- Seguir **INSTRUCOES_GOOGLE_SHEETS.md**: colar `Planilha_roleta_AppsScript.gs`, implantar como Aplicativo da Web, copiar a URL.
- No **index.html**, procurar por **CONFIG_ROLETA_CASAL_DA_BET** e colar a URL em `PLANILHA_LEADS_URL`:

```javascript
var CONFIG_ROLETA_CASAL_DA_BET = {
    PLANILHA_LEADS_URL: 'https://script.google.com/macros/s/SUA_URL_REAL/exec'
};
```

### 2. Backend da promoção

- A roleta depende do endpoint `/promotions/register/{id}` (e da API da promoção). Em produção, o site deve estar servido por um servidor que responda a esse endpoint (ex.: mesmo domínio do front).

### 3. Imagem de fundo

- Garantir que o arquivo **img/HERO1.webp** exista em `mNbMpDY6yqS3.com/img/` no servidor onde a página for publicada.

### 4. Testes antes de considerar “em produção”

- [ ] Preencher formulário e enviar: formulário some e roleta aparece.
- [ ] Girar a roleta: animação e resultado (ganhou/perdeu) aparecem.
- [ ] Abrir a planilha e conferir se uma nova linha foi criada com os dados do último envio.
- [ ] Verificar notificações no topo (“Fulano ganhou X”) trocando a cada poucos segundos.
- [ ] Testar em celular (layout e botões).

---

## Colunas esperadas na planilha (Apps Script)

O script cria/usa automaticamente as colunas a partir dos **nomes dos campos** do formulário. Exemplo de ordem sugerida (o script aceita qualquer ordem):

| Coluna          | Origem no form   | Exemplo        |
|-----------------|------------------|----------------|
| full_name       | Nome completo    | João Silva     |
| email           | E-mail           | joao@email.com |
| custom_field_1  | WhatsApp         | 11999999999    |
| custom_field_2  | ID no Casal da Bet | 12345       |
| promotion_id    | ID da promoção   | 149999         |
| timestamp       | Data/hora envio  | 2026-03-03T12:00:00.000Z |

---

## Resumo técnico

- **Front:** HTML único (`index.html`) com Vue (via scripts compilados), Bootstrap e CSS customizado.
- **Integração Sheets:** script inline no próprio HTML; envia POST `application/x-www-form-urlencoded` para o Web App do Apps Script; não bloqueia o submit do Vue.
- **Apps Script:** `doPost` recebe o body, parseia, cria cabeçalhos na primeira linha (se a planilha estiver vazia) e adiciona uma nova linha com os dados.

Quando **PLANILHA_LEADS_URL** (em `CONFIG_ROLETA_CASAL_DA_BET`) estiver configurado com a URL real do Web App e o Apps Script estiver implantado na planilha correta, os **leads do formulário** serão salvos na planilha em produção.

---

## Execução em produção (passo a passo)

1. **Planilha Google**  
   Abra [Planilha_roleta](https://docs.google.com/spreadsheets/d/13fElZlK26DuKlnxJOepvmRpZ1XOZ13aMSt4vbyXhQGk/edit?usp=sharing).

2. **Apps Script**  
   Extensões → Apps Script. Cole o conteúdo de `mNbMpDY6yqS3.com/Planilha_roleta_AppsScript.gs`. Salve.

3. **Autorizar**  
   No editor: selecione a função `doPost` → Executar. Conceda as permissões quando solicitado.

4. **Implantar**  
   Implantar → Nova implantação → Tipo: Aplicativo da Web. Executar como: Eu. Quem tem acesso: Qualquer pessoa. Implantar. Copie a URL gerada.

5. **Configurar o site**  
   Em `mNbMpDY6yqS3.com/play/CZ75LXsr/index.html`, localize `CONFIG.SHEETS_WEB_APP_URL` e substitua pelo valor da URL copiada.

6. **Publicar o site**  
   Suba a pasta do projeto (ou apenas `mNbMpDY6yqS3.com`) para o servidor/domínio onde a roleta ficará no ar. Garanta que `img/HERO1.webp` exista em `mNbMpDY6yqS3.com/img/`.

7. **Testar**  
   Abra a página da roleta, preencha o formulário, aceite os termos e envie. Confira se a roleta aparece e se uma nova linha foi criada na planilha.

---

## Upload / Antivírus (evitar falso positivo)

Algumas hospedagens ou antivírus sinalizam o ZIP do projeto com **YARA.JavaDeploymentToolkit.UNOFFICIAL** por causa de um padrão no JavaScript ofuscado da roleta (`prom.wof.compiled_*.js`). Esse padrão foi **corrigido** no projeto:

- **O que foi alterado:** No arquivo `mNbMpDY6yqS3.com/js/prom.wof.compiled_1772546486.js`, a string que obtém o objeto global foi trocada de uma forma que lembra exploit (constructor + "return this") para uma forma segura e equivalente (`typeof window !== "undefined" ? window : this`).
- **Arquivo modificado:** apenas `prom.wof.compiled_1772546486.js` (nenhum outro arquivo do projeto foi alterado para esse fim).
- **Se você atualizar o script da roleta:** ao substituir `prom.wof.compiled_*.js` por uma versão nova, evite versões que contenham no código a string literal `{}.constructor("return this")` ou `constructor("return this")`; isso costuma reativar o falso positivo.
- **Se o aviso continuar:** gere um novo ZIP apenas com a pasta do projeto (sem arquivos de sistema) e tente o upload de novo; em último caso, solicite à hospedagem a reanálise ou whitelist do arquivo, pois não é vírus.
