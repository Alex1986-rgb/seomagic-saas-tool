
// Re-export all audit types from their respective files
export * from './audit-core';
export * from './audit-details';
export * from './audit-items';
export * from './category-data';
export * from './optimization-types';

// Re-export with type qualifier to fix TS2308 errors
export * from './recommendations';

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

// Export CrawlOptions and OptimizationOptions with explicit type qualifier
export type { CrawlOptions, OptimizationOptions } from './crawl-options';
