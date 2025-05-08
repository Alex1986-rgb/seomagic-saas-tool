
import { CrawlOptions as BaseCrawlOptions } from './crawler';

// Export crawl options interfaces
export type CrawlOptions = BaseCrawlOptions;

export interface OptimizationOptions {
  includeImages?: boolean;
  optimizationLevel?: 'basic' | 'standard' | 'advanced';
  targetPageSpeed?: number;
  minifyCode?: boolean;
  compressImages?: boolean;
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  temperature?: number;
  max_tokens?: number;
  contentQuality?: string;
  language?: string;
  model?: string;
}
