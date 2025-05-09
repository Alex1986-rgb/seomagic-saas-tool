
import { AuditData } from "@/types/audit/audit-core";
import { AuditDetailsData } from "@/types/audit/audit-details";
import { CategoryData } from "@/types/audit/category-data";
import { PageData } from "@/types/audit/page-data";
import { AuditItemData } from '@/types/audit/audit-items';
import { generateRandomId } from "@/utils";
import { OptimizationItem } from "@/features/audit/types/optimization-types";

const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 100);
};

const generateCategoryData = (seed: number): CategoryData => {
  // Generate more representative values
  const score = Math.floor(seed * 100) % 100;
  const passed = Math.floor((1 - seed) * 20) + 10;
  const warning = Math.floor(seed * 15) + 5;
  const failed = Math.floor((1 - seed) * 10);
  
  return {
    score: score,
    passed: passed,
    warning: warning,
    failed: failed,
    items: generateAuditItems(seed, score),
  };
};

const generateAuditDetails = (seed: number): AuditDetailsData => {
  return {
    seo: generateCategoryData(seed * 0.8),
    content: generateCategoryData(seed * 0.5),
    performance: generateCategoryData(seed * 0.7),
    technical: generateCategoryData(seed * 0.9),
    mobile: generateCategoryData(seed * 0.6),
    usability: generateCategoryData(seed * 0.4),
  };
};

const generateAuditItems = (seed: number, baseScore?: number): AuditItemData[] => {
  const itemCount = Math.floor(seed * 20) + 10; // Increased item count for more detailed data
  return Array.from({ length: itemCount }, (_, i) => {
    const status = ['error', 'warning', 'good'][Math.floor(seed * 3 + i) % 3] as 'error' | 'warning' | 'good';
    const score = baseScore ? Math.min(baseScore + (Math.random() * 20 - 10), 100) : Math.floor(seed * 80) + 20;
    
    return {
      id: generateRandomId(),
      title: `Audit Item ${i + 1}: ${getRandomItemTitle(i)}`,
      description: `Detailed description for ${getRandomItemTitle(i)} - ${getRandomItemDescription(i)}`,
      status: status,
      score: score,
      trend: ['up', 'down', 'neutral'][i % 3] as 'up' | 'down' | 'neutral',
      impact: ['high', 'medium', 'low'][i % 3] as 'high' | 'medium' | 'low',
      affectedUrls: i % 4 === 0 ? [
        '/about',
        '/products',
        '/contact',
        '/blog/post-1'
      ] : undefined,
      solution: i % 3 === 0 ? `Solution suggestion for ${getRandomItemTitle(i)}` : undefined,
      recommendation: i % 2 === 0 ? `Recommendation for ${getRandomItemTitle(i)}` : undefined,
    };
  });
};

const getRandomItemTitle = (index: number): string => {
  const titles = [
    "Missing META description",
    "Duplicate title tags",
    "Broken links",
    "Missing alt tags",
    "Slow page loading",
    "Mobile responsiveness issues",
    "Improper header structure",
    "Keyword density too low",
    "Missing robots.txt",
    "Poor content quality",
    "Missing favicon",
    "HTTP instead of HTTPS",
    "Missing schema markup",
    "URL structure issues",
    "Missing canonical tags",
    "Unoptimized images",
    "Too many redirects",
    "Poor internal linking",
    "Outdated content",
    "Missing social meta tags"
  ];
  
  return titles[index % titles.length];
};

const getRandomItemDescription = (index: number): string => {
  const descriptions = [
    "META descriptions are essential for SEO and improving click-through rates from search results.",
    "Duplicate title tags confuse search engines about which page is relevant for a specific search query.",
    "Broken links create a poor user experience and can negatively impact your site's crawlability.",
    "Alt tags help search engines understand images and improve accessibility for visually impaired users.",
    "Slow loading pages lead to higher bounce rates and lower search engine rankings.",
    "Mobile-friendly websites are prioritized in search rankings due to the increasing mobile traffic.",
    "Proper header structure (H1, H2, H3) helps both users and search engines understand your content hierarchy.",
    "Optimal keyword density helps search engines understand your page's topic without appearing spammy.",
    "A robots.txt file guides search engines on which pages to crawl and index.",
    "High-quality, unique content is essential for good rankings and user engagement.",
    "A favicon enhances brand recognition and improves user experience.",
    "HTTPS is a ranking factor and builds trust with users by securing data transmission.",
    "Schema markup helps search engines understand your content better and can lead to rich snippets in search results.",
    "Clean URL structures that include relevant keywords help both users and search engines.",
    "Canonical tags help prevent duplicate content issues by specifying the preferred version of a page.",
    "Large image files slow down page loading and hurt user experience.",
    "Excessive redirects add extra HTTP requests and slow down page loading.",
    "Good internal linking spreads link equity throughout your site and helps search engines discover your content.",
    "Regularly updated content signals relevancy to search engines and provides value to users.",
    "Social meta tags control how your content appears when shared on social media platforms."
  ];
  
  return descriptions[index % descriptions.length];
};

const generatePageData = (url: string): PageData => {
  return {
    url: url,
    title: `Page Title for ${url}`,
    meta: {
      description: `Meta description for ${url}`,
      keywords: `keywords for ${url}`,
    },
  };
};

const generateIssues = (seed: number) => {
  // Generate more detailed and specific issues
  const criticalCount = Math.floor(seed * 8) % 12 + 3;
  const importantCount = Math.floor(seed * 15) % 20 + 5;
  const opportunitiesCount = Math.floor(seed * 10) % 15 + 5;
  const minorCount = Math.floor(seed * 9) % 30 + 10;
  const passedCount = Math.floor((1 - seed) * 20) + 30;

  const criticalIssues = [
    "Нет SSL-сертификата (HTTPS)",
    "Критическая ошибка в robots.txt",
    "Блокировка индексации основных страниц",
    "Дублированный контент на главных страницах",
    "Неправильные коды ответа сервера",
    "Отсутствуют H1 заголовки на ключевых страницах",
    "Мобильная версия сайта недоступна",
    "Неоптимизированные мета-теги на ключевых страницах",
    "Высокое время загрузки (более 5 секунд)",
    "Отсутствует карта сайта",
    "Большое количество 404 ошибок",
    "Неработающие формы обратной связи"
  ];

  const importantIssues = [
    "Неоптимизированные изображения без атрибутов alt",
    "Недостаточная плотность ключевых слов",
    "Неоптимальная структура URL",
    "Отсутствуют мета-описания на второстепенных страницах",
    "Проблемы с внутренней перелинковкой",
    "Неправильная вложенность заголовков H2-H6",
    "Отсутствие хлебных крошек",
    "Устаревший контент на страницах блога",
    "Недостаточный объем контента на ключевых страницах",
    "Не используются микроразметки и схемы",
    "Недостаточно уникальный контент",
    "Отсутствие адаптивности на некоторых страницах",
    "Неоптимизированные якорные тексты",
    "Неоптимизированные URL-адреса",
    "Использование Flash или устаревших технологий",
    "Отсутствие favicon",
    "Слишком длинные заголовки страниц",
    "Неоптимальное использование canonical-тегов",
    "Отсутствие оптимизации социальных метатегов",
    "Отсутствие политики конфиденциальности"
  ];

  const opportunities = [
    "Внедрение структурированных данных",
    "Создание AMP версий страниц",
    "Оптимизация скорости загрузки CSS и JavaScript",
    "Улучшение юзабилити мобильной версии",
    "Интеграция с Google Analytics",
    "Создание блога для увеличения органического трафика",
    "Расширение семантического ядра",
    "Улучшение CTA (призывов к действию)",
    "Оптимизация страницы 404",
    "Создание глоссария тематических терминов",
    "Внедрение FAQ-разделов на страницах",
    "Оптимизация страницы контактов",
    "Создание кейсов и отзывов клиентов",
    "Улучшение качества изображений",
    "Внедрение чата поддержки"
  ];

  return {
    critical: Array.from({ length: criticalCount }, (_, i) => criticalIssues[i % criticalIssues.length]),
    important: Array.from({ length: importantCount }, (_, i) => importantIssues[i % importantIssues.length]),
    opportunities: Array.from({ length: opportunitiesCount }, (_, i) => opportunities[i % opportunities.length]),
    minor: minorCount,
    passed: passedCount
  };
};

export const generateMockOptimizationItems = (pageCount: number): OptimizationItem[] => {
  const baseItems = [
    {
      name: "Базовая стоимость обработки сайта",
      description: "Начальная стоимость анализа и подготовки к оптимизации",
      count: 1,
      price: 5000,
      pricePerUnit: 5000,
      totalPrice: 5000,
      type: "base"
    },
    {
      name: "Базовая стоимость обработки страниц",
      description: "Стоимость базовой обработки всех страниц сайта",
      count: pageCount,
      price: 200,
      pricePerUnit: 200,
      totalPrice: pageCount * 200,
      type: "base"
    }
  ];

  // Критические ошибки
  const criticalCount = Math.max(Math.floor(pageCount * 0.15), 3);
  const criticalItems = [{
    name: "Исправление критических ошибок",
    description: "Устранение критических ошибок, блокирующих индексацию",
    count: criticalCount,
    price: criticalCount * 300,
    pricePerUnit: 300,
    totalPrice: criticalCount * 300,
    type: "critical"
  }];

  // Предупреждения
  const warningCount = Math.max(Math.floor(pageCount * 0.25), 4);
  const warningItems = [{
    name: "Исправление предупреждений",
    description: "Устранение предупреждений и некритичных ошибок",
    count: warningCount,
    price: warningCount * 150,
    pricePerUnit: 150,
    totalPrice: warningCount * 150,
    type: "warning"
  }];

  // Технические улучшения
  const metaTagsCount = Math.max(Math.floor(pageCount * 0.8), 5);
  const brokenLinksCount = Math.max(Math.floor(pageCount * 0.3), 3);
  const imagesCount = Math.max(Math.floor(pageCount * 1.5), 10);
  const redirectsCount = Math.max(Math.floor(pageCount * 0.2), 2);
  const speedIssuesCount = Math.max(Math.floor(pageCount * 0.25), 2);
  
  const technicalItems = [
    {
      name: "Оптимизация мета-тегов",
      description: "Создание и оптимизация мета-тегов title и description",
      count: metaTagsCount,
      price: 50,
      pricePerUnit: 50,
      totalPrice: metaTagsCount * 50,
      type: "technical"
    },
    {
      name: "Исправление битых ссылок",
      description: "Обнаружение и исправление некорректных ссылок",
      count: brokenLinksCount,
      price: 70,
      pricePerUnit: 70,
      totalPrice: brokenLinksCount * 70,
      type: "technical"
    },
    {
      name: "Оптимизация изображений",
      description: "Оптимизация размера и добавление alt-тегов для изображений",
      count: imagesCount,
      price: 40,
      pricePerUnit: 40,
      totalPrice: imagesCount * 40,
      type: "technical"
    },
    {
      name: "Настройка редиректов",
      description: "Создание правильных редиректов для старых URL",
      count: redirectsCount,
      price: 60,
      pricePerUnit: 60,
      totalPrice: redirectsCount * 60,
      type: "technical"
    },
    {
      name: "Улучшение производительности",
      description: "Оптимизация скорости загрузки страниц",
      count: speedIssuesCount,
      price: 100,
      pricePerUnit: 100,
      totalPrice: speedIssuesCount * 100,
      type: "technical"
    }
  ];

  // Контентные улучшения
  const seoContentCount = Math.max(Math.floor(pageCount * 0.9), 5);
  const headingsCount = Math.max(Math.floor(pageCount * 0.7), 5);
  const readabilityCount = Math.max(Math.floor(pageCount * 0.5), 3);
  const uniqueContentCount = Math.max(Math.floor(pageCount * 0.4), 3);
  
  const contentItems = [
    {
      name: "Оптимизация контента для SEO",
      description: "Оптимизация текстового содержимого для поисковых систем",
      count: seoContentCount,
      price: 120,
      pricePerUnit: 120,
      totalPrice: seoContentCount * 120,
      type: "content"
    },
    {
      name: "Структура заголовков",
      description: "Оптимизация структуры заголовков H1-H6",
      count: headingsCount,
      price: 80,
      pricePerUnit: 80,
      totalPrice: headingsCount * 80,
      type: "content"
    },
    {
      name: "Улучшение читабельности",
      description: "Работа над улучшением читабельности текста",
      count: readabilityCount,
      price: 90,
      pricePerUnit: 90,
      totalPrice: readabilityCount * 90,
      type: "content"
    },
    {
      name: "Уникализация контента",
      description: "Работа над повышением уникальности контента",
      count: uniqueContentCount,
      price: 150,
      pricePerUnit: 150,
      totalPrice: uniqueContentCount * 150,
      type: "content"
    }
  ];

  // Дополнительно
  const additionalItems = [
    {
      name: "Гарантия результата",
      description: "Гарантированное повышение позиций в поисковой выдаче",
      count: 1,
      price: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      type: "additional"
    }
  ];

  // Объединяем все элементы
  return [
    ...baseItems,
    ...criticalItems,
    ...warningItems,
    ...technicalItems,
    ...contentItems,
    ...additionalItems
  ];
};

export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
};

export const generateRandomPageCount = (): number => {
  return Math.floor(Math.random() * 50) + 10; // От 10 до 59 страниц
};

export const generateAuditData = (url: string): AuditData => {
  const seed = Math.random();
  const pageCount = Math.floor(seed * 100) + 10;
  const score = generateRandomScore();
  const optimizationItems = generateMockOptimizationItems(pageCount);
  const optimizationCost = calculateTotalCost(optimizationItems);
  
  return {
    id: generateRandomId(),
    url: url,
    title: `Audit for ${url}`,
    score: score,
    previousScore: score - Math.floor(Math.random() * 20 - 10),
    pageCount: pageCount,
    crawledPages: pageCount - Math.floor(Math.random() * 5),
    date: new Date().toISOString(),
    status: 'completed',
    issues: generateIssues(seed),
    details: generateAuditDetails(seed),
    optimizationItems: optimizationItems,
    optimizationCost: optimizationCost
  };
};
