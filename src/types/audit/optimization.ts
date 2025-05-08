
import { 
  OptimizationItem,
  OptimizationOptions as BaseOptimizationOptions,
  OptimizationCosts,
  OptimizationResults,
  OptimizationMetrics
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

export type { OptimizationItem, OptimizationCosts, OptimizationResults, OptimizationMetrics };
export type OptimizationOptions = BaseOptimizationOptions;
