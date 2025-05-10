
/**
 * Calculate discount based on the total cost and site size
 */
export const calculateDiscount = (
  totalCost: number, 
  totalUrls: number
): { discountPercentage: number; discountAmount: number; finalTotal: number } => {
  let discountPercentage = 0;
  
  // Volume-based discount based on site size
  if (totalUrls >= 1000) {
    discountPercentage = 80; // 80% discount for sites with 1000+ pages
  } else if (totalUrls >= 500) {
    discountPercentage = 50; // 50% discount for sites with 500-999 pages
  } else if (totalUrls >= 50) {
    discountPercentage = 20; // 20% discount for sites with 50-499 pages
  } else if (totalUrls >= 10) {
    discountPercentage = 10; // 10% discount for sites with 10-49 pages
  }
  
  // Calculate discount amount
  const discountAmount = (totalCost * discountPercentage) / 100;
  
  // Calculate final total
  const finalTotal = totalCost - discountAmount;
  
  return {
    discountPercentage,
    discountAmount,
    finalTotal
  };
};

/**
 * Calculate bulk order discount
 */
export const calculateBulkDiscount = (
  totalCost: number,
  orderQuantity: number
): { discountPercentage: number; discountAmount: number; finalTotal: number } => {
  let discountPercentage = 0;
  
  // Bulk order discount
  if (orderQuantity >= 10) {
    discountPercentage = 25;
  } else if (orderQuantity >= 5) {
    discountPercentage = 15;
  } else if (orderQuantity >= 3) {
    discountPercentage = 10;
  } else if (orderQuantity >= 2) {
    discountPercentage = 5;
  }
  
  // Calculate discount amount
  const discountAmount = (totalCost * discountPercentage) / 100;
  
  // Calculate final total
  const finalTotal = totalCost - discountAmount;
  
  return {
    discountPercentage,
    discountAmount,
    finalTotal
  };
};
