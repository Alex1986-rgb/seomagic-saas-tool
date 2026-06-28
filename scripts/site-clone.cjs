#!/usr/bin/env node
/**
 * Надёжное самодостаточное зеркало сайта с SEO-фиксами.
 * Резолвит ВСЕ ассеты (относительные, корне-относительные, абсолютные, srcset,
 * inline url(), CSS url(), динамические image.php), скачивает локально и переписывает
 * ссылки на демо-абсолютные пути. Применяет SEO-фиксы (title/H1/meta/canonical/og/JSON-LD).
 *
 * node scripts/site-clone.cjs <startUrl> <outDir> <demoBaseUrl> [--max N]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const START = process.argv[2];
const OUT = process.argv[3];
const DEMO = (process.argv[4] || '').replace(/\/+$/, '') + '/';
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const MAX = Number(getOpt('--max', 10));
if (!START || !OUT || !process.argv[4]) { console.error('node scripts/site-clone.cjs <startUrl> <outDir> <demoBaseUrl> [--max N]'); process.exit(1); }

const ORIGIN = new URL(START).origin;
const base = START.endsWith('/') ? START : START + '/';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const log = (m) => process.stderr.write(m + '\n');
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rebind = (u) => { try { const x = new URL(u); return new URL(x.pathname.replace(/^\//, '') + x.search, base).toString(); } catch { return null; } };

async function fetchRaw(url) {
  try { const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' } }); return { status: r.status, buf: Buffer.from(await r.arrayBuffer()), ct: r.headers.get('content-type') || '' }; }
  catch (e) { return { status: 0, buf: Buffer.alloc(0), ct: '' }; }
}

const EXT_CT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg', 'text/css': '.css', 'application/javascript': '.js', 'font/woff2': '.woff2', 'font/woff': '.woff' };

// Карта: абсолютный URL ассета → локальный относительный путь
const assetMap = new Map();
function mapAsset(absUrl, ctHint) {
  if (assetMap.has(absUrl)) return assetMap.get(absUrl);
  const u = new URL(absUrl);
  let rel;
  const clean = u.pathname.replace(/^\/+/, '');
  const hasExt = /\.[a-z0-9]{2,5}$/i.test(clean);
  if (u.search || /\.php$/i.test(clean) || !hasExt) {
    const ext = EXT_CT[ctHint] || (clean.match(/\.[a-z0-9]{2,5}$/i) || ['.bin'])[0];
    rel = 'cloned-assets/' + crypto.createHash('md5').update(absUrl).digest('hex').slice(0, 16) + ext;
  } else {
    rel = clean;
  }
  assetMap.set(absUrl, rel);
  return rel;
}

const tag = (h, re) => { const m = h.match(re); return m ? m[1].trim() : null; };
function shortenTitle(t) { t = t.trim(); if (t.length <= 65) return t; for (const s of [' — ', ' | ', ' – ', ' - ', ', ']) { const i = t.indexOf(s); if (i >= 30 && i <= 60) return t.slice(0, i).trim(); } return t.slice(0, 59).replace(/\s+\S*$/, '').trim() + '…'; }

function seoFix(pageUrl, html) {
  let title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '';
  const topic = (title.split(/[—|–\-,]/)[0] || 'Каталог').trim() || 'Каталог';
  if (!title) { title = `${topic}`; html = html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`); }
  else if (title.length > 65) html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(shortenTitle(title))}</title>`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(topic)} — каталог, цены, доставка.">`);
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="canonical" href="${esc(pageUrl)}">\n</head>`);
  if (!/<meta[^>]+property=["']og:/i.test(html)) html = html.replace(/<\/head>/i, `<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${esc(pageUrl)}">\n</head>`);
  if (!/application\/ld\+json/i.test(html)) html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: topic, item: pageUrl }] })}</script>\n</head>`);
  if ((html.match(/<h1[\s>]/gi) || []).length === 0) html = html.replace(/<body([^>]*)>/i, `<body$1><h1 style="position:absolute;left:-9999px">${esc(topic)}</h1>`);
  return html;
}

// Переписываем ссылку: resolve относительно pageUrl, если наш хост — на демо-абсолютный локальный путь
function rewriteRef(ref, pageUrl) {
  const t = ref.trim();
  if (!t || t.startsWith('data:') || t.startsWith('#') || t.startsWith('mailto:') || t.startsWith('tel:') || t.startsWith('javascript:')) return null;
  let abs; try { abs = new URL(t, pageUrl).toString(); } catch { return null; }
  if (new URL(abs).origin !== ORIGIN) {
    // внешние ассеты: апгрейд http→https, оставляем как есть
    return abs.replace(/^http:\/\//i, 'https://');
  }
  const rel = mapAsset(abs);
  return DEMO + rel;
}

function processHtmlRefs(html, pageUrl) {
  // src / href (кроме якорей навигации оставляем для ассетов; страничные ссылки тоже резолвим, но не качаем как ассет — пусть ведут на демо/оригинал)
  html = html.replace(/(<(?:img|script|source|link)\b[^>]*?\b(?:src|href)=)(["'])([^"']+)\2/gi, (m, pre, q, url) => {
    const nu = rewriteRef(url, pageUrl); return nu ? `${pre}${q}${nu}${q}` : m;
  });
  // srcset
  html = html.replace(/\bsrcset=(["'])([^"']+)\1/gi, (m, q, val) => {
    const fixed = val.split(',').map((part) => { const [u, d] = part.trim().split(/\s+/); const nu = rewriteRef(u, pageUrl); return (nu || u) + (d ? ' ' + d : ''); }).join(', ');
    return `srcset=${q}${fixed}${q}`;
  });
  // inline style url()
  html = html.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, url) => { const nu = rewriteRef(url, pageUrl); return nu ? `url(${q}${nu}${q})` : m; });
  return html;
}

async function pool(items, n, fn) { let i = 0, done = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { await fn(items[i++]); if (++done % 30 === 0) log(`  ${done}/${items.length}`); } })); }

(async () => {
  const sm = await fetchRaw(new URL('sitemap.xml', base).toString());
  let urls = Array.from(sm.buf.toString().matchAll(/<loc>(.*?)<\/loc>/g), (m) => rebind(m[1].trim())).filter(Boolean);
  urls = Array.from(new Set(urls)).slice(0, MAX);
  if (!urls.length) urls = [START];
  log(`Страниц: ${urls.length}`);

  // 1) страницы: fetch → SEO-фикс → переписать ассеты → сохранить
  for (const u of urls) {
    const r = await fetchRaw(u);
    if (r.status < 200 || r.status >= 400) { log(`  ✗ ${u} (${r.status})`); continue; }
    let html = seoFix(u, r.buf.toString('utf8'));
    html = processHtmlRefs(html, u);
    const pu = new URL(u); let p = pu.pathname.replace(/^\/+/, ''); if (p === '' || p.endsWith('/')) p += 'index.html'; else if (!/\.html?$/i.test(p)) p += '/index.html';
    const out = path.join(OUT, p); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
  }
  log(`Ассетов к скачиванию: ${assetMap.size}`);

  // 2) скачиваем ассеты
  await pool([...assetMap.keys()], 8, async (absUrl) => {
    const rel = assetMap.get(absUrl); const out = path.join(OUT, rel);
    if (fs.existsSync(out)) return;
    const r = await fetchRaw(absUrl); if (r.status < 200 || r.status >= 400 || !r.buf.length) return;
    fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, r.buf);
  });

  // 3) обрабатываем скачанные CSS: их url() → демо-абсолютные, докачиваем
  const cssUrls = [...assetMap.entries()].filter(([, rel]) => rel.endsWith('.css'));
  for (const [absUrl, rel] of cssUrls) {
    const out = path.join(OUT, rel); if (!fs.existsSync(out)) continue;
    let css = fs.readFileSync(out, 'utf8');
    css = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, url) => { const nu = rewriteRef(url, absUrl); return nu ? `url(${q}${nu}${q})` : m; });
    css = css.replace(/@import\s+(['"])([^'"]+)\1/gi, (m, q, url) => { const nu = rewriteRef(url, absUrl); return nu ? `@import ${q}${nu}${q}` : m; });
    fs.writeFileSync(out, css);
  }
  // докачиваем новые (из CSS) ассеты
  await pool([...assetMap.keys()].filter((u) => !fs.existsSync(path.join(OUT, assetMap.get(u)))), 8, async (absUrl) => {
    const out = path.join(OUT, assetMap.get(absUrl)); const r = await fetchRaw(absUrl); if (r.status >= 200 && r.status < 400 && r.buf.length) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, r.buf); }
  });

  const saved = fs.existsSync(OUT) ? require('child_process').execSync(`find ${OUT} -type f | wc -l`).toString().trim() : '0';
  console.log(JSON.stringify({ pages: urls.length, assets: assetMap.size, files: saved }));
})();
