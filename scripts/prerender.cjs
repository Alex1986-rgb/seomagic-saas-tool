#!/usr/bin/env node
/**
 * Статический пререндер мета-данных для ключевых публичных маршрутов (без браузера).
 *
 * Зачем: сайт — SPA; в исходном HTML у всех маршрутов одинаковые generic title/
 * description и нет H1/canonical. Скрипт берёт собранный dist/index.html (оболочку)
 * и для каждого маршрута пишет dist/<route>/index.html с УНИКАЛЬНЫМИ <title>,
 * meta description, og/twitter, <link canonical>, скрытым <h1> и breadcrumb JSON-LD.
 * Поисковики получают корректную разметку на каждую страницу; React при загрузке
 * перерисовывает #root как обычно (H1-заглушка заменяется реальным контентом).
 *
 * Запуск (после `GITHUB_PAGES=true npm run build`): node scripts/prerender.cjs
 */
const fs = require('fs');
const path = require('path');

const BASE = 'https://alex1986-rgb.github.io/seomagic-saas-tool';
const DIST = path.resolve(__dirname, '..', 'dist');
const OG = `${BASE}/og-image.jpg`;

// route -> { title, desc, h1 }
const M = {
  '/': { title: 'SEO-аудит сайта онлайн — проверка и оптимизация | SeoMarket', desc: 'Бесплатный SEO-аудит сайта за минуту. Найдём технические ошибки, улучшим позиции в Яндекс и Google и повысим органический трафик.', h1: 'SEO анализ и оптимизация вашего сайта' },
  '/about': { title: 'О сервисе SeoMarket — кто мы и наша миссия', desc: 'SeoMarket — команда экспертов по SEO. Делаем профессиональный аудит и оптимизацию доступными каждому.', h1: 'О сервисе SeoMarket' },
  '/features': { title: 'Возможности SeoMarket — функции SEO-аудита и оптимизации', desc: 'Полный SEO-аудит, AI-оптимизация, мониторинг позиций, анализ конкурентов и отчёты.', h1: 'Возможности платформы SeoMarket' },
  '/pricing': { title: 'Тарифы и цены на SEO-аудит и оптимизацию | SeoMarket', desc: 'Прозрачные тарифы на SEO-аудит и оптимизацию сайта. Выберите подходящий план.', h1: 'Тарифы SeoMarket' },
  '/position-pricing': { title: 'Цены на мониторинг позиций сайта | SeoMarket', desc: 'Стоимость отслеживания позиций сайта в поисковых системах.', h1: 'Цены на мониторинг позиций' },
  '/optimization-pricing': { title: 'Цены на оптимизацию сайта | SeoMarket', desc: 'Стоимость работ по SEO-оптимизации сайта под ключ.', h1: 'Цены на оптимизацию' },
  '/contact': { title: 'Контакты — связаться с командой SeoMarket', desc: 'Свяжитесь с SeoMarket: онлайн-чат, email, телефон. Поможем с SEO.', h1: 'Контакты' },
  '/audit': { title: 'Запустить SEO-аудит сайта онлайн | SeoMarket', desc: 'Введите адрес сайта и получите детальный SEO-аудит с рекомендациями.', h1: 'Запустить SEO-аудит сайта' },
  '/blog': { title: 'Блог о SEO-оптимизации | SeoMarket', desc: 'Экспертные статьи о SEO, продвижении сайтов, аналитике и оптимизации.', h1: 'Блог о SEO' },
  '/faq': { title: 'Часто задаваемые вопросы | SeoMarket', desc: 'Ответы на популярные вопросы о SEO-аудите и оптимизации сайтов.', h1: 'Часто задаваемые вопросы' },
  '/guides': { title: 'Руководства и гайды по SEO | SeoMarket', desc: 'Пошаговые руководства по SEO-оптимизации и работе с платформой.', h1: 'Руководства по SEO' },
  '/support': { title: 'Поддержка пользователей | SeoMarket', desc: 'Центр поддержки SeoMarket: чат, email, телефон, база знаний.', h1: 'Поддержка' },
  '/privacy': { title: 'Политика конфиденциальности | SeoMarket', desc: 'Политика обработки персональных данных SeoMarket.', h1: 'Политика конфиденциальности' },
  '/terms': { title: 'Условия использования | SeoMarket', desc: 'Пользовательское соглашение сервиса SeoMarket.', h1: 'Условия использования' },
  '/partners': { title: 'Партнёрам — программы сотрудничества | SeoMarket', desc: 'Партнёрская программа SeoMarket: условия и преимущества.', h1: 'Партнёрам' },
  '/partnership': { title: 'Стать партнёром SeoMarket', desc: 'Присоединяйтесь к партнёрской программе SeoMarket.', h1: 'Партнёрство' },
  '/team': { title: 'Наша команда | SeoMarket', desc: 'Команда экспертов SeoMarket по SEO и разработке.', h1: 'Наша команда' },
  '/webinars': { title: 'Вебинары по SEO | SeoMarket', desc: 'Обучающие вебинары по SEO-оптимизации и работе с платформой.', h1: 'Вебинары' },
  '/careers': { title: 'Карьера в SeoMarket — вакансии', desc: 'Открытые вакансии и карьера в команде SeoMarket.', h1: 'Карьера в SeoMarket' },
  '/documentation': { title: 'Документация | SeoMarket', desc: 'Документация по использованию платформы SeoMarket.', h1: 'Документация' },
  '/api-docs': { title: 'API документация | SeoMarket', desc: 'Описание API SeoMarket для интеграций.', h1: 'API документация' },
  '/demo': { title: 'Демонстрация платформы SeoMarket', desc: 'Интерактивная демонстрация возможностей SeoMarket.', h1: 'Демонстрация SeoMarket' },
  '/seo-optimization': { title: 'SEO-оптимизация сайта под ключ | SeoMarket', desc: 'Автоматическая SEO-оптимизация сайта: сканирование, исправление, отчёты.', h1: 'SEO-оптимизация сайта' },
  '/site-audit': { title: 'Аудит сайта — глубокий SEO-анализ | SeoMarket', desc: 'Глубокий технический и SEO-аудит сайта с детальным отчётом.', h1: 'Аудит сайта' },
  '/sitemap': { title: 'Карта сайта | SeoMarket', desc: 'Карта всех разделов сайта SeoMarket.', h1: 'Карта сайта' },
  '/position-tracker': { title: 'Мониторинг позиций сайта в поиске | SeoMarket', desc: 'Отслеживайте позиции сайта в Яндекс, Google и Mail.ru по ключевым словам.', h1: 'Анализ позиций сайта' },
  '/channel': { title: 'YouTube-канал SeoMarket', desc: 'Видео и обучающие материалы SeoMarket по SEO.', h1: 'Наш канал' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const shell = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

let n = 0;
for (const [route, m] of Object.entries(M)) {
  const canonical = `${BASE}${route === '/' ? '/' : route + '/'}`;
  let html = shell;
  // <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(m.title)}</title>`);
  // meta description
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(m.desc)}" />`);
  // og/twitter title+description+url
  html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(m.title)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(m.desc)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(m.title)}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(m.desc)}" />`);
  // canonical + breadcrumb JSON-LD перед </head>
  const ld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Главная', item: BASE + '/' }, { '@type': 'ListItem', position: 2, name: m.h1, item: canonical }] })}</script>`;
  html = html.replace(/<\/head>/i, `  <link rel="canonical" href="${canonical}" />\n  ${ld}\n  </head>`);
  // SEO H1 + intro в #root (React заменит при загрузке)
  html = html.replace(/<div id="root">\s*<\/div>/i, `<div id="root"><h1>${esc(m.h1)}</h1><p>${esc(m.desc)}</p></div>`);

  const outDir = route === '/' ? DIST : path.join(DIST, route);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  n++;
}
console.log(`Статический пререндер: ${n} маршрутов записано в dist/`);
