#!/usr/bin/env node
/**
 * Локальный сервис аудита больших сайтов с веб-интерфейсом.
 * Оборачивает scripts/audit-crawler.cjs: вводишь URL в браузере → реальный аудит
 * (sitemap/BFS, тысячи страниц, без CPU-лимитов edge) → результат с оценками.
 *
 * Запуск:  node scripts/audit-server.cjs   (по умолчанию http://localhost:8090)
 */
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

const PORT = Number(process.env.PORT || 8090);
const CRAWLER = path.join(__dirname, 'audit-crawler.cjs');

function runAudit({ url, max, concurrency }) {
  return new Promise((resolve) => {
    const args = [CRAWLER, url, '--max', String(max || 2000), '--concurrency', String(concurrency || 10)];
    const child = spawn(process.execPath, args, { cwd: path.dirname(__dirname) });
    let out = '', err = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('close', () => {
      try { resolve({ ok: true, data: JSON.parse(out) }); }
      catch { resolve({ ok: false, error: (err || out || 'Не удалось разобрать результат').slice(-400) }); }
    });
  });
}

const UI = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SeoMarket — аудит больших сайтов</title><style>
*{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif}
body{background:#0a1020;color:#e8edf5;min-height:100vh;padding:0 0 60px}
.hdr{background:linear-gradient(120deg,#f2821e,#ff6b35);padding:22px 28px;display:flex;align-items:center;gap:12px}
.logo{width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:22px;color:#fff}
.brand{color:#fff;font-size:21px;font-weight:800}.brand span{font-weight:400;opacity:.9}.sub{color:#fff;opacity:.92;font-size:12px}
.wrap{max-width:920px;margin:0 auto;padding:26px 20px}
.bar-input{display:flex;gap:10px;flex-wrap:wrap;background:#0f1626;border:1px solid #1d2638;border-radius:14px;padding:14px}
input,select{background:#0a1020;border:1px solid #243049;color:#e8edf5;border-radius:9px;padding:11px 13px;font-size:14px}
input#url{flex:1;min-width:240px}
button{background:linear-gradient(135deg,#ee7d18,#ff6b35);color:#fff;border:0;border-radius:9px;padding:11px 22px;font-weight:700;font-size:14px;cursor:pointer}
button:disabled{opacity:.6;cursor:default}
.hint{color:#8b97ad;font-size:12px;margin:10px 2px 0}
#status{margin:22px 0;color:#aeb8c9;font-size:14px;display:none}
.spin{display:inline-block;width:15px;height:15px;border:2px solid #ee7d18;border-top-color:transparent;border-radius:50%;animation:s 0.8s linear infinite;vertical-align:-2px;margin-right:8px}@keyframes s{to{transform:rotate(360deg)}}
#res{display:none}
.top{display:flex;gap:26px;align-items:center;margin:22px 0}
.ring{width:120px;height:120px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;background:#0f1626}
.ring b{font-size:33px;line-height:1}.ring small{font-size:11px;color:#8b97ad;margin-top:3px}
.bars{flex:1}.row{display:flex;align-items:center;gap:10px;margin:6px 0}.row .l{width:130px;font-size:12px;color:#c3ccdb}.tr{flex:1;height:8px;background:#1d2638;border-radius:5px;overflow:hidden}.tf{height:100%}.row .v{width:30px;text-align:right;font-weight:700;font-size:12px}
.meta{color:#8b97ad;font-size:12px;margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin-top:8px}
th{background:#15203a;color:#cdd6e6;text-align:left;padding:9px 11px;font-size:11px;text-transform:uppercase}
td{padding:9px 11px;border-bottom:1px solid #182236;font-size:13px}.tr-r{text-align:right}
.pill{padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700}
h2{font-size:15px;margin:22px 0 8px}
.err{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.4);color:#f87171;border-radius:10px;padding:12px;font-size:13px;display:none;margin-top:18px}
</style></head><body>
<div class="hdr"><div class="logo">S</div><div><div class="brand">Seo<span>Market</span></div><div class="sub">Аудит больших сайтов · локальный движок (без лимитов edge)</div></div></div>
<div class="wrap">
  <div class="bar-input">
    <input id="url" placeholder="https://ваш-сайт.ру" />
    <select id="max"><option value="500">до 500 стр.</option><option value="2000" selected>до 2000 стр.</option><option value="5000">до 5000 стр.</option></select>
    <button id="go" onclick="run()">Аудитировать</button>
  </div>
  <div class="hint">Источник страниц: sitemap.xml (или обход по ссылкам, если sitemap нет). Большие сайты — репрезентативная выборка по выбранному лимиту.</div>
  <div id="status"></div>
  <div class="err" id="err"></div>
  <div id="res">
    <div class="top">
      <div class="ring" id="ring"><b id="gv">—</b><small>из 100</small></div>
      <div class="bars" id="bars"></div>
    </div>
    <div class="meta" id="meta"></div>
    <h2>Проблемы</h2>
    <table><thead><tr><th>Проблема</th><th class="tr-r">% страниц</th><th class="tr-r">Страниц</th></tr></thead><tbody id="rows"></tbody></table>
  </div>
</div>
<script>
const NAMES={missing_title:'Нет title',bad_title_len:'Длина title вне 10–65',dup_title:'Дубли title',missing_desc:'Нет description',missing_h1:'Нет H1',missing_canonical:'Нет canonical',missing_og:'Нет og:image',thin:'Тонкий контент (<250 слов)',no_jsonld:'Нет JSON-LD'};
const col=v=>v>=80?'#22c55e':v>=60?'#f5a623':'#ef4444';
async function run(){
  const url=document.getElementById('url').value.trim();
  if(!url){return}
  const max=document.getElementById('max').value;
  const go=document.getElementById('go'); go.disabled=true;
  const st=document.getElementById('status'); st.style.display='block'; st.innerHTML='<span class="spin"></span>Идёт реальный обход сайта… (большие сайты — несколько минут)';
  document.getElementById('res').style.display='none'; document.getElementById('err').style.display='none';
  try{
    const r=await fetch('/api/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url,max})});
    const j=await r.json();
    if(!j.ok){throw new Error(j.error||'Ошибка аудита')}
    if(!j.data||j.data.scores==null||j.data.error){throw new Error((j.data&&j.data.error)||'Сайт недоступен для обхода (0 страниц)')}
    render(j.data);
  }catch(e){const er=document.getElementById('err');er.style.display='block';er.textContent='Ошибка: '+e.message}
  finally{go.disabled=false; st.style.display='none'}
}
function render(d){
  const S=d.scores;
  document.getElementById('gv').textContent=S.global;
  document.getElementById('ring').style.border='9px solid '+col(S.global);
  document.getElementById('gv').style.color=col(S.global);
  const bars=[['SEO',S.seo],['Контент',S.content],['Технический',S.technical],['Соцсети',S.social]];
  document.getElementById('bars').innerHTML=bars.map(([l,v])=>'<div class="row"><span class="l">'+l+'</span><div class="tr"><div class="tf" style="width:'+v+'%;background:'+col(v)+'"></div></div><span class="v">'+v+'</span></div>').join('');
  document.getElementById('meta').textContent='Обойдено '+d.scanned+' страниц за '+d.duration_sec+' с · '+d.site;
  const rows=Object.entries(d.issues_count).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  document.getElementById('rows').innerHTML=rows.length?rows.map(([k,v])=>{const p=d.issues_pct[k];const c=p>=50?'#ef4444':p>=20?'#f5a623':'#3b82f6';return '<tr><td>'+(NAMES[k]||k)+'</td><td class="tr-r"><span class="pill" style="background:'+c+'22;color:'+c+'">'+p+'%</span></td><td class="tr-r"><b>'+v+'</b></td></tr>'}).join(''):'<tr><td colspan="3" style="text-align:center;color:#4ade80;padding:16px">Проблем не найдено 🎉</td></tr>';
  document.getElementById('res').style.display='block';
}
</script></body></html>`;

http.createServer(async (req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(UI);
  }
  if (req.method === 'POST' && req.url === '/api/audit') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', async () => {
      try {
        const { url, max, concurrency } = JSON.parse(body || '{}');
        if (!url || !/^https?:\/\//.test(url)) {
          res.writeHead(400, { ...cors, 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: false, error: 'Укажите корректный URL (http/https)' }));
        }
        const result = await runAudit({ url, max, concurrency });
        res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(500, { ...cors, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Внутренняя ошибка сервиса' }));
      }
    });
    return;
  }
  res.writeHead(404, cors); res.end('Not found');
}).listen(PORT, () => console.log(`Сервис аудита больших сайтов: http://localhost:${PORT}`));
