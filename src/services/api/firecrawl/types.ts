
export interface CrawlTask {
  id: string;
  url: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  start_time: string;
  completion_time?: string;
  pages_scanned: number;
  estimated_total_pages: number;
  current_url?: string;
  error?: string;
  results?: CrawlResult;
}

export interface CrawlResult {
  urls: string[];
  metadata?: {
    sitemap?: string;
    keywords?: string[];
    links?: {
      internal: number;
      external: number;
      broken: number;
    };
  };
  brokenLinks?: string[];
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth: number;
  onProgress?: (progress: {
    pagesScanned: number;
    currentUrl: string;
    totalUrls: number;
  }) => void;
}
