#!/usr/bin/env node
/**
 * SeoMarket — весь конвейер одной командой:
 *   аудит → клонирование → оптимизация → публикация на поддомен
 *
 * Каждый шаг можно пропустить или запустить отдельно: шаги независимы и
 * работают через папку проекта, а не через память процесса. Если что-то
 * упало — перезапускаешь с нужного шага, сделанное не теряется.
 *
 * Использование:
 *   node scripts/pipeline.cjs <url> --subdomain <демо-url> [опции]
 *
 * Примеры:
 *   node scripts/pipeline.cjs https://example.com \
 *        --subdomain https://demo.example.com --max 500
 *
 *   node scripts/pipeline.cjs https://example.com \
 *        --subdomain https://demo.example.com \
 *        --content data/content.json \
 *        --publish beget-demo:public_html
 *
 * Опции:
 *   --subdomain URL   адрес, по которому будет жить копия (обязателен для клона)
 *   --out DIR         рабочая папка проекта (по умолчанию out/<домен>)
 *   --max N           потолок страниц (по умолчанию 500)
 *   --content FILE    тексты SEO-блоков для шага оптимизации
 *   --publish H:PATH  куда заливать: ssh-хост и путь
 *   --only STEP       выполнить только один шаг: audit|clone|optimize|publish
 *   --skip STEPS      пропустить шаги через запятую
 *   --dry             ничего не менять и не заливать
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const START = args[0];
const opt = (n, d = null) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const has = n => args.includes(n);

if (!START || START.startsWith('--')) {
  console.error('node scripts/pipeline.cjs <url> --subdomain <демо-url> [опции]');
  console.error('подробности — в шапке файла');
  process.exit(1);
}

const domain = START.replace(/^https?:\/\//, '').replace(/[/:].*$/, '');
const OUT = opt('--out', path.join('out', domain));
const SUBDOMAIN = opt('--subdomain');
const MAX = opt('--max', '500');
const CONTENT = opt('--content');
const PUBLISH = opt('--publish');
const ONLY = opt('--only');
const SKIP = (opt('--skip', '') || '').split(',').filter(Boolean);
const DRY = has('--dry');

const STEPS = ['audit', 'clone', 'optimize', 'publish'];
const enabled = s => (ONLY ? ONLY === s : !SKIP.includes(s));

const SITE_DIR = path.join(OUT, 'site');
const AUDIT_JSON = path.join(OUT, 'audit.json');

const C = { c: '\x1b[36m', g: '\x1b[32m', y: '\x1b[33m', r: '\x1b[31m', d: '\x1b[2m', x: '\x1b[0m' };
const log = m => console.log(`${C.c}[конвейер]${C.x} ${m}`);
const ok = m => console.log(`${C.g}[конвейер]${C.x} ${m}`);
const warn = m => console.log(`${C.y}[конвейер]${C.x} ${m}`);
const die = m => {
  console.error(`${C.r}[конвейер] ОШИБКА:${C.x} ${m}`);
  process.exit(1);
};

function run(cmd, cmdArgs, label) {
  console.log(`${C.d}$ ${cmd} ${cmdArgs.join(' ')}${C.x}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: 'inherit', cwd: process.cwd() });
  if (r.status !== 0) die(`шаг «${label}» упал (код ${r.status})`);
}

fs.mkdirSync(OUT, { recursive: true });
log(`сайт:    ${START}`);
log(`папка:   ${OUT}`);
log(`шаги:    ${STEPS.filter(enabled).join(' → ') || '(ничего)'}`);
if (DRY) warn('сухой прогон — файлы и сервер не меняются');
console.log('');

// ── 1. Аудит ──────────────────────────────────────────────────────────────
if (enabled('audit')) {
  log('1/4 аудит');
  run('node', [path.join(__dirname, 'audit-crawler.cjs'), START, '--max', MAX, '--out', AUDIT_JSON], 'аудит');
  if (fs.existsSync(AUDIT_JSON)) {
    try {
      const a = JSON.parse(fs.readFileSync(AUDIT_JSON, 'utf8'));
      const n = a.pages?.length ?? a.pagesScanned ?? '?';
      ok(`аудит готов: ${n} страниц → ${AUDIT_JSON}`);
    } catch {
      ok(`аудит готов → ${AUDIT_JSON}`);
    }
  }
  console.log('');
}

// ── 2. Клонирование ───────────────────────────────────────────────────────
if (enabled('clone')) {
  if (!SUBDOMAIN) die('для клонирования нужен --subdomain <url>: по нему переписываются ссылки и canonical');
  log('2/4 клонирование');
  const cloneArgs = [path.join(__dirname, 'site-clone.cjs'), START, SITE_DIR, SUBDOMAIN, '--max', MAX];
  if (has('--prod')) cloneArgs.push('--prod');
  if (has('--render')) cloneArgs.push('--render', opt('--render', 'auto'));
  run('node', cloneArgs, 'клонирование');
  const n = fs.existsSync(SITE_DIR) ? countHtml(SITE_DIR) : 0;
  ok(`копия готова: ${n} страниц → ${SITE_DIR}`);
  console.log('');
}

// ── 3. Оптимизация ────────────────────────────────────────────────────────
if (enabled('optimize')) {
  log('3/4 оптимизация');
  if (!fs.existsSync(SITE_DIR)) die(`нет папки с копией сайта: ${SITE_DIR} (сначала шаг clone)`);
  if (!CONTENT) {
    warn('шаг пропущен: не задан --content <файл.json> с текстами блоков');
    warn('без текстов вставлять нечего — вёрстку сайта конвейер не переписывает');
  } else if (!fs.existsSync(CONTENT)) {
    die(`не найден файл контента: ${CONTENT}`);
  } else {
    const a = [path.join(__dirname, 'optimize-clone.ts'), SITE_DIR, '--content', CONTENT];
    if (DRY) a.push('--dry');
    run('npx', ['tsx', ...a], 'оптимизация');
    ok('блоки встроены в копию сайта');
  }
  console.log('');
}

// ── 4. Публикация ─────────────────────────────────────────────────────────
if (enabled('publish')) {
  log('4/4 публикация');
  if (!PUBLISH) {
    warn('шаг пропущен: не задан --publish <ssh-хост>:<путь>');
    warn(`копия лежит в ${SITE_DIR} — залить можно позже:`);
    warn(`  scripts/publish-subdomain.sh ${SITE_DIR} <хост> <путь>`);
  } else {
    const i = PUBLISH.lastIndexOf(':');
    if (i < 1) die('--publish задаётся как <ssh-хост>:<путь-на-сервере>');
    const host = PUBLISH.slice(0, i);
    const dest = PUBLISH.slice(i + 1);
    const a = [path.join(__dirname, 'publish-subdomain.sh'), SITE_DIR, host, dest];
    if (DRY) a.push('--dry');
    run('bash', a, 'публикация');
    ok(`опубликовано на ${host}:${dest}`);
  }
  console.log('');
}

ok('конвейер завершён');
if (SUBDOMAIN && enabled('publish') && PUBLISH && !DRY) log(`проверь: ${SUBDOMAIN}`);

function countHtml(dir) {
  let n = 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) n += countHtml(p);
    else if (/\.html?$/i.test(name)) n++;
  }
  return n;
}
