// Bound to the Sheet (Extensions > Apps Script). Passcode is a Script Property named PASSCODE.
const pass_ = () => PropertiesService.getScriptProperties().getProperty('PASSCODE');
const json_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const sheet_ = n => SpreadsheetApp.getActive().getSheetByName(n);
const fmt_ = v => v instanceof Date ? Utilities.formatDate(v, 'UTC', 'yyyy-MM-dd') : v;
const rows_ = n => { const [h, ...r] = sheet_(n).getDataRange().getValues(); return r.map(x => Object.fromEntries(h.map((k, i) => [k, fmt_(x[i])]))); };

function doGet(e) {
  if (e.parameter.pass !== pass_()) return json_({ error: 'bad_passcode' });
  return json_({ results: rows_('Results'), players: rows_('Players').filter(p => p.active !== false) });
}
function doPost(e) { // text/plain JSON body avoids a CORS preflight
  const b = JSON.parse(e.postData.contents);
  if (b.pass !== pass_()) return json_({ error: 'bad_passcode' });
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = sheet_('Results'), data = sh.getDataRange().getValues();
    const idx = data.findIndex((r, i) => i > 0 && fmt_(r[0]) === b.date && r[1] === b.player);
    if (idx > 0 && !b.overwrite) return json_({ error: 'duplicate' });
    const row = [b.date, b.player, b.score, b.depth || '', b.raw_input || '', new Date().toISOString()];
    idx > 0 ? sh.getRange(idx + 1, 1, 1, 6).setValues([row]) : sh.appendRow(row);
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}
