#!/usr/bin/env node
/**
 * ПОЛНЫЙ пререндер (настоящий SSG) — рендерит каждый маршрут в реальном браузере
 * и сохраняет итоговый HTML с настоящим контентом, мета, H1 и JSON-LD.
 *
 * Предназначен для CI (GitHub Actions, Linux), где headless Chrome работает стабильно.
 * Локально на слабой машине используйте лёгкий scripts/prerender.cjs (без браузера).
 *
 * Требует: puppeteer-core + путь к Chrome в CHROME_BIN (или PUPPETEER_EXECUTABLE_PATH).
 * Запуск: CHROME_BIN=/path/to/chrome node scripts/prerender-full.cjs
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE_PATH = '/seomagic-saas-tool';
const SITE = `https://alex1986-rgb.github.io${BASE_PATH}`;
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 8079;

const ROUTES = [
  '/', '/about', '/features', '/pricing', '/position-pricing', '/optimization-pricing',
  '/contact', '/audit', '/blog', '/faq', '/guides', '/support', '/privacy', '/terms',
  '/partners', '/partnership', '/team', '/webinars', '/careers', '/documentation',
  '/api-docs', '/demo', '/seo-optimization', '/site-audit', '/sitemap',
  '/position-tracker', '/channel',
];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2' };

// Статический сервер dist с SPA-fallback под base-путём
function serve() {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length) || '/';
    let file = path.join(DIST, p);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(path.join(DIST, 'index.html')).pipe(res); // SPA fallback
    }
  }).listen(PORT);
}

(async () => {
  const puppeteer = require('puppeteer-core');
  const execPath = process.env.CHROME_BIN || process.env.PUPPETEER_EXECUTABLE_PATH;
  if (!execPath) { console.error('Нужен CHROME_BIN с путём к Chrome'); process.exit(1); }

  const server = serve();
  const browser = await puppeteer.launch({
    executablePath: execPath, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  let ok = 0; const fail = [];
  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${BASE_PATH}${route}`;
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root *', { timeout: 15000 }).catch(() => {});
      const canonical = `${SITE}${route === '/' ? '/' : route + '/'}`;
      // Гарантируем canonical
      await page.evaluate((c) => {
        if (!document.querySelector('link[rel="canonical"]')) {
          const l = document.createElement('link'); l.rel = 'canonical'; l.href = c;
          document.head.appendChild(l);
        }
      }, canonical);
      const html = '<!doctype html>\n' + await page.evaluate(() => document.documentElement.outerHTML);
      if (html.length > 8000) {
        const outDir = route === '/' ? DIST : path.join(DIST, route);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), html);
        ok++;
        console.log(`OK  ${route}  ${html.length}b`);
      } else { fail.push(route); console.log(`SKIP ${route} (мало контента)`); }
    } catch (e) {
      fail.push(route); console.log(`ERR ${route}  ${e.message.split('\n')[0]}`);
    } finally { await page.close(); }
  }

  await browser.close();
  server.close();
  console.log(`\nПолный пререндер: ${ok}/${ROUTES.length}` + (fail.length ? ` | не удалось: ${fail.join(', ')}` : ''));
  // Не валим сборку, если часть страниц не отрендерилась — статический пререндер их подстрахует
  process.exit(0);
})();
