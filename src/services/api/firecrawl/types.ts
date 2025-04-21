
export interface CrawlTask {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  start_time: string;
  completion_time?: string;
  pages_scanned: number;
  estimated_total_pages?: number;
  current_url?: string;
  progress: number;
  error?: string;
  results?: CrawlResult;
  urls?: string[];
  sitemap?: string;
  isLargeSite?: boolean;
}

export interface CrawlResult {
  urls?: string[];
  pageCount?: number;
  brokenLinks?: Array<{url: string; statusCode: number}> | string[];
  metadata?: {
    keywords?: string[];
    sitemap?: string;
    links?: {
      internal: number;
      external: number;
      broken: number;
    };
  };
  analysisResults?: {
    optimizationScore: number;
    estimatedOptimizationTime: string;
    improvementAreas: string[];
  };
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  timeout?: number;
  followRedirects?: boolean;
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  forceTargetDomain?: boolean;
  onProgress?: (progress: TaskProgress) => void;
}

export interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

// Определяем интерфейс для массива задач сканирования (для хранения и работы в памяти)
export const crawlTasks: CrawlTask[] = [];
