export interface PageData {
  url: string;
  statusCode: number;
  title: string;
  description: string;
  contentType: string;
  contentLength: number;
  loadTime: number;
  links: string[];
  h1: string[];
  images: { src: string; alt: string }[];
  internalLinks?: string[];
  externalLinks?: string[];
  isIndexable: boolean;
  issues: string[];
}

export interface CrawlResult {
  urls: string[];
  visitedCount?: number;
  pageCount?: number;
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

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  ignoreRobotsTxt?: boolean;
  urlFilter?: (url: string) => boolean;
  respectNofollow?: boolean;
  requestDelay?: number;
  obeyRateLimit?: boolean;
  followRedirects?: boolean;
  onProgress?: (progress: TaskProgress) => void;
}

export interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth: number;
  onProgress?: (progress: TaskProgress) => void;
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
  fetch: (url: string, options?: any) => Promise<any>;
  configure: (options: any) => void;
  pause?: () => void; // Add optional pause method
}
