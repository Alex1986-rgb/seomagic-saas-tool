#!/usr/bin/env node
/**
 * Авто-исправление сайта по результатам аудита (демо движка SaaS-пайплайна).
 * Сейчас умеет: сокращать длинные <title> (>65 симв.) до 50–60, синхронизируя
 * og:title / twitter:title. Принимает папку-копию и правит HTML на месте.
 *
 * Запуск: node scripts/auto-fix-site.cjs <папка-с-сайтом>
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2];
if (!ROOT || !fs.existsSync(ROOT)) { console.error('Укажите существующую папку с сайтом'); process.exit(1); }

const MAX = 60;
function shorten(t) {
  t = t.trim();
  if (t.length <= 65) return t;
  // обрезать по разделителю, только если первый сегмент осмысленной длины (>=30)
  for (const sep of [' — ', ' | ', ' – ', ' - ', ', ']) {
    const i = t.indexOf(sep);
    if (i >= 30 && i <= MAX) return t.slice(0, i).trim();
  }
  return t.slice(0, MAX - 1).replace(/\s+\S*$/, '').trim() + '…';
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let changed = 0; const log = [];
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) continue;
  const cur = m[1].trim();
  if (cur.length <= 65) continue;
  const neu = shorten(cur);
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${neu}</title>`);
  // синхронизируем og:title / twitter:title, если они равны старому
  html = html.replace(/(<meta[^>]+property=["']og:title["'][^>]+content=["'])([^"']*)(["'])/i,
    (mm, a, val, c) => a + (val.length > 65 ? neu : val) + c);
  html = html.replace(/(<meta[^>]+name=["']twitter:title["'][^>]+content=["'])([^"']*)(["'])/i,
    (mm, a, val, c) => a + (val.length > 65 ? neu : val) + c);
  fs.writeFileSync(file, html);
  changed++;
  log.push({ file: path.relative(ROOT, file), from: cur.length, to: neu.length });
}
console.log(JSON.stringify({ changed, total_html: walk(ROOT).length, sample: log.slice(0, 5) }));
