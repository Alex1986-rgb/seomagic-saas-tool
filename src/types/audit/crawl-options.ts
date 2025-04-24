
export interface CrawlOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks?: boolean;
  userAgent?: string;
  delay?: number;
  checkImages?: boolean;
  checkPerformance?: boolean;
}

export interface OptimizationOptions {
  optimizeMetaTags: boolean;
  optimizeHeadings: boolean;
  optimizeContent: boolean;
  optimizeImages?: boolean;
  temperature?: number;
  language?: string;
  model?: string;
  fixMetaTags?: boolean;
  improveContent?: boolean;
  fixLinks?: boolean;
  improveStructure?: boolean;
  optimizeSpeed?: boolean;
}
