
// Re-export all audit components, hooks, and utilities
// We'll use specific exports to avoid the OptimizationResults ambiguity
export * from './utils';
export * from './hooks';

// Export types with explicit type qualifier to avoid ambiguities
export type {
  OptimizationItem,
  OptimizationCosts,
  OptimizationMetrics,
  OptimizationResult,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
} from './types/optimization-types';

// Import the OptimizationOptions from crawl-options to avoid conflicts
export type { OptimizationOptions } from './types/crawl-options';

// Export individual components to avoid name conflicts
export * from './components/results/components';
export * from './components/results';

// For components with potential naming conflicts, we need to be explicit
export { default as OptimizationResults } from './components/results/components/optimization/OptimizationResults';
