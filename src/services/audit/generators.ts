
import { v4 as uuidv4 } from 'uuid';
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { CategoryData, AuditData } from '@/types/audit';

/**
 * Generate random audit data for development and testing
 */
export const generateAuditData = (url?: string): any => {
  const domain = url ? extractDomain(url) : 'example.com';
  const pageCount = Math.floor(Math.random() * 100) + 10;
  const score = Math.floor(Math.random() * 30) + 70;
  
  // Generate issues
  const criticalCount = Math.floor(Math.random() * 3);
  const importantCount = Math.floor(Math.random() * 6);
  const minorCount = Math.floor(Math.random() * 10);
  const opportunitiesCount = Math.floor(Math.random() * 8);
  const passedCount = Math.floor(Math.random() * 15) + 5;
  
  // Create sample issues
  const criticalIssues = Array(criticalCount).fill(0).map(() => ({
    id: uuidv4(),
    title: generateRandomIssueTitle('critical'),
    description: 'Эта проблема критически влияет на ранжирование вашего сайта в поисковых системах.',
    impact: 'high',
    affected: Math.floor(Math.random() * pageCount) + 1,
    urls: []
  }));
  
  const importantIssues = Array(importantCount).fill(0).map(() => ({
    id: uuidv4(),
    title: generateRandomIssueTitle('important'),
    description: 'Эта проблема значительно влияет на ранжирование вашего сайта.',
    impact: 'medium',
    affected: Math.floor(Math.random() * pageCount) + 1,
    urls: []
  }));
  
  const minorIssues = Array(minorCount).fill(0).map(() => ({
    id: uuidv4(),
    title: generateRandomIssueTitle('minor'),
    description: 'Эта проблема имеет незначительное влияние на SEO вашего сайта.',
    impact: 'low',
    affected: Math.floor(Math.random() * pageCount) + 1,
    urls: []
  }));
  
  const opportunities = Array(opportunitiesCount).fill(0).map(() => ({
    id: uuidv4(),
    title: generateRandomOpportunityTitle(),
    description: 'Это возможность для улучшения SEO вашего сайта.',
    impact: 'medium',
    potential: Math.floor(Math.random() * 15) + 5,
    urls: []
  }));
  
  const passedChecks = Array(passedCount).fill(0).map(() => ({
    id: uuidv4(),
    title: generateRandomPassedTitle(),
    description: 'Эта проверка пройдена успешно.',
  }));
  
  // Generate category data
  const categories = {
    seo: generateCategoryData(90),
    performance: generateCategoryData(75),
    accessibility: generateCategoryData(85),
    bestPractices: generateCategoryData(80),
    security: generateCategoryData(95),
    mobile: generateCategoryData(70)
  };
  
  return {
    id: uuidv4(),
    url: url || 'https://example.com',
    domain,
    score,
    pageCount,
    scanTime: new Date().toISOString(),
    issues: {
      critical: criticalIssues,
      important: importantIssues,
      minor: minorIssues,
      opportunities,
      passed: passedChecks
    },
    categories,
    // Add data for demo optimization
    optimizationItems: generateMockOptimizationItems(pageCount),
    optimizationCost: calculateTotalCost(generateMockOptimizationItems(pageCount))
  };
};

/**
 * Generate random issue titles for demo data
 */
const generateRandomIssueTitle = (severity: string): string => {
  const criticalTitles = [
    'Отсутствуют метатеги description',
    'Несколько H1 на странице',
    'Неоптимизированные изображения',
    'Отсутствует файл robots.txt',
    'Медленная загрузка страниц',
    'Отсутствует SSL-сертификат',
    'Дубликаты мета-описаний',
    'Контент не оптимизирован для мобильных устройств'
  ];
  
  const importantTitles = [
    'Страницы без заголовков',
    'Неоптимальное использование ключевых слов',
    'Отсутствующие alt-атрибуты',
    'Неправильная структура URL',
    'Отсутствует карта сайта',
    'Не оптимизирована структура заголовков',
    'Низкая плотность ключевых слов',
    'Избыточное использование ключевых слов'
  ];
  
  const minorTitles = [
    'Отсутствуют теги Open Graph',
    'Нет микроразметки Schema.org',
    'Отсутствуют внутренние ссылки',
    'Недостаточно исходящих ссылок',
    'Отсутствуют хлебные крошки',
    'Устаревшие плагины',
    'Неоптимизированные анкоры ссылок',
    'Отсутствуют сжатие CSS/JS'
  ];
  
  let titles: string[] = [];
  
  if (severity === 'critical') {
    titles = criticalTitles;
  } else if (severity === 'important') {
    titles = importantTitles;
  } else {
    titles = minorTitles;
  }
  
  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Generate random opportunity titles
 */
const generateRandomOpportunityTitle = (): string => {
  const titles = [
    'Оптимизация контента для улучшения позиций',
    'Улучшение структуры сайта',
    'Создание качественных обратных ссылок',
    'Улучшение скорости загрузки страниц',
    'Оптимизация мета-данных',
    'Внедрение структурированных данных',
    'Повышение мобильной оптимизации',
    'Создание более качественного контента',
    'Улучшение пользовательского опыта'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Generate random passed check titles
 */
const generateRandomPassedTitle = (): string => {
  const titles = [
    'Корректное использование заголовков H1',
    'Правильная реализация мета-тегов',
    'Оптимизированные URL',
    'Корректные редиректы',
    'Оптимизированный размер контента',
    'Правильная структура сайта',
    'Безопасное соединение (SSL)',
    'Отсутствие большого количества исходящих ссылок',
    'Корректная индексация сайта'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

/**
 * Extract domain from URL
 */
const extractDomain = (url: string): string => {
  try {
    // Try to parse the URL
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch (e) {
    // If parsing fails, just return the URL as is or extract domain with regex
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
    return domainMatch ? domainMatch[1] : url;
  }
};

/**
 * Generate mock category data for audit
 */
function generateCategoryData(score: number): CategoryData {
  return {
    score,
    passed: Math.floor(Math.random() * 10) + 5,
    warning: Math.floor(Math.random() * 5),
    failed: Math.floor(Math.random() * 3),
    items: []
  };
}

/**
 * Generate mock optimization items based on page count
 */
export function generateMockOptimizationItems(pageCount: number): OptimizationItem[] {
  const baseCost = 2500;
  const perPageCost = pageCount * 10;
  
  const items: OptimizationItem[] = [
    {
      name: 'Базовый аудит SEO',
      description: 'Первичный аудит и анализ сайта',
      count: 1,
      price: baseCost,
      pricePerUnit: baseCost,
      totalPrice: baseCost,
      type: 'base'
    },
    {
      name: 'Оптимизация метатегов',
      description: `Оптимизация метатегов для ${pageCount} страниц`,
      count: pageCount,
      price: perPageCost,
      pricePerUnit: 10,
      totalPrice: perPageCost,
      type: 'content'
    },
    {
      name: 'Внутренняя оптимизация',
      description: 'Оптимизация структуры и внутренних ссылок',
      count: 1,
      price: 1500,
      pricePerUnit: 1500,
      totalPrice: 1500,
      type: 'technical'
    },
    {
      name: 'Оптимизация скорости',
      description: 'Ускорение загрузки страниц',
      count: 1,
      price: 2000,
      pricePerUnit: 2000,
      totalPrice: 2000,
      type: 'technical'
    },
    {
      name: 'Скидка за объем',
      description: 'Скидка при заказе комплексной оптимизации',
      count: 1,
      price: -1000,
      pricePerUnit: -1000,
      totalPrice: -1000,
      type: 'discount'
    },
    {
      name: 'Гарантия результата',
      description: 'Гарантируем улучшение позиций в течение 30 дней',
      count: 1,
      price: 0,
      pricePerUnit: 0,
      totalPrice: 0,
      type: 'guarantee'
    },
    {
      name: 'Дополнительные услуги',
      description: 'Прочие услуги по оптимизации',
      count: 1,
      price: 1000,
      pricePerUnit: 1000,
      totalPrice: 1000,
      type: 'other'
    }
  ];
  
  return items;
}

/**
 * Calculate total cost from optimization items
 */
export function calculateTotalCost(items: OptimizationItem[]): number {
  return items.reduce((total, item) => total + item.totalPrice, 0);
}
