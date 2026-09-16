/**
 * Шаг «оптимизация» конвейера: встраивает SEO-блоки в страницы уже
 * склонированного сайта, не трогая его вёрстку.
 *
 * Работает по папке, которую сделал site-clone.cjs. Правит файлы на месте
 * (по умолчанию — с бэкапом рядом).
 *
 * Запуск:
 *   npx tsx scripts/optimize-clone.ts <папка> --content content.json
 *   npx tsx scripts/optimize-clone.ts <папка> --content content.json --dry
 *
 * Формат content.json — массив записей:
 *   [{ "file": "catalog/divany.html",   // путь относительно папки сайта
 *      "heading": "H2 блока",
 *      "bodyHtml": "<p>…</p><h3>…</h3><table>…</table>",
 *      "faq": [{ "q": "…", "a": "…" }],
 *      "title": "новый <title>",         // необязательно
 *      "description": "новый meta"       // необязательно
 *   }]
 * Вместо "file" можно указать "url" — сопоставление идёт по хвосту пути.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, relative, sep } from 'path';
import { injectSeoBlock, BLOCK_MARKER } from '../src/services/audit/optimization/htmlInjector';

interface ContentEntry {
  file?: string;
  url?: string;
  heading: string;
  bodyHtml: string;
  faq?: { q: string; a: string }[];
  title?: string;
  description?: string;
  collapsible?: boolean;
}

const args = process.argv.slice(2);
const siteDir = args[0];
const opt = (name: string, def: string | null = null) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const DRY = args.includes('--dry');
const NO_BACKUP = args.includes('--no-backup');
const contentPath = opt('--content');

if (!siteDir || !existsSync(siteDir)) {
  console.error('Укажи существующую папку сайта.');
  console.error('  npx tsx scripts/optimize-clone.ts <папка> --content content.json [--dry]');
  process.exit(1);
}
if (!contentPath || !existsSync(contentPath)) {
  console.error('Укажи --content <файл.json> с текстами блоков.');
  process.exit(1);
}

/** Все html-файлы внутри папки */
function walkHtml(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, acc);
    else if (/\.html?$/i.test(name)) acc.push(p);
  }
  return acc;
}

const entries: ContentEntry[] = JSON.parse(readFileSync(contentPath, 'utf8'));
const files = walkHtml(siteDir);

/** Индекс страниц по нормализованному пути — чтобы сопоставлять и file, и url */
const norm = (s: string) => s.replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+/, '').split(sep).join('/').toLowerCase();
const byPath = new Map<string, string>();
for (const f of files) byPath.set(norm(relative(siteDir, f)), f);

let injected = 0;
let already = 0;
let notFound = 0;
let empty = 0;

for (const e of entries) {
  const key = norm(e.file || e.url || '');
  if (!key) {
    notFound++;
    continue;
  }

  // точное совпадение, иначе по хвосту пути
  let target = byPath.get(key);
  if (!target) {
    const tail = key.replace(/index\.html?$/, '').replace(/\/+$/, '');
    for (const [k, v] of byPath) {
      if (k === tail || k === tail + '/index.html' || k.endsWith('/' + key)) {
        target = v;
        break;
      }
    }
  }
  if (!target) {
    notFound++;
    console.log(`  нет страницы: ${e.file || e.url}`);
    continue;
  }

  if (!e.bodyHtml?.trim() && !e.faq?.length) {
    empty++;
    continue;
  }

  const before = readFileSync(target, 'utf8');
  if (before.includes(BLOCK_MARKER)) {
    already++;
    continue;
  }

  const after = injectSeoBlock(
    before,
    {
      heading: e.heading,
      bodyHtml: e.bodyHtml,
      faq: e.faq,
      collapsible: e.collapsible !== false,
    },
    { title: e.title || undefined, description: e.description || undefined }
  );

  if (after === before) {
    console.log(`  не удалось вставить: ${relative(siteDir, target)}`);
    continue;
  }

  if (!DRY) {
    if (!NO_BACKUP && !existsSync(target + '.bak')) copyFileSync(target, target + '.bak');
    writeFileSync(target, after, 'utf8');
  }

  injected++;
  const gain = after.length - before.length;
  console.log(`  ${DRY ? '[сухой прогон] ' : ''}${relative(siteDir, target)}  +${gain} байт`);
}

console.log('');
console.log(`страниц в папке:      ${files.length}`);
console.log(`записей в контенте:   ${entries.length}`);
console.log(`вставлено:            ${injected}`);
console.log(`уже было:             ${already}`);
console.log(`пустой контент:       ${empty}`);
console.log(`страница не найдена:  ${notFound}`);
if (DRY) console.log('\nсухой прогон — файлы не изменены');
else if (!NO_BACKUP) console.log('\nбэкапы рядом: *.html.bak');
