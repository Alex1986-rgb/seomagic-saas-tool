
/**
 * Consolidated types for the crawler functionality
 */

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
  onProgress?: (progress: TaskProgress) => void;
  checkImages?: boolean;
  checkPerformance?: boolean;
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth?: number;
  onProgress?: (progress: TaskProgress) => void;
  followExternalLinks?: boolean;
  respectRobots?: boolean;
  includeStylesheet?: boolean;
  timeout?: number;
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  forceTargetDomain?: boolean;
}

export interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

export interface CrawlResult {
  urls: string[];
  pageCount?: number;
  visitedCount?: number;
  metadata: {
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
    domain?: string;
    startTime: string;
    endTime: string;
    totalTime: number;
    totalPages?: number;
  };
}

export interface PageData {
  url: string;
  title?: string;
  description?: string;
  h1?: string[];
  links?: string[];
  internalLinks?: string[];
  externalLinks?: string[];
  images?: ImageData[];
  statusCode?: number;
  contentType?: string;
  loadTime?: number;
  redirectChain?: string[];
  contentLength?: number;
  isIndexable?: boolean;
  issues?: PageIssue[];
}

export interface ImageData {
  src: string;
  alt: string;
}

export interface PageIssue {
  type: string;
  description: string;
  severity: 'critical' | 'important' | 'minor';
}

export interface CrawlSummary {
  totalPages: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  averageLoadTime: number;
  pageTypes: Record<string, number>;
  depthDistribution: Record<number, number>;
}

export interface RequestManager {
  fetch: (url: string) => Promise<{
    html: string;
    statusCode: number;
    contentType?: string;
    redirectChain?: string[];
  }>;
  close: () => Promise<void>;
}
