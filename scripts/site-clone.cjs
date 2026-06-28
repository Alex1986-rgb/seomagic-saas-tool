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

async function fetchRaw(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ru,en;q=0.8' } });
      if ((r.status === 429 || r.status >= 500) && attempt < retries) { await new Promise((res) => setTimeout(res, 500 * (attempt + 1))); continue; }
      return { status: r.status, buf: Buffer.from(await r.arrayBuffer()), ct: r.headers.get('content-type') || '' };
    } catch (e) { if (attempt < retries) { await new Promise((res) => setTimeout(res, 500 * (attempt + 1))); continue; } return { status: 0, buf: Buffer.alloc(0), ct: '' }; }
  }
  return { status: 0, buf: Buffer.alloc(0), ct: '' };
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

// Контент-блок: профессиональный SEO-текст + 2 таблицы + FAQ (8, в 2 блока по 4). Шаблон по теме, без AI.
function contentBlock(topic) {
  const tl = topic.toLowerCase();
  const faqs = [
    [`Как выбрать «${tl}»?`, `Отталкивайтесь от площади помещения, стиля интерьера и сценариев использования. Оцените материал, габариты, эргономику и наличие нужных механизмов. Наши консультанты помогут подобрать «${tl}» под ваш бюджет и задачи.`],
    ['Из каких материалов изготовлены изделия?', 'В ассортименте — массив дерева, МДФ, ЛДСП, качественный текстиль и экокожа. Все материалы сертифицированы, безопасны и устойчивы к ежедневной эксплуатации.'],
    ['Сколько стоит доставка?', 'Доставка осуществляется по городу и в регионы России. Точная стоимость зависит от габаритов и адреса и рассчитывается при оформлении заказа; возможны подъём и сборка.'],
    ['Действует ли гарантия?', 'Да, на всю продукцию распространяется официальная гарантия производителя. Срок и условия указаны в карточке товара и сопроводительных документах.'],
    ['Можно ли заказать по индивидуальным размерам?', 'Да, доступно изготовление на заказ — по вашим размерам, цвету и конфигурации. Это удобно для нестандартных помещений и единых интерьерных решений.'],
    ['Какие способы оплаты доступны?', 'Принимаем наличный и безналичный расчёт, оплату банковской картой и рассрочку. Для юридических лиц возможна оплата по счёту с закрывающими документами.'],
    ['Как оформить заказ?', 'Добавьте товар в корзину или свяжитесь с менеджером по телефону либо через форму на сайте — поможем с выбором, рассчитаем стоимость и оформим заказ.'],
    ['Есть ли самовывоз и шоурум?', 'Да, доступен самовывоз со склада, а ознакомиться с моделями вживую можно в шоуруме. Адреса и режим работы уточняйте у менеджера или в разделе «Контакты».'],
  ];
  const td = 'border:1px solid #ddd;padding:9px 13px;text-align:left;font-size:14px';
  const th = td + ';background:#f5f5f5;font-weight:600';
  const faqItem = ([q, a]) => `<details style="border-bottom:1px solid #eee;padding:9px 0"><summary style="cursor:pointer;font-weight:600;color:#1a1a1a">${esc(q)}</summary><p style="margin:7px 0 0;color:#555">${esc(a)}</p></details>`;
  const col1 = faqs.slice(0, 4).map(faqItem).join('');
  const col2 = faqs.slice(4, 8).map(faqItem).join('');
  return `<section data-seomarket="content" style="max-width:1100px;margin:40px auto;padding:28px 16px;border-top:2px solid #eee;font-family:Arial,Helvetica,sans-serif;line-height:1.7;color:#333">
  <h2 style="font-size:25px;margin:0 0 16px;color:#1a1a1a">${esc(topic)}: как выбрать и купить выгодно</h2>
  <p>Раздел «${esc(topic)}» — это тщательно подобранный ассортимент для тех, кто ценит качество, комфорт и продуманный дизайн. Мы помогаем оформить интерьер целостно: от отдельных предметов до комплексных решений под конкретное помещение, стиль и бюджет.</p>
  <p>При производстве используются проверенные материалы и фурнитура надёжных поставщиков, поэтому изделия сохраняют внешний вид и функциональность долгие годы. Грамотный подбор «${tl}» по габаритам, эргономике и материалам напрямую влияет на удобство ежедневного использования.</p>
  <p>Покупая у нас, вы получаете честные цены без переплат, профессиональную консультацию и доставку по всей России. Менеджеры подскажут оптимальные модели под вашу задачу, рассчитают стоимость с доставкой и сборкой и помогут оформить заказ удобным способом.</p>
  <p>Если у вас нестандартное помещение или особые требования к дизайну — доступно изготовление на заказ по индивидуальным размерам и конфигурации. Это позволяет получить идеально подходящее решение и единый стиль во всём интерьере.</p>
  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Ключевые параметры выбора</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Параметр</th><th style="${th}">На что обратить внимание</th><th style="${th}">Почему важно</th></tr></thead><tbody>
  <tr><td style="${td}">Материал</td><td style="${td}">Массив, МДФ, ЛДСП, текстиль</td><td style="${td}">Долговечность и внешний вид</td></tr>
  <tr><td style="${td}">Габариты</td><td style="${td}">Соответствие площади</td><td style="${td}">Удобство и эргономика</td></tr>
  <tr><td style="${td}">Функциональность</td><td style="${td}">Механизмы, хранение</td><td style="${td}">Практичность в быту</td></tr>
  <tr><td style="${td}">Гарантия</td><td style="${td}">Срок и условия</td><td style="${td}">Спокойствие покупателя</td></tr></tbody></table>
  <h3 style="font-size:19px;margin:24px 0 8px;color:#1a1a1a">Доставка, сборка и оплата</h3>
  <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="${th}">Услуга</th><th style="${th}">Условия</th></tr></thead><tbody>
  <tr><td style="${td}">Доставка</td><td style="${td}">По городу и в регионы РФ, расчёт при оформлении</td></tr>
  <tr><td style="${td}">Подъём и сборка</td><td style="${td}">Профессиональная бригада, по договорённости</td></tr>
  <tr><td style="${td}">Оплата</td><td style="${td}">Наличные, карта, рассрочка, по счёту для юрлиц</td></tr>
  <tr><td style="${td}">Изготовление на заказ</td><td style="${td}">Индивидуальные размеры и конфигурация</td></tr></tbody></table>
  <h3 style="font-size:19px;margin:24px 0 12px;color:#1a1a1a">Часто задаваемые вопросы</h3>
  <div style="display:flex;flex-wrap:wrap;gap:0 40px">
    <div style="flex:1;min-width:280px">${col1}</div>
    <div style="flex:1;min-width:280px">${col2}</div>
  </div>
  </section>`;
}

function seoFix(pageUrl, html) {
  let title = tag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) || '';
  const topic = (title.split(/[—|–\-,]/)[0] || 'Каталог').trim() || 'Каталог';
  if (!title) { title = `${topic}`; html = html.replace(/<head([^>]*)>/i, `<head$1><title>${esc(title)}</title>`); }
  else if (title.length > 65) html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(shortenTitle(title))}</title>`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) html = html.replace(/<\/title>/i, `</title>\n<meta name="description" content="${esc(topic)} — каталог, цены, доставка.">`);
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) html = html.replace(/<\/head>/i, `<link rel="canonical" href="${esc(pageUrl)}">\n</head>`);
  if (!/<meta[^>]+property=["']og:/i.test(html)) html = html.replace(/<\/head>/i, `<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:url" content="${esc(pageUrl)}">\n</head>`);
  if (!/application\/ld\+json/i.test(html)) html = html.replace(/<\/head>/i, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: ORIGIN + '/' }, { '@type': 'ListItem', position: 2, name: topic, item: pageUrl }] })}</script>\n</head>`);
  // H1 (sr-only, accessibility-стандарт, НЕ клоакинг -9999px) только при отсутствии, идемпотентно
  if ((html.match(/<h1[\s>]/gi) || []).length === 0 && !/data-seomarket="h1"/.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1><h1 data-seomarket="h1" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${esc(topic)}</h1>`);
  }
  // Контент-блок (SEO-текст + таблицы + FAQ) перед </body>, идемпотентно
  if (!/data-seomarket="content"/.test(html)) {
    const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: `Что важно при выборе «${topic.toLowerCase()}»?`, acceptedAnswer: { '@type': 'Answer', text: 'Материалы, габариты, функциональность, гарантия и соответствие интерьеру.' } },
      { '@type': 'Question', name: 'Есть ли гарантия и доставка?', acceptedAnswer: { '@type': 'Answer', text: 'Да, гарантия производителя и доставка по всей России.' } },
    ] };
    html = html.replace(/<\/body>/i, `${contentBlock(topic)}<script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n</body>`);
  }
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
  // lazy-load: поднимаем data-src/data-original/data-lazy-src → src, data-srcset → srcset
  // (реальный src ставит JS оригинала, которого офлайн нет → без этого картинки не появятся)
  html = html.replace(/\bdata-(?:src|original|lazy-src)=(["'])([^"']+)\1/gi, (m, q, u) => `src=${q}${u}${q} data-was-lazy="1"`);
  html = html.replace(/\bdata-srcset=(["'])([^"']+)\1/gi, (m, q, u) => `srcset=${q}${u}${q}`);
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

  // 1) страницы: fetch → SEO-фикс → переписать ассеты → сохранить (конкурентно)
  await pool(urls, 6, async (u) => {
    const r = await fetchRaw(u);
    if (r.status < 200 || r.status >= 400) { log(`  ✗ ${u} (${r.status})`); return; }
    let html = seoFix(u, r.buf.toString('utf8'));
    html = processHtmlRefs(html, u);
    const pu = new URL(u); let p = pu.pathname.replace(/^\/+/, ''); if (p === '' || p.endsWith('/')) p += 'index.html'; else if (!/\.html?$/i.test(p)) p += '/index.html';
    const out = path.join(OUT, p); fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, html);
  });
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
