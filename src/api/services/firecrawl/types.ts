
/**
 * Interface for crawl task data
 */
export interface CrawlTask {
  id: string;
  url: string;
  status: string;
  pages_scanned: number;
  estimated_total_pages: number;
  progress?: number;
  error?: string;
  isLargeSite?: boolean;
  start_time: Date;
}

export interface SitemapData {
  id: string;
  urls: string[];
}

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  respectRobotsTxt?: boolean;
  followExternalLinks?: boolean;
}
