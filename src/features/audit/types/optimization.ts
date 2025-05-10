
import { 
  OptimizationItem,
  OptimizationCosts,
  OptimizationResults,
  OptimizationMetrics,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse,
  OptimizationOptions
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
  OptimizationResults,
  OptimizationProgressState,
  PageContent,
  OptimizationResponse,
  OptimizationOptions
};
