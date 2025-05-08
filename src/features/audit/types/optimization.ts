
import { 
  OptimizationItem,
  OptimizationOptions as BaseOptimizationOptions,
  OptimizationCosts,
  OptimizationResults,
  OptimizationMetrics,
  OptimizationResult,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse
} from './optimization-types';

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

// For backward compatibility, we'll define this interface if needed
export interface OptimizationResults {
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
  recommendations: string[];
}
