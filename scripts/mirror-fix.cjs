#!/usr/bin/env node
/**
 * Зеркало стороннего сайта с авто-исправлениями SEO (для демо «исправленной версии»).
 * Скачивает страницы из sitemap, применяет фиксы (title/description/H1/canonical/og/JSON-LD
 * + SEO-текст с таблицами), абсолютизирует ассеты на исходный домен, сохраняет статикой.
 *
 * Запуск: node scripts/mirror-fix.cjs <url> <outDir> [--max N]
 * Только для сайтов, на которые у пользователя есть права.
 */
const fs = require('fs');
const path = require('path');

const SITE = process.argv[2];
const OUT = process.argv[3];
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const MAX = Number(getOpt('--max', 80));
if (!SITE || !OUT) { console.error('Использование: node scripts/mirror-fix.cjs <url> <outDir> [--max N]'); process.exit(1); }

const ORIGIN = new URL(SITE).origin;
const base = SITE.endsWith('/') ? SITE : SITE + '/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const log = (m) => process.stderr.write(m + '\n');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function fetchText(url) {
  try { const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' } }); return { status: r.status, html: await r.text() }; }
  catch (e) { return { status: 0, html: '', error: e.message }; }
}

function shortenTitle(t) {
  t = t.trim();
  if (t.length <= 65) return t;
  for (const sep of [' — ', ' | ', ' – ', ' - ', ', ']) { const i = t.indexOf(sep); if (i >= 30 && i <= 60) return t.slice(0, i).trim(); }
  return t.slice(0, 59).replace(/\s+\S*$/, '').trim() + '…';
}

const tag = (h, re) => { const m = h.match(re); return m ? m[1].trim() : null; };

function seoBlock(topic) {
  const tl = topic.toLowerCase();
  return `<section class="seo-text-section" style="max-width:1100px;margin:32px auto;padding:24px;border-top:1px solid #ddd;font-family:Arial,sans-serif;line-height:1.6;color:#333">
  <h2 style="font-size:22px;margin:0 0 12px">${esc(topic)} — подробнее</h2>
  <p>${esc(topic)} — важный раздел каталога. Ниже — полезная информация о выборе, характеристиках и доставке, которая поможет принять решение и улучшает релевантность страницы для поиска.</p>
  <details><summary style="cursor:pointer;color:#c0142b;font-weight:600;margin:8px 0">Читать полностью</summary>
  <h3 style="margin:16px 0 6px">Как выбрать</h3>
  <p>При выборе обращайте внимание на материалы, габариты, функциональность и гарантию. Правильный подбор под задачи помещения обеспечивает удобство и долговечность.</p>
  <table style="width:100%;border-collapse:collapse;margin:14px 0"><thead><tr><th style="border:1px solid #ccc;padding:8px;background:#f5f5f5;text-align:left">Параметр</th><th style="border:1px solid #ccc;padding:8px;background:#f5f5f5;text-align:left">На что смотреть</th></tr></thead>
  <tbody><tr><td style="border:1px solid #ccc;padding:8px">Материал</td><td style="border:1px solid #ccc;padding:8px">Износостойкость, экологичность</td></tr><tr><td style="border:1px solid #ccc;padding:8px">Габариты</td><td style="border:1px solid #ccc;padding:8px">Соответствие помещению</td></tr><tr><td style="border:1px solid #ccc;padding:8px">Гарантия</td><td style="border:1px solid #ccc;padding:8px">Срок и условия</td></tr></tbody></table>
  <h3 style="margin:16px 0 6px">Доставка и оплата</h3>
  <table style="width:100%;border-collapse:collapse;margin:14px 0"><thead><tr><th style="border:1px solid #ccc;padding:8px;background:#f5f5f5;text-align:left">Услуга</th><th style="border:1px solid #ccc;padding:8px;background:#f5f5f5;text-align:left">Условия</th></tr></thead>
  <tbody><tr><td style="border:1px solid #ccc;padding:8px">Доставка</td><td style="border:1px solid #ccc;padding:8px">По городу и в регионы</td></tr><tr><td style="border:1px solid #ccc;padding:8px">Оплата</td><td style="border:1px solid #ccc;padding:8px">Наличные, карта, рассрочка</td></tr></tbody></table>
  <p>Остались вопросы по «${esc(tl)}»? Свяжитесь с нами — поможем подобрать оптимальный вариант под ваш бюджет и задачи.</p>
  </details></section>`;
}

function fixHtml(url, html) {
  let title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '';
  const h1count = (html.match(/<h1[\s>]/gi) || []).length;
  const topic = (title.split(/[—|–\-,]/)[0] || 'Каталог').trim() || 'Каталог';

  // 1) title: укоротить длинный / задать при отсутствии
  if (!title) { title = `${topic} — RimMebel`; html = html.replace(/<head([^>]*)>/i, `<head$1>\n<title>${esc(title)}</title>`); }
  else if (title.length > 65) { const nt = shortenTitle(title); html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(nt)}</title>`); }

  // 2) meta description при отсутствии
  if (!/<meta[^>]+name=["']description["']/i.test(html)) {
    html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(topic)} — каталог, цены, доставка. Большой выбор и выгодные условия.">`);
  }
  // 3) canonical при отсутствии
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<\/head>/i, `<link rel="canonical" href="${esc(url)}">\n</head>`);
  }
  // 4) Open Graph при отсутствии
  if (!/<meta[^>]+property=["']og:/i.test(html)) {
    const ogImg = (html.match(/<img[^>]+src=["']([^"']+)["']/i) || [, ''])[1];
    const ogAbs = ogImg ? new URL(ogImg, url).toString() : '';
    html = html.replace(/<\/head>/i, `<meta property="og:type" content="website">\n<meta property="og:title" content="${esc(title)}">\n<meta property="og:url" content="${esc(url)}">${ogAbs ? `\n<meta property="og:image" content="${esc(ogAbs)}">` : ''}\n</head>`);
  }
  // 5) JSON-LD при отсутствии
  if (!/application\/ld\+json/i.test(html)) {
    const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: topic, item: url }] };
    html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
  }
  // 6) H1 при отсутствии — добавляем в начало body
  if (h1count === 0) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n<h1 style="position:absolute;left:-9999px;top:auto">${esc(topic)}</h1>`);
  }
  // 7) SEO-текст с таблицами перед </body>
  html = html.replace(/<\/body>/i, `${seoBlock(topic)}\n</body>`);

  // 8) Абсолютизируем ассеты/ссылки на исходный домен (чтобы стили/картинки грузились)
  html = html.replace(/(src|href)=["']\/(?!\/)([^"']*)["']/gi, (m, a, p) => `${a}="${ORIGIN}/${p}"`);
  html = html.replace(/(<head[^>]*>)/i, `$1\n<base href="${ORIGIN}/">`);
  return html;
}

function outPathFor(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/^\/+/, '');
  if (p === '' || p.endsWith('/')) p += 'index.html';
  else if (!/\.[a-z0-9]+$/i.test(p)) p += '/index.html';
  else if (!p.endsWith('.html')) p += '/index.html';
  return path.join(OUT, p);
}

(async () => {
  log('Скачиваю sitemap…');
  const sm = await fetchText(new URL('sitemap.xml', base).toString());
  // Перепривязываем URL из sitemap к нужному хосту/схеме (sitemap может быть на www/http).
  let urls = Array.from(sm.html.matchAll(/<loc>(.*?)<\/loc>/g), (m) => {
    try { const u = new URL(m[1].trim()); return new URL(u.pathname.replace(/^\//, '') + u.search, base).toString(); } catch { return null; }
  }).filter(Boolean);
  urls = Array.from(new Set(urls)).slice(0, MAX);
  if (!urls.length) urls = [SITE];
  log(`Страниц к зеркалированию: ${urls.length}`);

  let ok = 0;
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    const r = await fetchText(u);
    if (r.status < 200 || r.status >= 400 || !r.html) { log(`  ✗ ${u} (${r.status})`); continue; }
    const fixed = fixHtml(u, r.html);
    const out = outPathFor(u);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, fixed);
    ok++;
    if (ok % 10 === 0) log(`  ${ok}/${urls.length}`);
  }
  console.log(JSON.stringify({ mirrored: ok, total: urls.length, out: OUT }));
})();
