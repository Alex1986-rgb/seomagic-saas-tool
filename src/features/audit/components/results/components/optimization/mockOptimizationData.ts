
import { OptimizationItem } from '@/features/audit/types/optimization-types';
import { getPricingConfig } from '@/services/audit/optimization/pricingConfig';
import { calculateDiscount } from '@/services/audit/optimization/discountCalculator';

// Generate random page count for demo
export const generateRandomPageCount = (): number => {
  // Return a random number between 5 and 100
  return Math.floor(Math.random() * 96) + 5;
};

// Generate mock optimization items
export const generateMockOptimizationItems = (pageCount: number): OptimizationItem[] => {
  const items: OptimizationItem[] = [
    {
      id: "meta_tags",
      name: "Оптимизация мета-тегов",
      description: "Улучшение title и description для повышения CTR в поиске",
      count: Math.ceil(pageCount * 0.8),
      price: 150,
      totalPrice: Math.ceil(pageCount * 0.8) * 150,
      priority: "high",
      category: "seo",
      type: "meta",
      errorCount: Math.ceil(pageCount * 0.4)
    },
    {
      id: "alt_tags",
      name: "Оптимизация alt-тегов",
      description: "Добавление и оптимизация alt-атрибутов для изображений",
      count: Math.ceil(pageCount * 1.5),
      price: 50,
      totalPrice: Math.ceil(pageCount * 1.5) * 50,
      priority: "medium",
      category: "media",
      type: "image",
      errorCount: Math.ceil(pageCount * 0.8)
    },
    {
      id: "technical_audit",
      name: "Технический аудит",
      description: "Проверка и исправление технических ошибок сайта",
      count: 1,
      price: 5000,
      totalPrice: 5000,
      priority: "high",
      category: "technical",
      type: "audit"
    }
  ];
  
  // Add items based on page count
  if (pageCount > 10) {
    items.push({
      id: "content_optimization",
      name: "Оптимизация контента",
      description: "Улучшение текстового контента для SEO",
      count: Math.ceil(pageCount * 0.7),
      price: 500,
      totalPrice: Math.ceil(pageCount * 0.7) * 500,
      priority: "high",
      category: "content",
      type: "text",
      errorCount: Math.ceil(pageCount * 0.3)
    });
  }
  
  if (pageCount > 20) {
    items.push({
      id: "schema_markup",
      name: "Микроразметка Schema.org",
      description: "Внедрение структурированных данных для rich snippets",
      count: Math.min(10, Math.ceil(pageCount * 0.2)),
      price: 300,
      totalPrice: Math.min(10, Math.ceil(pageCount * 0.2)) * 300,
      priority: "medium",
      category: "technical",
      type: "schema"
    });
  }
  
  return items;
};

// Calculate total optimization cost
export const calculateTotalCost = (items: OptimizationItem[]): number => {
  const totalCost = items.reduce((acc, item) => acc + item.totalPrice, 0);
  
  return Math.round(totalCost);
};

// Calculate pricing tiers with discounts
export const calculatePricingTiers = (pageCount: number, basePrice: number): {
  basic: number;
  standard: number;
  premium: number;
  enterprise: number;
} => {
  const config = getPricingConfig();
  
  // Base prices for different tiers
  let basic = Math.min(pageCount, 3) * basePrice;
  let standard = pageCount <= 50 ? pageCount * basePrice * 0.8 : 50 * basePrice * 0.8;
  let premium = pageCount <= 500 ? pageCount * basePrice * 0.5 : 500 * basePrice * 0.5;
  let enterprise = pageCount * basePrice * 0.2; // 80% discount
  
  // Add fixed costs for each tier
  basic += config.basicPlan;
  standard += config.standardPlan;
  premium += config.premiumPlan;
  enterprise += config.premiumPlan * 1.5;
  
  return {
    basic: Math.round(basic),
    standard: Math.round(standard),
    premium: Math.round(premium),
    enterprise: Math.round(enterprise)
  };
};

// Generate optimization costs including discounts
export const generateOptimizationCosts = (pageCount: number, items: OptimizationItem[]): {
  basic: number;
  standard: number;
  premium: number;
  enterprise: number;
  totalCost: number;
  discountAmount: number;
  discountPercentage: number;
} => {
  const totalBeforeDiscount = calculateTotalCost(items);
  const { discountPercentage, discountAmount, finalTotal } = calculateDiscount(totalBeforeDiscount, pageCount);
  const pricingTiers = calculatePricingTiers(pageCount, totalBeforeDiscount / pageCount);
  
  return {
    ...pricingTiers,
    totalCost: finalTotal,
    discountAmount,
    discountPercentage
  };
};
