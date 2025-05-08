
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

// Do NOT re-export OptimizationResults to avoid conflicts
// Import it only for local reference
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

// Do NOT re-export OptimizationResults to avoid ambiguity
// Local applications should import directly from optimization-types
