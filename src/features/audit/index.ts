
// Re-export all audit components, hooks, and utilities
export * from './utils';
export * from './hooks';

// Export types with explicit type qualifier to avoid ambiguities
export type {
  OptimizationItem,
  OptimizationCosts,
  OptimizationResults,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse,
  OptimizationOptions
} from './types/optimization-types';

// Export individual components to avoid name conflicts
export * from './components/results/components';

// For components with potential naming conflicts, export explicitly instead of re-exporting
export { default as AuditOptimizationResults } from './components/results/components/optimization/OptimizationResults';
