#!/usr/bin/env node
/**
 * Локальный движок аудита больших сайтов (Node 18+, без CPU-лимитов edge).
 * Надёжно обходит сайты до тысяч страниц на обычной машине — то, что edge-воркер
 * на 8GB не вытягивает. Источник URL: sitemap.xml (с учётом подпути и перепривязкой
 * хоста) либо обход внутренних ссылок (BFS) от стартовой страницы.
 *
 * Использование:
 *   node scripts/audit-crawler.cjs <url> [--max N] [--concurrency C] [--out file.json]
 * Примеры:
 *   node scripts/audit-crawler.cjs https://example.com
 *   node scripts/audit-crawler.cjs https://big-site.ru --max 2000 --concurrency 12 --out audit.json
 */
const fs = require('fs');

// ---- аргументы ----
const args = process.argv.slice(2);
const startUrl = args.find((a) => !a.startsWith('--'));
const getOpt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
if (!startUrl) { console.error('Укажите URL. Пример: node scripts/audit-crawler.cjs https://example.com --max 2000'); process.exit(1); }
const MAX = Number(getOpt('--max', 2000));
// Браузерный режим (--browser): грузим через системный Chrome — обходит WAF/403,
// но тяжёлый, поэтому низкая конкурентность и небольшой потолок страниц.
const BROWSER = args.includes('--browser');
const CONCURRENCY = BROWSER ? Math.min(Number(getOpt('--concurrency', 2)), 2) : Number(getOpt('--concurrency', 8));
const OUT = getOpt('--out', null);
const CHROME = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const base = startUrl.endsWith('/') ? startUrl : startUrl + '/';
const ORIGIN = new URL(startUrl).origin;
const log = (m) => process.stderr.write(m + '\n');

let _prof = 0;
// Загрузка страницы реальным браузером (headless Chrome) — для сайтов с защитой.
function chromeFetch(url, timeout = 35000) {
  const { execFileSync } = require('child_process');
  const prof = `/tmp/crawl-prof-${process.pid}-${_prof++}`;
  try {
    const html = execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-sandbox',
      '--disable-dev-shm-usage', `--user-data-dir=${prof}`, '--virtual-time-budget=4000',
      '--dump-dom', url], { encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
    return { status: html && html.length > 800 ? 200 : 0, html: html || '' };
  } catch (e) {
    return { status: 0, html: '', error: e.code || e.message };
  } finally {
    try { fs.rmSync(prof, { recursive: true, force: true }); } catch (_) {}
  }
}

async function fetchText(url, timeout = 20000) {
  if (BROWSER) return chromeFetch(url);
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await fetch(url, { signal: ac.signal, redirect: 'follow', headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    } });
    const html = await r.text();
    return { status: r.status, html, finalUrl: r.url };
  } catch (e) { return { status: 0, html: '', error: e.message }; }
  finally { clearTimeout(t); }
}

const tag = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const rebind = (loc) => {
  try {
    const u = new URL(loc);
    // Тот же хост — URL уже корректный, берём как есть (иначе удвоится подпуть).
    if (u.origin === ORIGIN) return u.toString();
    // Другой хост (напр. sitemap preview указывает на боевой домен) — переносим путь на целевой base.
    return new URL(u.pathname.replace(/^\//, '') + u.search, base).toString();
  } catch { return null; }
};

// ---- обнаружение URL: sitemap → robots → BFS ----
async function discover() {
  // В браузерном режиме каждый запрос дорогой (Chrome) — пропускаем попытки sitemap/robots
  // и сразу идём в BFS от стартовой страницы (1 загрузка даёт и контент, и ссылки).
  if (!BROWSER) {
    // 1) sitemap (относительно подпути и в корне)
    for (const sm of [new URL('sitemap.xml', base).toString(), new URL('/sitemap.xml', startUrl).toString()]) {
      const r = await fetchText(sm);
      if (r.status === 200 && r.html.includes('<loc>')) {
        let urls = Array.from(r.html.matchAll(/<loc>(.*?)<\/loc>/g), (m) => rebind(m[1].trim())).filter(Boolean);
        urls = Array.from(new Set(urls));
        if (urls.length) { log(`Найден sitemap: ${urls.length} URL (${sm})`); return urls.slice(0, MAX); }
      }
    }
    // 2) robots.txt → Sitemap:
    const robots = await fetchText(new URL('/robots.txt', startUrl).toString());
    const smRef = robots.html.match(/Sitemap:\s*(\S+)/i);
    if (smRef) {
      const r = await fetchText(smRef[1]);
      let urls = Array.from(r.html.matchAll(/<loc>(.*?)<\/loc>/g), (m) => rebind(m[1].trim())).filter(Boolean);
      urls = Array.from(new Set(urls));
      if (urls.length) { log(`Sitemap из robots.txt: ${urls.length} URL`); return urls.slice(0, MAX); }
    }
  }
  // 3) BFS по внутренним ссылкам
  log('Обход по ссылкам (BFS)…');
  const seen = new Set([startUrl]); const queue = [startUrl]; const out = [];
  while (queue.length && out.length < MAX) {
    const batch = queue.splice(0, CONCURRENCY);
    const results = await Promise.all(batch.map((u) => fetchText(u)));
    for (let i = 0; i < batch.length; i++) {
      out.push(batch[i]);
      const links = Array.from(results[i].html.matchAll(/href=["']([^"'#]+)["']/g), (m) => m[1]);
      for (const l of links) {
        try {
          const abs = new URL(l, batch[i]).toString().split('#')[0];
          if (abs.startsWith(ORIGIN) && !seen.has(abs) && !/\.(jpg|png|svg|css|js|pdf|zip|webp|ico)(\?|$)/i.test(abs)) {
            seen.add(abs); if (seen.size <= MAX * 2) queue.push(abs);
          }
        } catch (_) {}
      }
    }
    log(`  обойдено ${out.length}, в очереди ${queue.length}`);
  }
  return out.slice(0, MAX);
}

function analyze(url, res) {
  const html = res.html || '';
  const title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const desc = tag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
            || tag(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const text = html.replace(/<script[\s\S]*?<\/script\b[^>]*>/gi, ' ').replace(/<style[\s\S]*?<\/style\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, ' ');
  return {
    url, status: res.status,
    title, titleLen: title ? title.length : 0, desc,
    h1, canonical: /<link[^>]+rel=["']canonical["']/i.test(html),
    ogImage: /<meta[^>]+property=["']og:image["']/i.test(html),
    jsonld: (html.match(/application\/ld\+json/gi) || []).length,
    viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    words: (text.match(/[\p{L}\p{N}]+/gu) || []).length,
  };
}

async function pool(items, n, fn) {
  const out = []; let i = 0; let done = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); if (++done % 25 === 0) log(`  проанализировано ${done}/${items.length}`); }
  }));
  return out;
}

(async () => {
  const t0 = Date.now();
  const urls = await discover();
  log(`К анализу: ${urls.length} страниц (потолок --max ${MAX}), конкурентность ${CONCURRENCY}`);
  const pages = await pool(urls, CONCURRENCY, async (u) => analyze(u, await fetchText(u)));
  const ok = pages.filter((p) => p.status >= 200 && p.status < 400);

  // Честная обработка: если не обойдено ни одной страницы — это НЕ «100/100».
  if (ok.length === 0) {
    const blocked = pages.filter((p) => [401, 403, 429].includes(p.status)).length;
    const code = pages.find((p) => p.status)?.status || 0;
    const data = {
      site: startUrl, scanned: 0, attempted: pages.length, blocked, scores: null,
      error: blocked > 0
        ? `Сайт блокирует автоматический обход (HTTP ${code}). Нужен реальный браузер, разрешённый IP или прокси.`
        : `Не удалось обойти сайт (0 доступных страниц, код ${code || 'нет ответа'}). Проверьте URL/доступность.`,
      issues_count: {}, issues_pct: {},
    };
    if (OUT) fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const N = ok.length;
  // Битые страницы из обхода (4xx/5xx или без ответа) — напр. URL в sitemap, отдающие 404.
  const broken = pages.filter((p) => p.status === 0 || p.status >= 400);
  const totalDiscovered = ok.length + broken.length;
  const titleMap = {}; ok.forEach((p) => { const k = (p.title || '').toLowerCase(); if (k) titleMap[k] = (titleMap[k] || 0) + 1; });
  const I = {
    broken_404: broken.length,
    missing_title: ok.filter((p) => !p.title).length,
    bad_title_len: ok.filter((p) => p.title && (p.titleLen < 10 || p.titleLen > 65)).length,
    dup_title: ok.filter((p) => p.title && titleMap[p.title.toLowerCase()] > 1).length,
    missing_desc: ok.filter((p) => !p.desc).length,
    missing_h1: ok.filter((p) => p.h1 === 0).length,
    missing_canonical: ok.filter((p) => !p.canonical).length,
    missing_og: ok.filter((p) => !p.ogImage).length,
    thin: ok.filter((p) => p.words < 250).length,
    no_jsonld: ok.filter((p) => p.jsonld === 0).length,
  };
  const pct = (n) => Math.round((n / N) * 1000) / 10;
  const brokenPct = totalDiscovered ? Math.round((broken.length / totalDiscovered) * 1000) / 10 : 0;
  const seo = Math.max(0, Math.round(100 - pct(I.missing_title) * 0.6 - pct(I.missing_desc) * 0.4 - pct(I.dup_title) * 0.3 - pct(I.bad_title_len) * 0.1));
  const content = Math.max(0, Math.round(100 - pct(I.thin) * 0.7 - pct(I.missing_h1) * 0.3));
  const technical = Math.max(0, Math.round(100 - pct(I.missing_canonical) * 0.4 - pct(I.no_jsonld) * 0.25 - brokenPct * 0.5));
  const social = Math.max(0, Math.round(100 - pct(I.missing_og) * 0.8));
  const global = Math.round(seo * 0.35 + content * 0.3 + technical * 0.25 + social * 0.1);

  const issues_pct = Object.fromEntries(Object.entries(I).map(([k, v]) => [k, k === 'broken_404' ? brokenPct : pct(v)]));
  const data = {
    site: startUrl, scanned: ok.length, attempted: totalDiscovered, broken: broken.length,
    duration_sec: Math.round((Date.now() - t0) / 1000),
    scores: { global, seo, content, technical, social },
    issues_pct, issues_count: I,
  };
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify({ ...data, pages: ok.concat(broken) }, null, 2)); log(`JSON → ${OUT}`); }
  console.log(JSON.stringify(data, null, 2));
})();
