#!/usr/bin/env node
/**
 * Брендированный PDF-отчёт SeoMarket из результата краулера (тёмная тема):
 * оценки + смета + пояснения по каждой проблеме + список затронутых страниц
 * со ссылками + кнопка «Оплатить».
 * Использование: node scripts/report-from-audit.cjs <audit.json> [--site "Имя"] [--date dd.mm.yyyy] [--out report.html] [--checkout URL]
 */
const fs = require('fs');
const inPath = process.argv[2];
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const d = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const siteName = getOpt('--site', d.site);
const OUT = getOpt('--out', '/tmp/report.html');
const DATE = getOpt('--date', '');
const pages = d.pages || [];

const fmt = (n) => n.toLocaleString('ru-RU');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };

// Цены (модель сайта: ошибки 300₽, предупреждения 150₽), пояснения, детектор страниц, метрика.
const ISSUES = {
  missing_title: { n: 'Отсутствует <title>', price: 300, rec: 'Добавить уникальный заголовок', why: 'Без title страница плохо ранжируется и невзрачно выглядит в выдаче.', hit: (p) => !p.title, m: () => 'нет' },
  missing_desc: { n: 'Нет meta description', price: 300, rec: 'Описание 120–160 символов', why: 'Description формирует сниппет в поиске и влияет на кликабельность.', hit: (p) => !p.desc, m: () => 'нет' },
  missing_h1: { n: 'Нет H1', price: 300, rec: 'Добавить один H1', why: 'H1 задаёт главную тему страницы для поисковика и пользователя.', hit: (p) => p.h1 === 0, m: () => 'H1=0' },
  missing_canonical: { n: 'Нет rel="canonical"', price: 300, rec: 'Проставить канонические URL', why: 'Canonical предотвращает дубли и склейку страниц в индексе.', hit: (p) => !p.canonical, m: () => 'нет' },
  bad_title_len: { n: 'Длина title вне 10–65', price: 150, rec: 'Сократить до 50–60 символов', why: 'Длинные заголовки обрезаются в выдаче «…», теряется смысл и CTR.', hit: (p) => p.title && (p.titleLen < 10 || p.titleLen > 65), m: (p) => p.titleLen + ' симв' },
  thin: { n: 'Тонкий контент (<250 слов)', price: 150, rec: 'Расширить тексты до 300+ слов', why: 'Поисковики предпочитают содержательные страницы; тонкий контент хуже ранжируется.', hit: (p) => p.words < 250, m: (p) => p.words + ' слов' },
  missing_og: { n: 'Нет Open Graph (og:image)', price: 150, rec: 'Добавить og-теги', why: 'Без og-тегов ссылки в соцсетях/мессенджерах выглядят без превью.', hit: (p) => !p.ogImage, m: () => 'нет' },
  no_jsonld: { n: 'Нет структурированных данных', price: 150, rec: 'Добавить JSON-LD', why: 'Schema.org даёт расширенные сниппеты и лучше понимается поисковиком.', hit: (p) => p.jsonld === 0, m: () => 'нет' },
};

const S = d.scores;
const sc = S.global >= 80 ? '#22c55e' : S.global >= 60 ? '#f5a623' : '#ef4444';
const bar = (l, v) => `<div class="bar"><span class="bl">${l}</span><div class="bt"><div class="bf" style="width:${v}%;background:${v >= 80 ? '#22c55e' : v >= 60 ? '#f5a623' : '#ef4444'}"></div></div><span class="bv">${v}</span></div>`;

const items = Object.entries(d.issues_count).filter(([k, v]) => v > 0 && ISSUES[k]).sort((a, b) => b[1] - a[1]);
items.forEach(([k, v]) => (ISSUES[k].sum = ISSUES[k].price * v));
const total = items.reduce((a, [k, v]) => a + ISSUES[k].price * v, 0);
const totalPages = items.reduce((a, [, v]) => a + v, 0);
const CHECKOUT = getOpt('--checkout', `https://alex1986-rgb.github.io/seomagic-saas-tool/checkout?url=${encodeURIComponent(d.site)}&pages=${totalPages}&price=150&score=${S.global}`);

const smetaRows = items.map(([k, v], i) => `<tr><td class="num">${i + 1}</td><td><b>${ISSUES[k].n}</b><div class="rec">${ISSUES[k].rec}</div></td><td class="r"><span class="pill">${d.issues_pct[k]}%</span></td><td class="r">${fmt(ISSUES[k].price)} ₽</td><td class="r">${v}</td><td class="r"><b>${fmt(ISSUES[k].price * v)} ₽</b></td></tr>`).join('');

// Секции: пояснение + список страниц по каждой проблеме
const sections = items.map(([k]) => {
  const cfg = ISSUES[k];
  const hit = pages.filter(cfg.hit);
  const list = hit.slice(0, 60).map((p) => `<tr><td><a class="lnk" href="${esc(p.url)}">${esc(pathOf(p.url))}</a></td><td class="r"><span class="mt">${esc(cfg.m(p))}</span></td></tr>`).join('');
  const more = hit.length > 60 ? `<div class="more">…и ещё ${hit.length - 60} страниц</div>` : '';
  return `<h2>${cfg.n} — ${hit.length} страниц</h2>
  <div class="expl"><b>Почему это важно.</b> ${cfg.why} <b style="color:#ffb066">Рекомендация:</b> ${cfg.rec}.</div>
  <table class="pg"><thead><tr><th>Страница</th><th class="r">Показатель</th></tr></thead><tbody>${list}</tbody></table>${more}`;
}).join('');

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{background:#0a1020;color:#e8edf5;font-size:12.5px}
.hdr{position:relative;overflow:hidden;background:radial-gradient(1200px 220px at 82% -50%,rgba(255,255,255,.28),transparent),linear-gradient(120deg,#f2821e,#ff6b35 55%,#ff4d6d);padding:30px 36px;color:#fff}
.htop{display:flex;justify-content:space-between;align-items:flex-start}
.logo{display:flex;align-items:center;gap:12px}.lm{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800}
.brand{font-size:23px;font-weight:800}.brand span{font-weight:400;opacity:.9}.sub{font-size:11.5px;opacity:.93;margin-top:3px}
.hmeta{text-align:right;font-size:11.5px;opacity:.96;line-height:1.6}.tag{display:inline-block;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.3);padding:3px 11px;border-radius:20px;font-size:10.5px;font-weight:700;margin-top:8px}
.wrap{padding:24px 36px}.hero{display:flex;gap:30px;align-items:center;margin-bottom:18px}
.score{width:118px;height:118px;border-radius:50%;border:9px solid ${sc};display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;background:#0f1626}
.score b{font-size:31px;color:${sc};line-height:1}.score small{font-size:10.5px;color:#8b97ad;margin-top:3px}
.bars{flex:1}.bar{display:flex;align-items:center;gap:10px;margin:6px 0}.bl{width:140px;font-size:11.5px;color:#c3ccdb}.bt{flex:1;height:8px;background:#1d2638;border-radius:5px;overflow:hidden}.bf{height:100%}.bv{width:28px;text-align:right;font-weight:700;font-size:11.5px}
h2{font-size:14px;margin:20px 0 8px}table{width:100%;border-collapse:collapse}th{background:#15203a;color:#cdd6e6;text-align:left;padding:8px 10px;font-size:10px;text-transform:uppercase}th.r,td.r{text-align:right}
td{padding:8px 10px;border-bottom:1px solid #182236;vertical-align:top}.num{color:#6b788f;font-weight:700;width:22px}.rec{color:#7f8ba1;font-size:11px;margin-top:2px}.pill{background:rgba(245,166,35,.16);color:#fbbf24;border:1px solid rgba(245,166,35,.4);padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:700}
.total td{background:linear-gradient(135deg,#ee7d18,#ff6b35);color:#fff;font-weight:800;font-size:14px;padding:13px 10px;border:none}
.expl{background:#0f1626;border:1px solid #1d2638;border-left:3px solid #ee7d18;border-radius:8px;padding:10px 13px;font-size:11.5px;color:#aeb8c9;line-height:1.5;margin-bottom:8px}.expl b{color:#e8edf5}
.lnk{color:#5aa8ff;text-decoration:none;font-size:11.5px}.mt{color:#f87171;font-weight:600}.more{color:#8b97ad;font-size:11px;margin:6px 2px}
.pg td{padding:6px 10px}
.pay{margin:24px 0 6px;background:linear-gradient(135deg,#10182b,#0f1626);border:1px solid #2a3550;border-radius:16px;padding:20px 22px;display:flex;align-items:center;justify-content:space-between;gap:22px}
.pay-h{font-size:15px;font-weight:800}.pay-d{color:#aeb8c9;font-size:11.5px;line-height:1.5;margin-top:5px}
.payamt{font-size:24px;font-weight:800;margin:2px 0 9px}.paybtn{display:inline-block;background:linear-gradient(135deg,#ee7d18,#ff6b35);color:#fff;text-decoration:none;font-weight:800;font-size:13.5px;padding:12px 24px;border-radius:11px}
.pay-r{text-align:center;flex:none}
.ok{margin-top:14px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.35);border-radius:10px;padding:12px 14px;font-size:11.5px;color:#9fe7b8}
.foot{margin-top:18px;padding-top:12px;border-top:1px solid #1d2638;font-size:10px;color:#6b788f;display:flex;justify-content:space-between}
</style></head><body>
<div class="hdr"><div class="htop"><div class="logo"><div class="lm">S</div><div><div class="brand">Seo<span>Market</span></div><div class="sub">Автоматический SEO-аудит · реальный обход краулером</div></div></div>
<div class="hmeta"><b>${esc(siteName)}</b><br>Обойдено: ${d.scanned} стр.<br>Дата: ${esc(DATE)}</div></div><div class="tag">⚙ Реальные данные · ${d.scanned} страниц за ${d.duration_sec || '—'} с</div></div>
<div class="wrap">
<div class="hero"><div class="score"><b>${S.global}</b><small>из 100</small></div>
<div class="bars">${bar('SEO', S.seo)}${bar('Контент', S.content)}${bar('Технический', S.technical)}${bar('Соцсети (OG)', S.social)}</div></div>
${items.length ? `
<h2>Смета на исправление</h2>
<table><thead><tr><th>#</th><th>Проблема / рекомендация</th><th class="r">% стр.</th><th class="r">Цена/ед.</th><th class="r">Кол-во</th><th class="r">Сумма</th></tr></thead>
<tbody>${smetaRows}<tr class="total"><td colspan="5">ИТОГО К ИСПРАВЛЕНИЮ</td><td class="r">${fmt(total)} ₽</td></tr></tbody></table>

<div class="pay"><div><div class="pay-h">Исправить автоматически «под ключ»</div><div class="pay-d">После оплаты система создаст копию сайта, исправит код, развернёт демо, проведёт повторный аудит и пришлёт готовый сайт.</div></div>
<div class="pay-r"><div class="payamt">${fmt(total)} ₽</div><a class="paybtn" href="${esc(CHECKOUT)}">💳 Оплатить и исправить →</a></div></div>

${sections}` : '<div class="ok"><b>Проблем не найдено 🎉</b> Все проверенные параметры в норме.</div>'}
<div class="foot"><span>SeoMarket — автоматический SEO-аудит и исправление</span><span>${esc(DATE)}</span></div>
</div></body></html>`;
fs.writeFileSync(OUT, html);
console.log('total', total, 'issues', items.length, 'pages_listed', pages.length);
