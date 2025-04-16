
import { PageStatistics, OptimizationResult, PageContent, OptimizationItem } from './types';
import { PRICING } from './pricingConfig';
import { analyzeContent } from './contentAnalyzer';
import { calculateDiscount } from './discountCalculator';

export const calculateOptimizationMetrics = (
  pageStats: PageStatistics, 
  pagesContent?: PageContent[]
): OptimizationResult => {
  let basePagePrice = PRICING.BASE_PRICES.SMALL_SITE;
  
  if (pageStats.totalPages > 500) {
    basePagePrice = PRICING.BASE_PRICES.LARGE_SITE;
  } else if (pageStats.totalPages > 50) {
    basePagePrice = PRICING.BASE_PRICES.MEDIUM_SITE;
  }
  
  let totalCost = 0;
  const optimizationItems: OptimizationItem[] = [];
  
  // Add base optimization cost
  const basePagesCost = pageStats.totalPages * basePagePrice;
  optimizationItems.push({
    type: 'Базовая оптимизация страниц',
    count: pageStats.totalPages,
    pricePerUnit: basePagePrice,
    totalPrice: basePagesCost,
    description: 'Базовая оптимизация страниц включает общий технический аудит, проверку структуры и основные улучшения SEO',
    name: 'Базовая оптимизация страниц',
    price: basePagesCost
  });
  totalCost += basePagesCost;

  if (pagesContent && pagesContent.length > 0) {
    const analysis = analyzeContent(pagesContent);
    
    if (analysis.missingMetaDescriptions > 0) {
      const cost = analysis.missingMetaDescriptions * PRICING.ITEM_PRICES.META_DESCRIPTION;
      optimizationItems.push({
        type: 'Оптимизация мета-описаний',
        count: analysis.missingMetaDescriptions,
        pricePerUnit: PRICING.ITEM_PRICES.META_DESCRIPTION,
        totalPrice: cost,
        description: 'Создание или улучшение мета-тегов description для лучшего отображения в поисковой выдаче',
        name: 'Оптимизация мета-описаний',
        price: cost
      });
      totalCost += cost;
    }

    // Add other optimization items based on analysis
    // ... Similar blocks for other optimization items ...
  }
  
  // Apply volume discount if applicable
  const discount = calculateDiscount(pageStats.totalPages, totalCost);
  if (discount) {
    optimizationItems.push(discount);
    totalCost += discount.price;
  }
  
  return {
    optimizationCost: Math.round(totalCost),
    optimizationItems
  };
};
