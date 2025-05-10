/**
 * Калькулятор стоимости оптимизации сайта
 */

// Базовая конфигурация цен
export const pricingConfig = {
  baseCost: 5000,
  pagesMultiplier: 1.5,
  
  // Цены за единицу работы
  sitemap: 3000,
  metaTagsPerItem: 150,
  contentPerPage: 500,
  imageAltPerItem: 50,
  performancePerPage: 200,
  linksPerItem: 100,
  structurePerItem: 250,
  
  // Скидки
  smallSiteDiscount: 0.1,
  mediumSiteDiscount: 0.05,
  largeSiteDiscount: 0.15,
  
  // Пороги для типов сайтов
  smallSiteThreshold: 30,
  mediumSiteThreshold: 100,
  
  // Добавляем поля для планов
  basicPlan: 15000,
  standardPlan: 35000,
  premiumPlan: 75000
};

/**
 * Функция для расчета стоимости оптимизации
 * @param pageCount - количество страниц на сайте
 * @param options - дополнительные опции для расчета
 * @returns итоговая стоимость оптимизации
 */
export const calculateOptimizationCost = (pageCount: number, options: any): number => {
  let cost = pricingConfig.baseCost;
  
  // Учет количества страниц
  cost += pageCount * pricingConfig.pagesMultiplier;
  
  // Дополнительные опции
  if (options.sitemap) {
    cost += pricingConfig.sitemap;
  }
  if (options.metaTags) {
    cost += options.metaTags * pricingConfig.metaTagsPerItem;
  }
  if (options.content) {
    cost += options.content * pricingConfig.contentPerPage;
  }
  if (options.imageAlt) {
    cost += options.imageAlt * pricingConfig.imageAltPerItem;
  }
  if (options.performance) {
    cost += options.performance * pricingConfig.performancePerPage;
  }
  if (options.links) {
    cost += options.links * pricingConfig.linksPerItem;
  }
  if (options.structure) {
    cost += options.structure * pricingConfig.structurePerItem;
  }
  
  // Применение скидок
  if (pageCount <= pricingConfig.smallSiteThreshold) {
    cost -= cost * pricingConfig.smallSiteDiscount;
  } else if (pageCount <= pricingConfig.mediumSiteThreshold) {
    cost -= cost * pricingConfig.mediumSiteDiscount;
  } else {
    cost -= cost * pricingConfig.largeSiteDiscount;
  }
  
  return Math.max(cost, 0); // Ensure cost is not negative
};
