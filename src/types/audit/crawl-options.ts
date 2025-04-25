
export interface CrawlOptions {
  maxPages?: number;
  includeExternalLinks?: boolean;
  followRobotsTxt?: boolean;
  userAgent?: string;
  delay?: number;
  maxDepth?: number;
  checkPerformance?: boolean;
}

export interface OptimizationOptions {
  fixMetaTags?: boolean;
  improveContent?: boolean;
  optimizeImages?: boolean;
  fixLinks?: boolean;
  improveStructure?: boolean;
  optimizeSpeed?: boolean;
  maxTokens?: number;
  max_tokens?: number; // Adding snake_case version for API compatibility
}
