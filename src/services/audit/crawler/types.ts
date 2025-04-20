
export interface CrawlResult {
  urls: string[];
  pageCount: number;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    links?: {
      internal: number;
      external: number;
      broken: number;
    };
  };
  brokenLinks?: {url: string; statusCode: number}[];
  redirects?: {from: string; to: string}[];
  errors?: string[];
}

export interface DeepCrawlerOptions {
  maxPages?: number;
  maxDepth?: number;
  includeQuery?: boolean;
  respectRobotsTxt?: boolean;
  userAgent?: string;
  followRedirects?: boolean;
  timeout?: number;
  ignorePatterns?: string[];
  onProgress?: (scanned: number, total: number, currentUrl: string) => void;
}
