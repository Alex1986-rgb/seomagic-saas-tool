
import { 
  OptimizationItem,
  OptimizationCosts,
  OptimizationResult,
  OptimizationMetrics,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
} from './optimization-types';

// Do NOT re-export OptimizationResults to avoid conflicts
// Import it only for local reference
import { OptimizationResults as BaseOptimizationResults } from './optimization-types';

// Import the base optimization options but use a different name
import { OptimizationOptions as BaseOptimizationOptions } from './optimization-types';

export interface CrawlOptions {
  maxPages?: number;
  includeExternalLinks?: boolean;
  followRobotsTxt?: boolean;
  userAgent?: string;
  delay?: number;
  maxDepth?: number;
  checkPerformance?: boolean;
}

export type { 
  OptimizationItem, 
  OptimizationCosts, 
  OptimizationMetrics,
  OptimizationResult,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
};

// Don't re-export OptimizationOptions to avoid ambiguity with crawl-options
// Local applications should import directly from crawl-options or optimization-types as needed

// Do NOT re-export OptimizationResults to avoid ambiguity
// Local applications should import directly from optimization-types
