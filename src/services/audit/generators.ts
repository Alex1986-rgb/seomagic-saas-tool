import { faker } from '@faker-js/faker';
import { PageContent } from './content';
import { AuditData, OptimizationItem } from '@/types/audit.d';

/**
 * Generates a random score between 0 and 100
 */
export const generateRandomScore = (): number => {
  return Math.floor(Math.random() * 101);
};

/**
 * Generates a random status from 'error', 'warning', and 'good'
 */
export const generateRandomStatus = (): 'error' | 'warning' | 'good' => {
  const statuses: ('error' | 'warning' | 'good')[] = ['error', 'warning', 'good'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Generates a random trend from 'up', 'down', and 'neutral'
 */
export const generateRandomTrend = (): 'up' | 'down' | 'neutral' => {
  const trends: ('up' | 'down' | 'neutral')[] = ['up', 'down', 'neutral'];
  return trends[Math.floor(Math.random() * trends.length)];
};

/**
 * Generates a random impact from 'high', 'medium', and 'low'
 */
export const generateRandomImpact = (): 'high' | 'medium' | 'low' => {
  const impacts: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  return impacts[Math.floor(Math.random() * impacts.length)];
};

/**
 * Generates a random number of affected URLs
 */
export const generateRandomAffectedUrls = (): string[] => {
  const numUrls = Math.floor(Math.random() * 5); // Random number between 0 and 4
  const urls: string[] = [];
  for (let i = 0; i < numUrls; i++) {
    urls.push(faker.internet.url());
  }
  return urls;
};

/**
 * Generates a random number of issues
 */
export const generateRandomIssues = (): { critical: string[]; important: string[]; opportunities: string[]; minor: string[] } => {
  return {
    critical: Array.from({ length: Math.floor(Math.random() * 3) }, () => faker.lorem.sentence()),
    important: Array.from({ length: Math.floor(Math.random() * 5) }, () => faker.lorem.sentence()),
    opportunities: Array.from({ length: Math.floor(Math.random() * 7) }, () => faker.lorem.sentence()),
    minor: Array.from({ length: Math.floor(Math.random() * 10) }, () => faker.lorem.sentence()),
  };
};

/**
 * Generates a random audit data object
 */
export const generateAuditData = (url: string): AuditData => {
  const score = generateRandomScore();
  const previousScore = generateRandomScore();
  const issues = generateRandomIssues();

  return {
    id: faker.string.uuid(),
    url: url,
    date: faker.date.past().toLocaleDateString(),
    score: score,
    previousScore: previousScore,
    issues: issues,
    details: {
      seo: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
      content: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
      performance: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
      technical: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
      mobile: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
      usability: {
        score: generateRandomScore(),
        passed: Math.floor(Math.random() * 20),
        warning: Math.floor(Math.random() * 5),
        failed: Math.floor(Math.random() * 3),
        previousScore: generateRandomScore(),
        items: Array.from({ length: 5 }, () => ({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: generateRandomStatus(),
          score: generateRandomScore(),
          previousScore: generateRandomScore(),
          trend: generateRandomTrend(),
          impact: generateRandomImpact(),
          solution: faker.lorem.sentence(),
          recommendation: faker.lorem.sentence(),
          affectedUrls: generateRandomAffectedUrls(),
          value: faker.lorem.word(),
          helpText: faker.lorem.sentence(),
        })),
      },
    },
    pageCount: Math.floor(Math.random() * 300),
    crawledPages: Math.floor(Math.random() * 300),
    status: 'completed',
    optimizationCost: Math.floor(Math.random() * 1000),
    domain: faker.internet.domainName(),
    title: faker.lorem.sentence(),
    scanTime: faker.date.recent().toLocaleTimeString(),
  };
};

/**
 * Generates a mock page content object
 */
export const generateMockPageContent = (url: string): PageContent => {
  return {
    url: url,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    meta: {
      description: faker.lorem.sentence(),
      keywords: faker.lorem.words(5),
    },
    metadata: {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      keywords: faker.lorem.words(5),
      canonicalUrl: `https://${url}/canonical`,
    },
    images: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
      url: faker.image.url(),
      alt: faker.lorem.sentence(),
    })),
    headings: {
      h1: Array.from({ length: Math.floor(Math.random() * 3) }, () => faker.lorem.sentence()),
      h2: Array.from({ length: Math.floor(Math.random() * 5) }, () => faker.lorem.sentence()),
      h3: Array.from({ length: Math.floor(Math.random() * 7) }, () => faker.lorem.sentence()),
    },
    wordCount: Math.floor(Math.random() * 500),
  };
};

/**
 * Generates mock optimization items for a website
 */
export const generateMockOptimizationItems = (pageCount: number = 10): OptimizationItem[] => {
  const items: OptimizationItem[] = [];
  
  // Add base optimization costs
  items.push({
    id: "base-cost",
    page: "Весь сайт",
    tasks: ["Базовая настройка оптимизации", "Анализ структуры сайта"],
    cost: 5000,
    priority: "high",
    category: "base",
    name: "Базовая стоимость оптимизации",
    description: "Базовые работы по настройке оптимизации сайта",
    count: 1,
    price: 5000,
    totalPrice: 5000,
    errorCount: Math.floor(Math.random() * 5) + 3 // Random error count between 3-7
  });
  
  // Critical errors
  items.push({
    id: "critical-errors",
    page: "Весь сайт",
    tasks: ["Исправление критических ошибок", "Восстановление индексации"],
    cost: 3000,
    priority: "high",
    category: "errors",
    name: "Исправление критических оибок",
    description: "Исправление ошибок, блокирующих индексацию и ранжирование",
    count: 1,
    price: 3000,
    totalPrice: 3000,
    errorCount: Math.floor(Math.random() * 10) + 5 // Random error count between 5-14
  });
  
  // Per-page optimizations
  const pageCost = 300;
  items.push({
    id: "meta-tags",
    page: "Все страницы",
    tasks: ["Оптимизация заголовков", "Настройка мета-описаний"],
    cost: pageCost * pageCount,
    priority: "high",
    category: "meta",
    name: "Оптимизация мета-тегов",
    description: `Оптимизация заголовков и мета-описаний для ${pageCount} страниц`,
    count: pageCount,
    price: pageCost,
    pricePerUnit: pageCost,
    totalPrice: pageCost * pageCount,
    errorCount: pageCount > 5 ? Math.floor(pageCount * 0.6) : Math.floor(pageCount * 0.8) // About 60-80% of pages have meta tag issues
  });
  
  // Add broken links fixing
  const brokenLinksCount = Math.floor(pageCount * 0.3) + 1;
  const linkFixCost = 200;
  items.push({
    id: "broken-links",
    page: "Внутренние ссылки",
    tasks: ["Исправление битых ссылок", "Настройка редиректов"],
    cost: linkFixCost * brokenLinksCount,
    priority: "medium",
    category: "links",
    name: "Исправление битых сылок",
    description: `Исправление ${brokenLinksCount} битых ссылок и настройка редиректов`,
    count: brokenLinksCount,
    price: linkFixCost,
    pricePerUnit: linkFixCost,
    totalPrice: linkFixCost * brokenLinksCount,
    errorCount: brokenLinksCount
  });
  
  // Image optimization
  const imagesCount = Math.floor(pageCount * 2.5);
  const imageOptCost = 50;
  items.push({
    id: "images",
    page: "Изображения",
    tasks: ["Оптимизация изображений", "Добавление ALT-тегов"],
    cost: imageOptCost * imagesCount,
    priority: "medium",
    category: "media",
    name: "Оптимизация изображений",
    description: `Оптимизация ${imagesCount} изображений и добавление ALT-тегов`,
    count: imagesCount,
    price: imageOptCost,
    pricePerUnit: imageOptCost,
    totalPrice: imageOptCost * imagesCount,
    errorCount: Math.floor(imagesCount * 0.7) // About 70% of images need optimization
  });
  
  // Content optimization
  const contentOptCost = 500;
  const contentPagesCount = Math.ceil(pageCount * 0.6);
  items.push({
    id: "content",
    page: "Контент",
    tasks: ["Оптимизация контента", "Улучшение читабельности"],
    cost: contentOptCost * contentPagesCount,
    priority: "medium",
    category: "content",
    name: "Оптимизация контента страниц",
    description: `Оптимизация контента для ${contentPagesCount} страниц`,
    count: contentPagesCount,
    price: contentOptCost,
    pricePerUnit: contentOptCost,
    totalPrice: contentOptCost * contentPagesCount,
    errorCount: Math.ceil(contentPagesCount * 0.5) // About 50% of pages have content issues
  });
  
  return items;
};

/**
 * Calculates the total cost of optimization items
 */
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};
