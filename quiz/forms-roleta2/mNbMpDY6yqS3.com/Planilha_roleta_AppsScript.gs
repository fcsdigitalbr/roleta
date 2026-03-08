/**
 * Integração Roleta Casal da Bet → Planilha Google (PRODUÇÃO)
 * Todos os leads do formulário são centralizados na aba "Leads".
 *
 * Planilha: https://docs.google.com/spreadsheets/d/13fElZlK26DuKlnxJOepvmRpZ1XOZ13aMSt4vbyXhQGk/edit
 *
 * USO:
 * 1. Extensões → Apps Script → cole este código → Salvar
 * 2. Executar doPost uma vez → Autorizar
 * 3. Implantar → Nova implantação → Aplicativo da Web → Qualquer pessoa → Implantar
 * 4. Copie a URL e configure PLANILHA_LEADS_URL no index.html da roleta
 */

var SHEET_NAME_LEADS = 'Leads';

// Resposta padrão JSON (CORS-friendly para produção)
function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// doGet: necessário para implantar como Web App (retorna status do serviço)
function doGet(e) {
  return jsonOutput({
    ok: true,
    service: 'Roleta Casal da Bet - Planilha',
    method: 'GET',
    use: 'POST form data to this URL to append a row to the sheet'
  });
}

// Garante que a aba "Leads" existe e está ativa (todos os leads centralizados aqui)
function getLeadsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_LEADS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_LEADS);
  }
  return sheet;
}

// doPost: recebe os dados do formulário e adiciona uma linha na aba Leads
function doPost(e) {
  try {
    var sheet = getLeadsSheet();
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    if (!body || typeof body !== 'string') {
      return jsonOutput({ ok: false, error: 'Sem dados no body' });
    }
    var params = parseFormUrlEncoded(body);
    if (Object.keys(params).length === 0) {
      return jsonOutput({ ok: false, error: 'Nenhum campo recebido' });
    }
    var headers = getOrCreateHeaders(sheet, params);
    var row = headers.map(function(h) { return params[h] || ''; });
    sheet.appendRow(row);
    return jsonOutput({ ok: true, sheet: SHEET_NAME_LEADS, row: sheet.getLastRow() });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.toString() });
  }
}

function parseFormUrlEncoded(str) {
  var out = {};
  var pairs = (str || '').split('&');
  for (var i = 0; i < pairs.length; i++) {
    var p = pairs[i];
    var eq = p.indexOf('=');
    if (eq === -1) continue;
    try {
      var key = decodeURIComponent(p.substring(0, eq).replace(/\+/g, ' '));
      var val = decodeURIComponent(p.substring(eq + 1).replace(/\+/g, ' '));
      out[key] = val;
    } catch (decodeErr) {}
  }
  return out;
}

// Ordem das colunas na planilha (todos os leads centralizados com mesmas colunas)
var COLUMN_ORDER = [
  'full_name',
  'first_name',
  'last_name',
  'email',
  'phone',
  'custom_field_1',
  'custom_field_2',
  'accept_terms',
  'promotion_id',
  'ua_device',
  'ua_browser',
  'ua_category',
  'timestamp'
];

function getOrCreateHeaders(sheet, params) {
  var lastRow = sheet.getLastRow();
  var keys = Object.keys(params);
  var headers = [];
  if (lastRow >= 1) {
    var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers = headerRow.map(String).filter(Boolean);
    keys.forEach(function(k) {
      if (headers.indexOf(k) === -1) headers.push(k);
    });
    return headers;
  }
  var ordered = [];
  COLUMN_ORDER.forEach(function(k) {
    if (keys.indexOf(k) !== -1) ordered.push(k);
  });
  keys.forEach(function(k) {
    if (ordered.indexOf(k) === -1) ordered.push(k);
  });
  headers = ordered;
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return headers;
}
