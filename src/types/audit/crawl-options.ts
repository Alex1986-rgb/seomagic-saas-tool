
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
}

export interface OptimizationOptions {
  includeImages?: boolean;
  optimizationLevel?: 'basic' | 'standard' | 'advanced';
  targetPageSpeed?: number;
  minifyCode?: boolean;
  compressImages?: boolean;
}
