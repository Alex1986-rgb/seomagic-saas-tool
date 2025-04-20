
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
  items: Array<{ name: string; description: string; count: number; price: number; totalPrice: number; }>;
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
  
  // Estimate how many items need optimization
  const metaTagsCount = Math.ceil(pageCount * 0.7); // 70% of pages need meta tag optimization
  const contentCount = Math.ceil(pageCount * 0.5); // 50% of pages need content optimization
  const imageAltCount = Math.ceil(pageCount * 3); // Assuming 3 images per page on average
  const performanceCount = Math.ceil(pageCount * 0.3); // 30% of pages need performance improvement
  
  // Calculate item costs
  const items = [
    {
      name: "Создание карты сайта",
      description: "Генерация полной карты сайта",
      count: 1,
      price: currentPricingConfig.sitemap,
      totalPrice: currentPricingConfig.sitemap
    },
    {
      name: "Оптимизация META-тегов",
      description: "Генерация оптимизированных заголовков и описаний",
      count: metaTagsCount,
      price: currentPricingConfig.metaTagsPerItem,
      totalPrice: metaTagsCount * currentPricingConfig.metaTagsPerItem
    },
    {
      name: "Оптимизация контента",
      description: "SEO-оптимизация текстового содержимого",
      count: contentCount,
      price: currentPricingConfig.contentPerPage,
      totalPrice: contentCount * currentPricingConfig.contentPerPage
    },
    {
      name: "Оптимизация изображений",
      description: "Добавление ALT-атрибутов для изображений",
      count: imageAltCount,
      price: currentPricingConfig.imageAltPerItem,
      totalPrice: imageAltCount * currentPricingConfig.imageAltPerItem
    },
    {
      name: "Улучшение производительности",
      description: "Оптимизация скорости загрузки страниц",
      count: performanceCount,
      price: currentPricingConfig.performancePerPage,
      totalPrice: performanceCount * currentPricingConfig.performancePerPage
    }
  ];
  
  // Calculate total
  let totalCost = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Apply discount
  if (discount > 0) {
    totalCost = Math.round(totalCost * (1 - discount));
  }
  
  return {
    totalCost,
    items
  };
};
