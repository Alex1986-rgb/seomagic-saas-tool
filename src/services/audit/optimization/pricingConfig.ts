
import { OptimizationItem } from './types';

export interface PricingConfig {
  sitemap: number;
  metaTagsPerItem: number;
  contentPerPage: number;
  imageAltPerItem: number;
  performancePerPage: number;
  linksPerItem: number;
  structurePerItem: number;
  seoAuditBase: number;
  positionTrackingBase: number;
  keywordResearchBase: number;
  competitorAnalysisBase: number;
  // New technical improvements
  criticalErrorsFix: number;
  metaTagsOptimization: number;
  brokenLinksRedirects: number;
  imageMediaOptimization: number;
  // New content improvements
  contentSeoOptimization: number;
  headingStructure: number;
  conversionTextOptimization: number;
  readabilityImprovement: number;
}

// Цены в рублях
const defaultPricingConfig: PricingConfig = {
  sitemap: 3000, // Создание карты сайта
  metaTagsPerItem: 500, // Оптимизация метатегов
  contentPerPage: 5000, // Оптимизация контента на странице
  imageAltPerItem: 200, // Оптимизация alt-атрибутов изображений
  performancePerPage: 2000, // Оптимизация производительности страницы
  linksPerItem: 300, // Оптимизация ссылок
  structurePerItem: 1000, // Оптимизация структуры
  seoAuditBase: 10000, // Базовая стоимость SEO аудита
  positionTrackingBase: 5000, // Отслеживание позиций
  keywordResearchBase: 8000, // Исследование ключевых слов
  competitorAnalysisBase: 12000, // Анализ конкурентов
  // Technical improvements
  criticalErrorsFix: 4500, // Исправление критических ошибок
  metaTagsOptimization: 3500, // Оптимизация мета-тегов для поисковых систем
  brokenLinksRedirects: 2800, // Исправление битых ссылок и редиректов
  imageMediaOptimization: 3200, // Оптимизация изображений и медиафайлов
  // Content improvements
  contentSeoOptimization: 4800, // Оптимизация контента для поисковых систем
  headingStructure: 2500, // Настройка правильной структуры заголовков
  conversionTextOptimization: 5500, // Оптимизация текстов для улучшения конверсии
  readabilityImprovement: 3800, // Улучшение читабельности и структуры контента
};

let currentPricingConfig = { ...defaultPricingConfig };

/**
 * Get the current pricing configuration
 */
export const getPricingConfig = (): PricingConfig => {
  return currentPricingConfig;
};

/**
 * Update the pricing configuration
 */
export const updatePricingConfig = (config: Partial<PricingConfig>): PricingConfig => {
  currentPricingConfig = {
    ...currentPricingConfig,
    ...config
  };
  
  return currentPricingConfig;
};

/**
 * Reset pricing to default values
 */
export const resetPricingConfig = (): PricingConfig => {
  currentPricingConfig = { ...defaultPricingConfig };
  return currentPricingConfig;
};

/**
 * Calculate base price for a service
 */
export const calculateServiceBasePrice = (
  service: 'seoAudit' | 'positionTracking' | 'keywordResearch' | 'competitorAnalysis',
  multiplier: number = 1
): number => {
  switch (service) {
    case 'seoAudit':
      return currentPricingConfig.seoAuditBase * multiplier;
    case 'positionTracking':
      return currentPricingConfig.positionTrackingBase * multiplier;
    case 'keywordResearch':
      return currentPricingConfig.keywordResearchBase * multiplier;
    case 'competitorAnalysis':
      return currentPricingConfig.competitorAnalysisBase * multiplier;
    default:
      return 0;
  }
};

/**
 * Calculate optimization cost based on page count
 */
export const calculateOptimizationCost = (pageCount: number): {
  totalCost: number;
  items: OptimizationItem[];
} => {
  // Apply volume discounts
  let discount = 0;
  if (pageCount > 1000) {
    discount = 0.15; // 15% discount
  } else if (pageCount > 500) {
    discount = 0.10; // 10% discount
  } else if (pageCount > 200) {
    discount = 0.05; // 5% discount
  }
  
  // Calculate quantities based on page count
  const metaTagsCount = Math.ceil(pageCount * 0.7); // 70% of pages need meta tags
  const contentPagesCount = Math.ceil(pageCount * 0.5); // 50% of pages need content optimization
  const imageAltCount = Math.ceil(pageCount * 3); // Average 3 images per page
  const performancePagesCount = Math.ceil(pageCount * 0.3); // 30% of pages have performance issues
  const brokenLinksCount = Math.ceil(pageCount * 0.1); // 10% of links may be broken
  const structureIssuesCount = Math.ceil(pageCount * 0.2); // 20% of pages have structure issues
  
  // Create items array
  const items: OptimizationItem[] = [];
  
  // Basic services
  items.push({
    name: 'Карта сайта (sitemap.xml)',
    description: 'Создание и оптимизация файла sitemap.xml',
    count: 1,
    pricePerUnit: currentPricingConfig.sitemap,
    price: currentPricingConfig.sitemap,
    totalPrice: currentPricingConfig.sitemap
  });
  
  // Technical improvements
  items.push({
    name: 'Исправление критических ошибок',
    description: 'Поиск и исправление всех критических технических ошибок на сайте',
    count: 1,
    pricePerUnit: currentPricingConfig.criticalErrorsFix,
    price: currentPricingConfig.criticalErrorsFix,
    totalPrice: currentPricingConfig.criticalErrorsFix
  });
  
  items.push({
    name: 'Оптимизация мета-тегов',
    description: 'Оптимизация title, description и других мета-тегов для поисковых систем',
    count: metaTagsCount,
    pricePerUnit: currentPricingConfig.metaTagsPerItem,
    price: currentPricingConfig.metaTagsPerItem,
    totalPrice: metaTagsCount * currentPricingConfig.metaTagsPerItem
  });
  
  items.push({
    name: 'Исправление битых ссылок',
    description: 'Поиск и исправление битых ссылок и настройка редиректов',
    count: brokenLinksCount,
    pricePerUnit: currentPricingConfig.linksPerItem,
    price: currentPricingConfig.linksPerItem,
    totalPrice: brokenLinksCount * currentPricingConfig.linksPerItem
  });
  
  items.push({
    name: 'Оптимизация изображений',
    description: 'Оптимизация изображений и медиафайлов для ускорения загрузки сайта',
    count: imageAltCount,
    pricePerUnit: currentPricingConfig.imageAltPerItem,
    price: currentPricingConfig.imageAltPerItem,
    totalPrice: imageAltCount * currentPricingConfig.imageAltPerItem
  });
  
  // Content improvements
  items.push({
    name: 'Оптимизация контента для SEO',
    description: 'Оптимизация контента для повышения видимости в поисковых системах',
    count: contentPagesCount,
    pricePerUnit: currentPricingConfig.contentSeoOptimization,
    price: currentPricingConfig.contentSeoOptimization,
    totalPrice: Math.ceil(contentPagesCount * 0.8) * currentPricingConfig.contentSeoOptimization
  });
  
  items.push({
    name: 'Структура заголовков',
    description: 'Настройка правильной структуры H1-H6 заголовков для улучшения SEO',
    count: Math.ceil(pageCount * 0.6),
    pricePerUnit: currentPricingConfig.headingStructure,
    price: currentPricingConfig.headingStructure,
    totalPrice: Math.ceil(pageCount * 0.6) * currentPricingConfig.headingStructure
  });
  
  items.push({
    name: 'Оптимизация текстов для конверсии',
    description: 'Улучшение текстов для повышения коэффициента конверсии',
    count: Math.ceil(pageCount * 0.4),
    pricePerUnit: currentPricingConfig.conversionTextOptimization,
    price: currentPricingConfig.conversionTextOptimization,
    totalPrice: Math.ceil(pageCount * 0.4) * currentPricingConfig.conversionTextOptimization
  });
  
  items.push({
    name: 'Улучшение читабельности',
    description: 'Улучшение читабельности и структуры контента',
    count: Math.ceil(pageCount * 0.5),
    pricePerUnit: currentPricingConfig.readabilityImprovement,
    price: currentPricingConfig.readabilityImprovement,
    totalPrice: Math.ceil(pageCount * 0.5) * currentPricingConfig.readabilityImprovement
  });
  
  // Additional services
  items.push({
    name: 'Улучшение производительности',
    description: 'Оптимизация скорости загрузки страниц',
    count: performancePagesCount,
    pricePerUnit: currentPricingConfig.performancePerPage,
    price: currentPricingConfig.performancePerPage,
    totalPrice: performancePagesCount * currentPricingConfig.performancePerPage
  });
  
  items.push({
    name: 'Оптимизация структуры',
    description: 'Улучшение структуры URL и навигации',
    count: structureIssuesCount,
    pricePerUnit: currentPricingConfig.structurePerItem,
    price: currentPricingConfig.structurePerItem,
    totalPrice: structureIssuesCount * currentPricingConfig.structurePerItem
  });
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Apply discount
  const discountAmount = Math.round(subtotal * discount);
  const totalCost = Math.round(subtotal - discountAmount);
  
  // Add discount item if applicable
  if (discount > 0) {
    items.push({
      name: `Скидка за объем (${discount * 100}%)`,
      description: 'Скидка при оптимизации большого количества страниц',
      count: 1,
      pricePerUnit: -discountAmount,
      price: -discountAmount,
      totalPrice: -discountAmount
    });
  }
  
  // Add warranty note item
  items.push({
    name: 'Гарантия результата',
    description: 'Все работы выполняются квалифицированными SEO-специалистами с гарантией результата',
    count: 1,
    pricePerUnit: 0,
    price: 0,
    totalPrice: 0
  });
  
  return {
    totalCost,
    items
  };
};
