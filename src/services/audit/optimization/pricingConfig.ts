
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
  competitorAnalysisBase: 12000 // Анализ конкурентов
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
  
  // Calculate costs for each item
  const items: OptimizationItem[] = [
    {
      name: 'Карта сайта (sitemap.xml)',
      description: 'Создание и оптимизация файла sitemap.xml',
      count: 1,
      price: currentPricingConfig.sitemap,
      totalPrice: currentPricingConfig.sitemap
    },
    {
      name: 'Оптимизация мета-тегов',
      description: 'Оптимизация title, description и других мета-тегов',
      count: metaTagsCount,
      price: currentPricingConfig.metaTagsPerItem,
      totalPrice: metaTagsCount * currentPricingConfig.metaTagsPerItem
    },
    {
      name: 'Оптимизация контента',
      description: 'Улучшение текстового содержания страниц',
      count: contentPagesCount,
      price: currentPricingConfig.contentPerPage,
      totalPrice: contentPagesCount * currentPricingConfig.contentPerPage
    },
    {
      name: 'Оптимизация изображений',
      description: 'Добавление и оптимизация alt-атрибутов',
      count: imageAltCount,
      price: currentPricingConfig.imageAltPerItem,
      totalPrice: imageAltCount * currentPricingConfig.imageAltPerItem
    },
    {
      name: 'Оптимизация производительности',
      description: 'Улучшение скорости загрузки страниц',
      count: performancePagesCount,
      price: currentPricingConfig.performancePerPage,
      totalPrice: performancePagesCount * currentPricingConfig.performancePerPage
    },
    {
      name: 'Исправление ссылок',
      description: 'Починка битых ссылок и редиректов',
      count: brokenLinksCount,
      price: currentPricingConfig.linksPerItem,
      totalPrice: brokenLinksCount * currentPricingConfig.linksPerItem
    },
    {
      name: 'Оптимизация структуры',
      description: 'Улучшение структуры URL и навигации',
      count: structureIssuesCount,
      price: currentPricingConfig.structurePerItem,
      totalPrice: structureIssuesCount * currentPricingConfig.structurePerItem
    }
  ];
  
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
      price: -discountAmount,
      totalPrice: -discountAmount
    });
  }
  
  return {
    totalCost,
    items
  };
};
