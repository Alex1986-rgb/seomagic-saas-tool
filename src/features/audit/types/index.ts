
// Re-export all audit types from their respective files
export * from './audit-core';
export * from './audit-details';
export * from './audit-items';
export * from './category-data';

// Export optimization types with explicit type qualifier to avoid conflicts
export type {
  OptimizationItem,
  OptimizationCosts,
  OptimizationMetrics,
  OptimizationResult,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
} from './optimization-types';

// Export OptimizationOptions with explicit qualifier
export type { OptimizationOptions } from './crawl-options';

// Re-export with type qualifier to fix TS1205 errors
export type { RecommendationData } from './recommendations';

// Export from crawler with explicit type qualifier to avoid name conflicts
export type {
  DeepCrawlerOptions,
  TaskProgress,
  CrawlResult,
  ImageData,
  PageIssue,
  CrawlSummary,
  RequestManager
} from './crawler';

// Explicitly export needed types from page-data to avoid conflicts
export type { PageAnalysisData } from './page-data';

// Export CrawlOptions with explicit type qualifier
export type { CrawlOptions } from './crawl-options';
