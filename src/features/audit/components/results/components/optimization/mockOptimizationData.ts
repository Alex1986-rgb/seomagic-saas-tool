
import { OptimizationItem } from '../../../types/optimization-types';
import { calculateDiscount } from '@/services/audit/optimization/discountCalculator';
import { getStandardOptimizationItems } from '@/services/audit/optimization/pricingConfig';

export const generateRandomPageCount = (min: number = 10, max: number = 1000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateMockOptimizationItems = (pageCount: number = 15): OptimizationItem[] => {
  // Get base items
  const baseItems = getStandardOptimizationItems();
  
  // Scale the counts based on the page count
  return baseItems.map(item => {
    // Scale count based on page count for some items
    let scaledCount = item.count;
    
    if (['meta_tags', 'content_optimization', 'heading_structure', 'url_structure'].includes(item.id)) {
      // These items scale directly with page count
      scaledCount = Math.min(pageCount, 100); // Cap at 100 to prevent extreme numbers
    } else if (['image_optimization'].includes(item.id)) {
      // Assume more pages = more images
      scaledCount = Math.min(Math.round(pageCount * 2), 200); // Cap at 200
    } else if (['broken_links'].includes(item.id)) {
      // More pages = more potential broken links
      scaledCount = Math.min(Math.round(pageCount * 0.3), 50); // Cap at 50
    }
    
    // Calculate new total price
    const totalPrice = item.price * scaledCount;
    
    return {
      ...item,
      count: scaledCount,
      totalPrice,
      cost: totalPrice,
    };
  });
};

export const calculateTotalCost = (items: OptimizationItem[]): number => {
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

export const calculatePricingTiers = (pageCount: number) => {
  // Define pricing tiers based on page count
  if (pageCount <= 3) {
    return { discountPercentage: 0, tier: 'Начальный' };
  } else if (pageCount <= 50) {
    return { discountPercentage: 20, tier: 'Базовый' };
  } else if (pageCount <= 500) {
    return { discountPercentage: 50, tier: 'Стандарт' };
  } else {
    return { discountPercentage: 80, tier: 'Корпоративный' };
  }
};

export const generateOptimizationCosts = (pageCount: number = 15) => {
  const items = generateMockOptimizationItems(pageCount);
  const rawTotalCost = calculateTotalCost(items);
  
  // Calculate discount based on page count
  const { discountPercentage, discountAmount, finalTotal } = calculateDiscount(rawTotalCost, pageCount);
  
  return {
    items,
    totalCost: rawTotalCost,
    discountPercentage,
    discountAmount,
    finalCost: finalTotal,
    pageCount
  };
};

// Add this for implementation of missing component
export const createDemonstrationOptimizationItems = (): OptimizationItem[] => {
  return [
    {
      id: "technical_audit",
      name: "Технический аудит",
      description: "Базовый технический аудит всего сайта",
      count: 1,
      price: 5000,
      totalPrice: 5000,
      priority: "high",
      category: "base",
      page: "весь сайт",
      tasks: ["Технический анализ"],
      cost: 5000,
      errorCount: 1
    },
    {
      id: "meta_tags",
      name: "Оптимизация мета-тегов",
      description: "Оптимизация title и description для всех страниц",
      count: 10,
      price: 300,
      totalPrice: 3000,
      priority: "high",
      category: "seo",
      page: "все страницы",
      tasks: ["Оптимизация мета-тегов"],
      cost: 3000,
      errorCount: 18
    },
    {
      id: "image_optimization",
      name: "Оптимизация изображений",
      description: "Оптимизация alt-тегов и сжатие изображений",
      count: 25,
      price: 100,
      totalPrice: 2500,
      priority: "medium",
      category: "media",
      page: "все страницы",
      tasks: ["Оптимизация изображений"],
      cost: 2500,
      errorCount: 32
    }
  ];
};

export const createDemonstrationCost = (pageCount: number = 20) => {
  const items = createDemonstrationOptimizationItems();
  const rawTotalCost = calculateTotalCost(items);
  
  // Apply discount based on page count
  const { discountPercentage, discountAmount, finalTotal } = calculateDiscount(rawTotalCost, pageCount);
  
  return {
    items,
    totalCost: rawTotalCost,
    discountPercentage,
    discountAmount,
    finalCost: finalTotal,
    pageCount
  };
};
