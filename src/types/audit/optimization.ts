
export interface OptimizationItem {
  name: string;
  description: string;
  count: number;
  price: number;
  totalPrice: number;
  pricePerUnit?: number;
  type?: string;
}

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
}
