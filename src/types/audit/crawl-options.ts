
export interface CrawlOptions {
  maxPages?: number;
  includeExternalLinks?: boolean;
  followExternalLinks?: boolean; // Adding this for backward compatibility
  followRobotsTxt?: boolean;
  userAgent?: string;
  delay?: number;
  maxDepth?: number;
  checkPerformance?: boolean;
  checkImages?: boolean; // Adding this back as it's used in useSeoOptimization.ts
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
  // Additional properties used in useSeoOptimization.ts
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  temperature?: number;
  language?: string;
  model?: string;
  contentQuality?: 'standard' | 'premium' | 'ultimate';
}
