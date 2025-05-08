
// Export crawl options interfaces
export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  respectRobots?: boolean;
  followExternalLinks?: boolean;
  includeImages?: boolean;
  timeout?: number;
  userAgent?: string;
  ignoreRobotsTxt?: boolean;
  followRedirects?: boolean;
  onProgress?: (progress: any) => void;
  checkImages?: boolean;
  checkPerformance?: boolean;
}

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
