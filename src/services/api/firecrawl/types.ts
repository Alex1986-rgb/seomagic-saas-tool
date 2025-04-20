
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
  // Добавляем недостающие свойства
  progress?: number;
  isLargeSite?: boolean;
  domain?: string;
  urls?: string[];
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
  brokenLinks?: string[] | { url: string; statusCode: number; }[];
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

// Добавим массив для хранения задач сканирования, который используется в crawlSimulator.ts
export const crawlTasks: CrawlTask[] = [];
