
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
  // Base optimization price
  baseOptimizationPrice: number;
  criticalErrorPrice: number;
  warningPrice: number;
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
  // Detailed cost items
  baseOptimizationPrice: 15000, // Базовая стоимость оптимизации
  criticalErrorPrice: 300, // Стоимость исправления одной критической ошибки
  warningPrice: 150, // Стоимость исправления одного предупреждения
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
  // Get metrics from site analysis (simplified for this example)
  const criticalErrors = Math.max(1, Math.round(pageCount * 0.03));
  const warnings = Math.max(2, Math.round(pageCount * 0.08));
  
  // Create items array
  const items: OptimizationItem[] = [];
  
  // Base optimization price
  items.push({
    name: 'Базовая стоимость оптимизации',
    description: 'Основная стоимость комплексной оптимизации сайта',
    count: 1,
    price: currentPricingConfig.baseOptimizationPrice,
    pricePerUnit: currentPricingConfig.baseOptimizationPrice,
    totalPrice: currentPricingConfig.baseOptimizationPrice
  });
  
  // Critical errors fix
  items.push({
    name: 'Исправление критических ошибок',
    description: 'Исправление всех критических технических ошибок на сайте',
    count: criticalErrors,
    price: currentPricingConfig.criticalErrorPrice,
    pricePerUnit: currentPricingConfig.criticalErrorPrice,
    totalPrice: criticalErrors * currentPricingConfig.criticalErrorPrice
  });
  
  // Warnings fix
  items.push({
    name: 'Исправление предупреждений',
    description: 'Исправление некритических ошибок и предупреждений',
    count: warnings,
    price: currentPricingConfig.warningPrice,
    pricePerUnit: currentPricingConfig.warningPrice,
    totalPrice: warnings * currentPricingConfig.warningPrice
  });
  
  // Technical improvements
  items.push({
    name: 'Карта сайта (sitemap.xml)',
    description: 'Создание и оптимизация файла sitemap.xml',
    count: 1,
    pricePerUnit: currentPricingConfig.sitemap,
    price: currentPricingConfig.sitemap,
    totalPrice: currentPricingConfig.sitemap
  });
  
  items.push({
    name: 'Оптимизация мета-тегов',
    description: 'Оптимизация title, description и других мета-тегов для поисковых систем',
    count: Math.ceil(pageCount * 0.7),
    pricePerUnit: currentPricingConfig.metaTagsPerItem,
    price: currentPricingConfig.metaTagsPerItem,
    totalPrice: Math.ceil(pageCount * 0.7) * currentPricingConfig.metaTagsPerItem
  });
  
  items.push({
    name: 'Исправление битых ссылок',
    description: 'Поиск и исправление битых ссылок и настройка редиректов',
    count: Math.ceil(pageCount * 0.1),
    pricePerUnit: currentPricingConfig.linksPerItem,
    price: currentPricingConfig.linksPerItem,
    totalPrice: Math.ceil(pageCount * 0.1) * currentPricingConfig.linksPerItem
  });
  
  items.push({
    name: 'Оптимизация изображений',
    description: 'Оптимизация изображений и медиафайлов для ускорения загрузки сайта',
    count: Math.ceil(pageCount * 3),
    pricePerUnit: currentPricingConfig.imageAltPerItem,
    price: currentPricingConfig.imageAltPerItem,
    totalPrice: Math.ceil(pageCount * 3) * currentPricingConfig.imageAltPerItem
  });
  
  // Content improvements
  items.push({
    name: 'Оптимизация контента для SEO',
    description: 'Оптимизация контента для повышения видимости в поисковых системах',
    count: Math.ceil(pageCount * 0.5),
    pricePerUnit: currentPricingConfig.contentSeoOptimization,
    price: currentPricingConfig.contentSeoOptimization,
    totalPrice: Math.ceil(pageCount * 0.5) * currentPricingConfig.contentSeoOptimization
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
    count: Math.ceil(pageCount * 0.3),
    pricePerUnit: currentPricingConfig.performancePerPage,
    price: currentPricingConfig.performancePerPage,
    totalPrice: Math.ceil(pageCount * 0.3) * currentPricingConfig.performancePerPage
  });
  
  // Add warranty note item
  items.push({
    name: 'Гарантия результата',
    description: 'Все работы выполняются квалифицированными SEO-специалистами с гарантией результата',
    count: 1,
    pricePerUnit: 0,
    price: 0,
    totalPrice: 0
  });
  
  // Calculate total cost from base prices
  const totalCost = currentPricingConfig.baseOptimizationPrice + 
                  (criticalErrors * currentPricingConfig.criticalErrorPrice) + 
                  (warnings * currentPricingConfig.warningPrice);
  
  return {
    totalCost,
    items
  };
};
