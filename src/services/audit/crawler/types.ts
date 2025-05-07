
export interface PageData {
  url: string;
  title: string;
  description: string;
  h1: string[];
  links: string[];
  images: {
    src: string;
    alt: string;
  }[];
  statusCode: number;
  contentType: string;
  loadTime: number;
  contentLength: number;
  isIndexable: boolean;
  issues: {
    type: string;
    description: string;
    severity: 'critical' | 'important' | 'opportunity';
  }[];
}

export interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth: number;
  onProgress?: (scanned: number, total: number, currentUrl: string) => void;
}

export interface CrawlResult {
  urls: string[];
  visitedCount: number;
  metadata: {
    totalRequests: number;
    successRequests: number;
    failedRequests: number;
    domain?: string;
    startTime: string;
    endTime: string;
    totalTime: number;
  };
}
