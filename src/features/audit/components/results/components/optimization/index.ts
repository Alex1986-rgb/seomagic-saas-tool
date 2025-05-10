
// Export basic components
export { default as CostDetailsTable } from './CostDetailsTable';
export { default as CostSummary } from './CostSummary';
export { default as OptimizationHeading } from './OptimizationHeading';
export { default as OptimizationSummary } from './OptimizationSummary';
export { default as OptimizationCost } from './OptimizationCost';
export { default as OptimizationPlans } from './OptimizationPlans';
export { default as DemonstrationCost } from './DemonstrationCost';

// Export data generators and utilities
export {
  generateRandomPageCount,
  generateMockOptimizationItems,
  calculateTotalCost,
  calculatePricingTiers,
  generateOptimizationCosts
} from './mockOptimizationData';

// Export process components
export { OptimizationProcessContainer } from './process';

// Export types
export type { OptimizationItem } from '@/features/audit/types/optimization-types';
