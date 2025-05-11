
/**
 * Калькулятор скидок для оптимизации
 */

import { getDiscountByPageCount } from './pricingConfig';

/**
 * Calculates the discount based on the number of pages
 */
export const calculateDiscount = (
  totalCost: number, 
  pageCount: number
): { 
  discountPercentage: number; 
  discountAmount: number; 
  finalTotal: number 
} => {
  const discountRate = getDiscountByPageCount(pageCount);
  const discountPercentage = Math.round(discountRate * 100);
  const discountAmount = Math.round(totalCost * discountRate);
  const finalTotal = totalCost - discountAmount;
  
  return {
    discountPercentage,
    discountAmount,
    finalTotal
  };
};

/**
 * Applies discount to item price based on page count
 */
export const applyDiscountToPrice = (basePrice: number, pageCount: number): number => {
  const discountRate = getDiscountByPageCount(pageCount);
  return Math.round(basePrice * (1 - discountRate));
};

/**
 * Get pricing tier details based on page count
 */
export const getPricingTier = (pageCount: number) => {
  if (pageCount <= 3) {
    return {
      name: 'Начальный',
      discount: 0,
      basePrice: 9900
    };
  } else if (pageCount <= 50) {
    return {
      name: 'Базовый',
      discount: 20,
      basePrice: 29900
    };
  } else if (pageCount <= 500) {
    return {
      name: 'Стандарт',
      discount: 50,
      basePrice: 59900
    };
  } else {
    return {
      name: 'Корпоративный',
      discount: 80,
      basePrice: 99900
    };
  }
};
