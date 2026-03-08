# Enviar dados do formulário da roleta para o Google Sheets

Sua planilha: [Planilha_roleta](https://docs.google.com/spreadsheets/d/13fElZlK26DuKlnxJOepvmRpZ1XOZ13aMSt4vbyXhQGk/edit?usp=sharing)

## Passo a passo

1. **Abra a planilha** no link acima.

2. **Abra o Apps Script**  
   Menu **Extensões** → **Apps Script**.

3. **Cole o código**  
   Abra o arquivo `Planilha_roleta_AppsScript.gs` neste projeto, copie todo o conteúdo e cole no editor do Apps Script (substituindo o que estiver lá). Salve (Ctrl+S).

4. **Primeira execução (autorizar)**  
   No editor, selecione a função **doPost** no menu de funções e clique em **Executar**.  
   Na primeira vez, o Google pede autorização: clique em **Revisar permissões** → escolha sua conta → **Avançado** → **Ir para [nome do projeto] (não seguro)** → **Permitir**.  
   (O script também tem **doGet**, usado na implantação; não é preciso executá-lo manualmente.)

5. **Implantar como Aplicativo da Web**  
   - Menu **Implantar** → **Nova implantação**  
   - Ao lado de **Tipo**, clique na engrenagem e escolha **Aplicativo da Web**  
   - **Descrição**: ex.: "Roleta Casal da Bet"  
   - **Executar como**: Eu  
   - **Quem tem acesso**: Qualquer pessoa  
   - Clique em **Implantar**  
   - Copie a **URL do aplicativo da web** (algo como `https://script.google.com/macros/s/XXXX.../exec`).

6. **Colar a URL no site da roleta**  
   No arquivo `play/CZ75LXsr/index.html`, procure por **CONFIG_ROLETA_CASAL_DA_BET** ou **PLANILHA_LEADS_URL**:

   ```javascript
   var CONFIG_ROLETA_CASAL_DA_BET = {
       PLANILHA_LEADS_URL: 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec'
   };
   ```

   Substitua o valor de `PLANILHA_LEADS_URL` pela URL que você copiou no passo 5 (a URL termina em `/exec`). Os leads do formulário passarão a ser salvos na planilha.

Depois disso, **todos os leads** do formulário da roleta (nome completo, e-mail, telefone, campos personalizados, aceite dos termos, etc.) serão centralizados na aba **"Leads"** da planilha. Se a aba "Leads" não existir, o script a cria. Na primeira linha, o script define automaticamente os cabeçalhos (full_name, email, phone, custom_field_1, custom_field_2, accept_terms, promotion_id, timestamp, etc.).
