#!/usr/bin/env node
/**
 * Делает зеркало самодостаточным: скачивает ассеты (css/js/img/шрифты) исходного
 * сайта в локальную папку, переписывает ссылки на относительные и проставляет
 * <base href> на демо-URL. Запускать ПОСЛЕ mirror-fix.cjs.
 *
 * node scripts/mirror-assets.cjs <dir> <remoteOrigin> <demoBaseUrl> [--max N]
 */
const fs = require('fs');
const path = require('path');

const DIR = process.argv[2];
const REMOTE = (process.argv[3] || '').replace(/\/+$/, '');     // https://rimmebel.com
const DEMO = process.argv[4];                                    // https://.../rimmebel/
const getOpt = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const MAX = Number(getOpt('--max', 800));
if (!DIR || !REMOTE || !DEMO) { console.error('node scripts/mirror-assets.cjs <dir> <remoteOrigin> <demoBaseUrl>'); process.exit(1); }

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const log = (m) => process.stderr.write(m + '\n');
const walk = (d, acc = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, acc); else acc.push(p); } return acc; };

// Собираем абсолютные URL ассетов исходного домена из текста (html/css)
function collect(text) {
  const re = new RegExp(REMOTE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "/[^\"'\\)\\s>]+", 'g');
  return new Set((text.match(re) || []).map((u) => u.replace(/[)'\"]+$/, '')));
}
const localPathFor = (url) => { const u = new URL(url); return path.join(DIR, u.pathname.replace(/^\/+/, '')); };

async function download(url) {
  const out = localPathFor(url);
  if (fs.existsSync(out)) return out;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buf);
    return out;
  } catch { return null; }
}

async function pool(items, n, fn) { let i = 0, done = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { await fn(items[i++]); if (++done % 40 === 0) log(`  ${done}/${items.length}`); } })); }

(async () => {
  const htmls = walk(DIR).filter((f) => f.endsWith('.html'));
  // 1) собрать ассеты из всех HTML
  let assets = new Set();
  for (const f of htmls) for (const u of collect(fs.readFileSync(f, 'utf8'))) assets.add(u);
  // ограничиваем (приоритет css/js/шрифтам — они критичны для вида)
  let list = [...assets];
  const critical = list.filter((u) => /\.(css|js|woff2?|ttf|svg)(\?|$)/i.test(u));
  const rest = list.filter((u) => !critical.includes(u));
  list = [...critical, ...rest].slice(0, MAX);
  log(`Ассетов к скачиванию: ${list.length} (из ${assets.size})`);
  await pool(list, 8, download);

  // 2) скачать ассеты, на которые ссылаются скачанные CSS (шрифты/фоны), переписать в CSS
  const cssFiles = walk(DIR).filter((f) => f.endsWith('.css'));
  let cssAssets = new Set();
  for (const cf of cssFiles) {
    const css = fs.readFileSync(cf, 'utf8');
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      try { const abs = new URL(m[1], REMOTE + new URL(REMOTE + '/' + path.relative(DIR, cf)).pathname).toString(); if (abs.startsWith(REMOTE)) cssAssets.add(abs.split('#')[0].split('?')[0]); } catch {}
    }
  }
  log(`Ассетов из CSS: ${cssAssets.size}`);
  await pool([...cssAssets].slice(0, MAX), 8, download);

  // 3) переписать ссылки: убрать REMOTE-домен (стало относительным), base href → демо
  const rewrite = (text) => text
    .split(REMOTE + '/').join('')   // абсолютные → относительные от корня зеркала
    .split(REMOTE).join('');
  for (const f of htmls) {
    let h = fs.readFileSync(f, 'utf8');
    h = rewrite(h);
    h = h.replace(/<base[^>]*>/i, `<base href="${DEMO}">`);
    if (!/<base/i.test(h)) h = h.replace(/<head([^>]*)>/i, `<head$1>\n<base href="${DEMO}">`);
    fs.writeFileSync(f, h);
  }
  for (const cf of cssFiles) fs.writeFileSync(cf, rewrite(fs.readFileSync(cf, 'utf8')));

  const total = walk(DIR).filter((f) => !f.endsWith('.html')).length;
  console.log(JSON.stringify({ html: htmls.length, assets_saved: total }));
})();
