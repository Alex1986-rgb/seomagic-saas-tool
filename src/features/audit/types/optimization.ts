
import { 
  OptimizationItem,
  OptimizationOptions as BaseOptimizationOptions,
  OptimizationCosts,
  OptimizationResult,
  OptimizationMetrics,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
} from './optimization-types';

// Re-export OptimizationResults with correct name
import { OptimizationResults as BaseOptimizationResults } from './optimization-types';

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

export type { BaseOptimizationOptions as OptimizationOptions };

// For backward compatibility, we'll re-export OptimizationResults
export type { BaseOptimizationResults as OptimizationResults };
