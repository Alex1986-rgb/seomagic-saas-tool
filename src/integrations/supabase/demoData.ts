/**
 * Демо-данные для офлайн/демо-режима (когда не заданы реальные ключи Supabase).
 * Используются мок-клиентом из ./mockClient.ts, чтобы приложение было полностью
 * рабочим без подключения к бэкенду.
 */

const now = () => new Date().toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const DEMO_USER = {
  id: 'demo-user-0001',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'demo@seomarket.ru',
  email_confirmed_at: daysAgo(120),
  phone: '',
  confirmed_at: daysAgo(120),
  last_sign_in_at: now(),
  app_metadata: { provider: 'demo', providers: ['demo'] },
  user_metadata: { full_name: 'Демо Пользователь', avatar_url: '' },
  identities: [],
  created_at: daysAgo(120),
  updated_at: now(),
};

export const DEMO_SESSION = {
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: DEMO_USER,
};

type Severity = 'error' | 'warning' | 'good';

const makeItem = (
  id: string,
  title: string,
  description: string,
  status: Severity,
  impact: 'high' | 'medium' | 'low',
  solution: string,
  affectedUrls: string[] = []
) => ({
  id,
  title,
  description,
  status,
  score: status === 'good' ? 95 : status === 'warning' ? 65 : 35,
  trend: 'neutral' as const,
  impact,
  solution,
  recommendation: solution,
  affectedUrls,
});

const makeCategory = (
  name: string,
  score: number,
  items: ReturnType<typeof makeItem>[]
) => ({
  name,
  score,
  passed: items.filter((i) => i.status === 'good').length,
  warning: items.filter((i) => i.status === 'warning').length,
  failed: items.filter((i) => i.status === 'error').length,
  items,
});

/** Строит полный объект AuditData для демонстрации результатов аудита. */
export function buildAuditData(url: string, score = 78) {
  let domain = url;
  try {
    domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch {
    /* ignore */
  }
  const page = (p: string) => `https://${domain}${p}`;

  return {
    id: `demo-audit-${domain}`,
    url,
    domain,
    title: `SEO-аудит ${domain}`,
    score,
    previousScore: score - 6,
    pageCount: 42,
    crawledPages: 42,
    date: now(),
    scanTime: '00:01:48',
    status: 'completed' as const,
    issues: {
      critical: [
        'Отсутствует мета-описание на 7 страницах',
        'Дублирующиеся теги H1 на 3 страницах',
      ],
      important: [
        'Изображения без атрибута alt — 24 шт.',
        'Медленная загрузка на 5 страницах (> 3 c)',
        'Не настроены canonical-ссылки',
      ],
      opportunities: [
        'Добавить разметку Schema.org',
        'Сжать изображения (экономия ~1.8 МБ)',
      ],
      minor: 9,
      passed: 31,
    },
    details: {
      seo: makeCategory('SEO', 74, [
        makeItem('seo-title', 'Заголовки title', 'У 5 страниц title длиннее 60 символов', 'warning', 'medium', 'Сократите title до 50–60 символов', [page('/'), page('/about')]),
        makeItem('seo-desc', 'Мета-описания', 'На 7 страницах отсутствует meta description', 'error', 'high', 'Добавьте уникальные описания 140–160 символов', [page('/blog'), page('/contacts')]),
        makeItem('seo-h1', 'Заголовки H1', 'На 3 страницах несколько тегов H1', 'error', 'high', 'Оставьте по одному H1 на страницу'),
        makeItem('seo-canonical', 'Canonical', 'Не настроены canonical-ссылки', 'warning', 'medium', 'Добавьте rel="canonical"'),
        makeItem('seo-robots', 'robots.txt', 'Файл robots.txt корректен', 'good', 'low', 'Изменения не требуются'),
      ]),
      content: makeCategory('Контент', 80, [
        makeItem('content-uniq', 'Уникальность', 'Контент уникален на 96%', 'good', 'low', 'Поддерживайте уникальность'),
        makeItem('content-len', 'Объём текста', 'На 8 страницах менее 300 слов', 'warning', 'medium', 'Расширьте тонкий контент'),
        makeItem('content-alt', 'Alt у изображений', '24 изображения без alt', 'error', 'medium', 'Заполните alt с ключевыми словами'),
      ]),
      performance: makeCategory('Скорость', 71, [
        makeItem('perf-lcp', 'LCP', 'LCP 3.4 c — выше нормы', 'warning', 'high', 'Оптимизируйте крупнейший элемент'),
        makeItem('perf-img', 'Вес изображений', 'Несжатые изображения ~1.8 МБ', 'error', 'high', 'Используйте WebP и сжатие'),
        makeItem('perf-cache', 'Кэширование', 'Кэширование статики настроено', 'good', 'low', 'Изменения не требуются'),
      ]),
      technical: makeCategory('Технический', 83, [
        makeItem('tech-ssl', 'SSL-сертификат', 'HTTPS настроен корректно', 'good', 'low', 'Изменения не требуются'),
        makeItem('tech-sitemap', 'Sitemap.xml', 'Карта сайта найдена и валидна', 'good', 'low', 'Изменения не требуются'),
        makeItem('tech-404', 'Битые ссылки', 'Найдено 4 ссылки с кодом 404', 'warning', 'medium', 'Исправьте или удалите битые ссылки'),
      ]),
      mobile: makeCategory('Мобильные', 88, [
        makeItem('mob-viewport', 'Viewport', 'Мета-тег viewport настроен', 'good', 'low', 'Изменения не требуются'),
        makeItem('mob-tap', 'Размер кнопок', 'Несколько кнопок слишком близко', 'warning', 'low', 'Увеличьте отступы между элементами'),
      ]),
      usability: makeCategory('Удобство', 85, [
        makeItem('use-nav', 'Навигация', 'Структура навигации понятна', 'good', 'low', 'Изменения не требуются'),
        makeItem('use-contrast', 'Контраст', 'На 2 блоках низкий контраст текста', 'warning', 'medium', 'Повысьте контрастность до WCAG AA'),
      ]),
    },
    optimizationCost: 24500,
    optimizationItems: [
      { name: 'Мета-описания', description: 'Генерация уникальных описаний', count: 7, price: 350, pricePerUnit: 350, totalPrice: 2450, type: 'meta' },
      { name: 'Alt у изображений', description: 'Заполнение alt-атрибутов', count: 24, price: 150, pricePerUnit: 150, totalPrice: 3600, type: 'images' },
      { name: 'Сжатие изображений', description: 'Конвертация в WebP', count: 31, price: 120, pricePerUnit: 120, totalPrice: 3720, type: 'perf' },
      { name: 'Исправление H1', description: 'Приведение к одному H1', count: 3, price: 400, pricePerUnit: 400, totalPrice: 1200, type: 'seo' },
    ],
  };
}

/** Демо-объект рекомендаций (RecommendationData) для результатов аудита. */
export function buildRecommendations(url: string) {
  return {
    url,
    title: 'Рекомендации по оптимизации',
    description: 'Приоритетные шаги для улучшения SEO-показателей сайта',
    priority: 'high',
    category: 'seo',
    affectedAreas: ['Мета-теги', 'Изображения', 'Скорость', 'Контент'],
    estimatedEffort: '3-5 дней',
    potentialImpact: 'Рост органического трафика на 20–35%',
    status: 'pending',
    details: 'На основе аудита выявлены ключевые направления для улучшения позиций в поиске.',
    resources: ['https://developers.google.com/search', 'https://yandex.ru/support/webmaster'],
    critical: [
      'Добавить мета-описания на 7 страницах',
      'Устранить дубли тегов H1 на 3 страницах',
    ],
    important: [
      'Заполнить alt у 24 изображений',
      'Настроить canonical-ссылки',
      'Ускорить загрузку 5 медленных страниц',
    ],
    opportunities: [
      'Внедрить разметку Schema.org',
      'Сжать изображения (экономия ~1.8 МБ)',
      'Добавить внутреннюю перелинковку',
    ],
  };
}

const demoUrls = ['https://example-shop.ru', 'https://my-blog.ru', 'https://corp-site.ru'];

const buildAudits = () =>
  demoUrls.map((url, i) => ({
    id: `demo-audit-${i + 1}`,
    user_id: DEMO_USER.id,
    url,
    status: i === 2 ? 'failed' : 'completed',
    pages_scanned: i === 2 ? 12 : [42, 28, 0][i],
    total_pages: [42, 28, 64][i],
    seo_score: i === 2 ? null : [78, 84, null][i],
    created_at: daysAgo(i * 3 + 1),
    completed_at: i === 2 ? null : daysAgo(i * 3 + 1),
    error_message: i === 2 ? 'Превышено время ожидания при сканировании' : null,
  }));

const buildAuditResults = () =>
  demoUrls.slice(0, 2).map((url, i) => ({
    id: `demo-result-${i + 1}`,
    task_id: `demo-task-${i + 1}`,
    audit_id: `demo-audit-${i + 1}`,
    user_id: DEMO_USER.id,
    audit_data: buildAuditData(url, [78, 84][i]),
    score: [78, 84][i],
    global_score: [78, 84][i],
    seo_score: [74, 80][i],
    technical_score: [83, 86][i],
    content_score: [80, 82][i],
    performance_score: [71, 79][i],
    page_count: [42, 28][i],
    issues_count: [18, 11][i],
    pages_by_type: { article: 18, product: 12, category: 8, other: 4 },
    pages_by_depth: { '0': 1, '1': 9, '2': 20, '3': 12 },
    issues_by_severity: { critical: 2, important: 7, minor: 9 },
    created_at: daysAgo(i * 3 + 1),
  }));

const buildPageAnalysis = () => {
  const rows: any[] = [];
  const paths = ['/', '/about', '/blog', '/blog/seo-guide', '/contacts', '/catalog', '/catalog/item-1', '/pricing'];
  ['demo-audit-1', 'demo-audit-2'].forEach((auditId, ai) => {
    paths.forEach((p, pi) => {
      rows.push({
        id: `${auditId}-page-${pi}`,
        audit_id: auditId,
        url: `${demoUrls[ai]}${p}`,
        title: p === '/' ? 'Главная' : p.replace(/\//g, ' ').trim(),
        status_code: pi === 4 ? 404 : 200,
        load_time: +(0.8 + pi * 0.3).toFixed(2),
        word_count: 250 + pi * 90,
        image_count: pi % 4,
        depth: Math.min(pi, 3),
        meta_description: pi % 3 === 0 ? null : 'Демонстрационное описание страницы',
        h1: pi % 5 === 0 ? null : 'Заголовок страницы',
        created_at: daysAgo(ai * 3 + 1),
      });
    });
  });
  return rows;
};

const buildAuditTasks = () =>
  ['demo-audit-1', 'demo-audit-2'].map((auditId, i) => ({
    id: `demo-task-${i + 1}`,
    audit_id: auditId,
    user_id: DEMO_USER.id,
    url: demoUrls[i],
    task_type: 'deep',
    status: 'completed',
    stage: 'completed',
    progress: 100,
    pages_scanned: [42, 28][i],
    estimated_pages: [42, 28][i],
    avg_load_time_ms: [1840, 1520][i],
    success_rate: 0.97,
    redirect_pages_count: 2,
    error_pages_count: 1,
    total_urls: [42, 28][i],
    created_at: daysAgo(i * 3 + 1),
    updated_at: daysAgo(i * 3 + 1),
  }));

const buildNotifications = () =>
  [
    { title: 'Аудит завершён', message: 'SEO-аудит example-shop.ru готов. Оценка: 78/100', type: 'success' },
    { title: 'Найдены проблемы', message: 'На вашем сайте 2 критические проблемы SEO', type: 'warning' },
    { title: 'Добро пожаловать', message: 'Спасибо за регистрацию в SeoMarket!', type: 'info' },
  ].map((n, i) => ({
    id: `demo-notif-${i + 1}`,
    user_id: DEMO_USER.id,
    title: n.title,
    message: n.message,
    type: n.type,
    is_read: i > 0,
    read: i > 0,
    created_at: daysAgo(i),
  }));

const buildOptimizationJobs = () =>
  ['demo-task-1', 'demo-task-2'].map((taskId, i) => ({
    id: `demo-opt-${i + 1}`,
    task_id: taskId,
    user_id: DEMO_USER.id,
    status: 'completed',
    progress: 100,
    cost: [245, 168][i],
    result_data: {
      optimized_pages: [42, 28][i],
      total_pages: [42, 28][i],
      improvements: [
        { url: `${demoUrls[i]}/`, type: 'meta', description: 'Добавлены мета-описания' },
        { url: `${demoUrls[i]}/catalog`, type: 'images', description: 'Сжаты изображения, добавлены alt' },
      ],
    },
    audit_tasks: { url: demoUrls[i] },
    created_at: daysAgo(i * 3 + 1),
  }));

/** Создаёт свежий набор демо-таблиц (вызывается один раз при инициализации store). */
export function createDemoTables(): Record<string, any[]> {
  return {
    audits: buildAudits(),
    audit_results: buildAuditResults(),
    page_analysis: buildPageAnalysis(),
    audit_tasks: buildAuditTasks(),
    optimization_jobs: buildOptimizationJobs(),
    notifications: buildNotifications(),
    profiles: [
      { id: DEMO_USER.id, email: DEMO_USER.email, full_name: 'Демо Пользователь', avatar_url: '', created_at: daysAgo(120) },
      { id: 'demo-user-0002', email: 'ivan@example.ru', full_name: 'Иван Петров', avatar_url: '', created_at: daysAgo(80) },
      { id: 'demo-user-0003', email: 'maria@example.ru', full_name: 'Мария Сидорова', avatar_url: '', created_at: daysAgo(64) },
      { id: 'demo-user-0004', email: 'alex@example.ru', full_name: 'Алексей Смирнов', avatar_url: '', created_at: daysAgo(40) },
      { id: 'demo-user-0005', email: 'olga@example.ru', full_name: 'Ольга Кузнецова', avatar_url: '', created_at: daysAgo(21) },
      { id: 'demo-user-0006', email: 'dmitry@example.ru', full_name: 'Дмитрий Волков', avatar_url: '', created_at: daysAgo(7) },
    ],
    user_roles: [
      { id: 'demo-role-1', user_id: DEMO_USER.id, role: 'admin' },
      { id: 'demo-role-2', user_id: 'demo-user-0002', role: 'user' },
      { id: 'demo-role-3', user_id: 'demo-user-0003', role: 'user' },
      { id: 'demo-role-4', user_id: 'demo-user-0004', role: 'admin' },
      { id: 'demo-role-5', user_id: 'demo-user-0005', role: 'user' },
      { id: 'demo-role-6', user_id: 'demo-user-0006', role: 'user' },
    ],
    pdf_reports: [
      { id: 'demo-pdf-1', user_id: DEMO_USER.id, audit_id: 'demo-audit-1', task_id: 'demo-task-1', report_type: 'full', file_path: 'demo/report-example-shop.pdf', file_size: 2516582, downloaded_count: 3, last_downloaded_at: daysAgo(1), created_at: daysAgo(1) },
      { id: 'demo-pdf-2', user_id: DEMO_USER.id, audit_id: 'demo-audit-2', task_id: 'demo-task-2', report_type: 'full', file_path: 'demo/report-my-blog.pdf', file_size: 1843200, downloaded_count: 1, last_downloaded_at: daysAgo(4), created_at: daysAgo(4) },
    ],
  };
}
