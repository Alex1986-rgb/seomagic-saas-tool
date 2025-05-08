
/**
 * Shared types for the crawler system
 */

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  respectRobots?: boolean;
  followExternalLinks?: boolean;
  followRedirects?: boolean;
  ignoreRobotsTxt?: boolean;
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

export interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

export interface PageData {
  url: string;
  title?: string;
  description?: string;
  h1?: string[];
  links?: string[];
  images?: string[];
  statusCode?: number;
  contentType?: string;
  loadTime?: number;
  redirectChain?: string[];
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth?: number;
  onProgress?: (progress: TaskProgress) => void;
  followExternalLinks?: boolean;
  respectRobots?: boolean;
}
