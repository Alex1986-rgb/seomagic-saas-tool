
/**
 * Response structure for Firecrawl API calls
 */
export interface FirecrawlResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Options for crawling a website
 */
export interface CrawlOptions {
  maxPages: number;
  maxDepth: number;
  includeImages: boolean;
  includeLinks: boolean;
  includeScripts: boolean;
  includeStyles: boolean;
  followExternalLinks: boolean;
  userAgent?: string;
  cookies?: Record<string, string>;
  headers?: Record<string, string>;
}

/**
 * Structure for page data returned from crawl
 */
export interface PageData {
  url: string;
  title: string | null;
  description: string | null;
  h1: string[] | null;
  h2: string[] | null;
  links: {
    internal: string[];
    external: string[];
  };
  statusCode: number;
  contentType: string | null;
  images: Array<{
    url: string;
    alt: string | null;
  }>;
  loadTime: number;
  size: number;
}

/**
 * Result of a crawl operation
 */
export interface CrawlResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  url: string;
  options: CrawlOptions;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
  pages?: PageData[];
  error?: string;
  summary?: {
    pageCount: number;
    uniquePageCount: number;
    totalLinks: number;
    totalImages: number;
    averageLoadTime: number;
    averagePageSize: number;
    statusCodes: Record<string, number>;
  };
}
