#!/usr/bin/env node
/**
 * Пререндер страниц для GitHub Pages.
 *
 * Сайт — одностраничное приложение. На Pages существует только index.html в
 * корне, а любой другой адрес (/pricing, /about) сервер отдаёт из 404.html с
 * HTTP-кодом 404. Человек видит страницу, но поисковые системы такие адреса не
 * индексируют, а боты соцсетей и мессенджеров, не выполняющие JavaScript,
 * получают пустое превью.
 *
 * Скрипт кладёт dist/<маршрут>/index.html для каждого публичного маршрута —
 * тогда Pages отвечает кодом 200. В файл подставляются заголовок, описание,
 * canonical и og-теги, взятые из компонента PageSeo этой самой страницы, —
 * ничего не придумывается. Теги помечены data-rh: на клиенте react-helmet-async
 * заменяет их своими, и дублей не остаётся.
 *
 * Прежний вариант из другой ветки держал тексты в самом скрипте и вписывал в
 * страницы то, чего на сайте нет («помогаем сотням сайтов», «онлайн-чат»).
 *
 * Запуск после сборки: node scripts/prerender.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = process.env.PRERENDER_DIST ? path.resolve(process.env.PRERENDER_DIST) : path.join(ROOT, 'dist');
const SITE = (process.env.PRERENDER_SITE || 'https://alex1986-rgb.github.io/seomagic-saas-tool').replace(/\/$/, '');
const SITE_NAME = 'SeoMarket';

const fail = (message) => {
  console.error(`[prerender] ОШИБКА: ${message}`);
  process.exit(1);
};

const shellPath = path.join(DIST, 'index.html');
if (!fs.existsSync(shellPath)) fail('нет dist/index.html — сначала соберите проект');
const shell = fs.readFileSync(shellPath, 'utf8');

const appSource = fs.readFileSync(path.join(ROOT, 'src', 'App.tsx'), 'utf8');

/** Имя компонента → путь к файлу: обычный импорт или React.lazy. */
function componentFiles(source) {
  const map = new Map();
  const staticImport = /import\s+(\w+)\s+from\s+['"](\.\/pages\/[^'"]+)['"]/g;
  const lazyImport = /const\s+(\w+)\s*=\s*(?:React\.)?lazy\(\s*\(\)\s*=>\s*import\(\s*['"](\.\/pages\/[^'"]+)['"]\s*\)\s*\)/g;
  for (const re of [staticImport, lazyImport]) {
    let m;
    while ((m = re.exec(source))) map.set(m[1], m[2]);
  }
  return map;
}

function resolvePage(importPath) {
  const base = path.join(ROOT, 'src', importPath.replace(/^\.\//, ''));
  for (const candidate of [`${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx')]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/** Строковое значение пропса: title="…" или title={'…'} или title={"…"}. */
function stringProp(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)'|\\{\\s*"([^"]*)"\\s*\\}|\\{\\s*'([^']*)'\\s*\\})`));
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? m[4] ?? null;
}

function readPageSeo(file) {
  const source = fs.readFileSync(file, 'utf8');
  const m = source.match(/<PageSeo\b([\s\S]*?)\/>/);
  if (!m) return null;
  const tag = m[1];
  const title = stringProp(tag, 'title');
  const description = stringProp(tag, 'description');
  // noindex без значения или noindex={true}; noindex={выражение} считаем неизвестным.
  const noindex = /\bnoindex(?!\s*=)/.test(tag) || /\bnoindex=\{\s*true\s*\}/.test(tag);
  const dynamicNoindex = /\bnoindex=\{(?!\s*true\s*\})/.test(tag);
  return { title, description, noindex, dynamicNoindex };
}

/** Конечный адрес страницы на Pages — со слэшем на конце. */
const pageUrl = (route) => (route === '/' ? `${SITE}/` : `${SITE}${encodeURI(route)}/`);

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON-LD внутри <script>: «</script>» в тексте закрыл бы тег раньше времени. */
const jsonLdTag = (data) =>
  `<script data-rh="true" type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function renderHead(route, seo) {
  const fullTitle = seo.title.includes(SITE_NAME) ? seo.title : `${seo.title} — ${SITE_NAME}`;
  // GitHub Pages отдаёт каталог pricing/index.html по адресу со слэшем, а адрес
  // без слэша переадресует (301). Canonical должен указывать на конечный адрес.
  const url = pageUrl(route);
  const tags = [
    `<title data-rh="true">${escapeHtml(fullTitle)}</title>`,
    `<meta data-rh="true" name="description" content="${escapeHtml(seo.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta data-rh="true" property="og:type" content="${seo.ogType || 'website'}" />`,
    `<meta data-rh="true" property="og:locale" content="ru_RU" />`,
    `<meta data-rh="true" property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta data-rh="true" property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta data-rh="true" property="og:url" content="${escapeHtml(url)}" />`,
    `<meta data-rh="true" property="og:site_name" content="${SITE_NAME}" />`,
    `<meta data-rh="true" property="og:image" content="${escapeHtml(seo.image || `${SITE}/og-image.jpg`)}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    ...(seo.jsonLd || []).map(jsonLdTag),
  ];
  return tags.join('\n    ');
}

function withHead(html, head) {
  // Заголовок оболочки заменяем, остальные теги добавляем перед </head>.
  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>/, '');
  return withoutTitle.replace('</head>', `    ${head}\n  </head>`);
}

const components = componentFiles(appSource);
const routeRe = /<Route\s+path="([^"]+)"\s+element=\{\s*<(\w+)[^}]*\}/g;

const written = [];
const skipped = [];
let m;
const seen = new Set();

while ((m = routeRe.exec(appSource))) {
  const [, route, component] = m;
  if (seen.has(route)) continue;
  seen.add(route);

  if (route.includes(':') || route.includes('*')) { skipped.push(`${route} — адрес с параметром`); continue; }
  if (component === 'Navigate') { skipped.push(`${route} — переадресация`); continue; }

  const importPath = components.get(component);
  if (!importPath) { skipped.push(`${route} — компонент ${component} не из src/pages`); continue; }
  const file = resolvePage(importPath);
  if (!file) { skipped.push(`${route} — не найден файл ${importPath}`); continue; }

  const seo = readPageSeo(file);
  if (!seo || !seo.title || !seo.description) { skipped.push(`${route} — в странице нет PageSeo со строковыми title и description`); continue; }
  if (seo.noindex) { skipped.push(`${route} — страница закрыта от индексации`); continue; }

  const html = withHead(shell, renderHead(route, seo));
  if (route === '/') {
    fs.writeFileSync(shellPath, html);
  } else {
    const dir = path.join(DIST, route.replace(/^\//, ''));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }
  written.push(route);
}

/*
 * Статьи блога. Маршрут /blog/:slug основной цикл пропускает (адрес с параметром), а title и
 * description у статьи свои, а не литералы в BlogArticle.tsx. Поэтому метаданные статей вынесены
 * в src/site/blog/articles-meta.json — его же импортирует src/site/blog/articles.ts, и заголовок
 * в пререндере не может разойтись с заголовком на странице.
 */
const articlesMetaPath = path.join(ROOT, 'src', 'site', 'blog', 'articles-meta.json');
if (fs.existsSync(articlesMetaPath)) {
  let articles = [];
  try {
    articles = JSON.parse(fs.readFileSync(articlesMetaPath, 'utf8'));
  } catch (err) {
    fail(`не разобрать ${path.relative(ROOT, articlesMetaPath)}: ${err.message}`);
  }
  // Обложка для og:image — адрес фото из src/site/photos.ts по id. Файл TypeScript, поэтому
  // вытаскиваем только строку src нужной записи, а не исполняем его.
  const photosPath = path.join(ROOT, 'src', 'site', 'photos.ts');
  const photosSource = fs.existsSync(photosPath) ? fs.readFileSync(photosPath, 'utf8') : '';
  const photoSrc = (id) => {
    if (!id) return null;
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = photosSource.match(new RegExp(`["']?${escaped}["']?\\s*:\\s*\\{\\s*src:\\s*["']([^"']+)["']`));
    return m ? m[1] : null;
  };
  const organization = { '@type': 'Organization', name: SITE_NAME, url: pageUrl('/') };

  for (const article of articles) {
    const route = `/blog/${article.slug}`;
    if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) { skipped.push(`${route} — недопустимый slug`); continue; }
    if (!article.title || !article.description) { skipped.push(`${route} — у статьи нет title или description`); continue; }
    if (seen.has(route)) continue;
    seen.add(route);

    const url = pageUrl(route);
    const image = photoSrc(article.photo);
    // Разметка та же, что ставит ArticleJsonLd на клиенте (без FAQ — тексты вопросов живут в TS).
    // Автор — организация: выдуманных авторов и рейтингов в разметке нет.
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: 'ru-RU',
        articleSection: article.category,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(image ? { image: [image] } : {}),
        author: organization,
        publisher: organization,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: pageUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: pageUrl('/blog') },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ];

    const html = withHead(shell, renderHead(route, {
      title: article.title,
      description: article.description,
      ogType: 'article',
      image,
      jsonLd,
    }));
    const dir = path.join(DIST, 'blog', article.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    written.push(route);
  }
}

// Оболочка для адресов без пререндера: в поиск её пускать нельзя.
const notFound = shell
  .replace(/<title>[\s\S]*?<\/title>/, `<title>Страница — ${SITE_NAME}</title>`)
  // Уже стоящий в шаблоне robots убираем, иначе в оболочке оказалось бы два
  // противоречащих друг другу тега.
  .replace(/\s*<meta\s+name="robots"[^>]*>/gi, '')
  .replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>');
fs.writeFileSync(path.join(DIST, '404.html'), notFound);

// Карта сайта и robots.txt — по тем же страницам, что пререндерены. В public
// лежал robots.txt со ссылкой на карту на чужом домене (seomarket.app), которой
// сайт не публикует; закрытые от индексации страницы в карту не попадают.
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...written.map((route) => `  <url><loc>${escapeHtml(pageUrl(route))}</loc><lastmod>${today}</lastmod></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  ['User-agent: *', 'Allow: /', `Sitemap: ${SITE}/sitemap.xml`, ''].join('\n'),
);

console.log(`[prerender] страниц записано: ${written.length}`);
for (const route of written) console.log(`  + ${route}`);
if (skipped.length) {
  console.log(`[prerender] пропущено: ${skipped.length}`);
  for (const line of skipped) console.log(`  - ${line}`);
}
if (written.length < 5) fail('записано подозрительно мало страниц — проверьте разбор App.tsx');
