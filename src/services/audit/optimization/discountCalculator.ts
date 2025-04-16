
import { PRICING } from './pricingConfig';
import { OptimizationItem } from './types';

export const calculateDiscount = (totalPages: number, totalCost: number): OptimizationItem | null => {
  let discountPercent = 0;
  
  if (totalPages > PRICING.DISCOUNTS.LARGE.threshold) {
    discountPercent = PRICING.DISCOUNTS.LARGE.percent;
  } else if (totalPages > PRICING.DISCOUNTS.MEDIUM.threshold) {
    discountPercent = PRICING.DISCOUNTS.MEDIUM.percent;
  } else if (totalPages > PRICING.DISCOUNTS.SMALL.threshold) {
    discountPercent = PRICING.DISCOUNTS.SMALL.percent;
  }
  
  if (discountPercent > 0) {
    const discountAmount = Math.round(totalCost * (discountPercent / 100));
    return {
      type: `Скидка за объем (${discountPercent}%)`,
      count: 1,
      pricePerUnit: -discountAmount,
      totalPrice: -discountAmount,
      description: `Скидка ${discountPercent}% от общей стоимости за большое количество страниц (${totalPages})`,
      name: `Скидка ${discountPercent}%`,
      price: -discountAmount
    };
  }
  
  return null;
};
