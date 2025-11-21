
// Re-export all components from the optimization folder
export { default as CostSummary } from './CostSummary';
export { default as CostDetailsTable } from './CostDetailsTable';
export { default as DemonstrationCost } from './DemonstrationCost';
export { default as OptimizationActions } from './OptimizationActions';
export { default as OptimizationCost } from './OptimizationCost';
export { default as OptimizationHeading } from './OptimizationHeading';
export { default as OptimizationResults } from './OptimizationResults';
export { default as OptimizationSummary } from './OptimizationSummary';
export { default as OptimizationPlans } from './OptimizationPlans';
export { default as PaymentDialog } from './PaymentDialog';
export { default as InteractiveOptimizationPanel } from './InteractiveOptimizationPanel';
export { default as EstimateComparison } from './EstimateComparison';

// Export types
export type { CostDetailsTableProps } from './types';

// Re-export OptimizationItem type from the central types
export type { OptimizationItem } from '@/features/audit/types/optimization-types';

// Export utilities
export * from './auditToInteractiveMapper';
