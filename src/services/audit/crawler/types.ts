
export interface DeepCrawlerOptions {
  maxPages?: number;
  maxDepth?: number;
  onProgress?: (progress: { pagesScanned: number; currentUrl: string; totalUrls: number; }) => void;
}

export interface CrawlResult {
  urls: string[];
  metadata?: {
    startTime: string;
    endTime: string;
    totalTime: number;
    totalPages: number;
    domain: string;
    sitemap?: string;
  };
  brokenLinks?: string[];
}

export interface PageData {
  title: string;
  description: string;
  h1s: string[];
  headings: {h1: string[]; h2: string[]; h3: string[]; h4: string[]; h5: string[]; h6: string[];};
  wordCount: number;
  links: {internal: string[]; external: string[];};
  images: {src: string; alt: string; title?: string;}[];
  statusCode: number;
  contentType: string;
  loadTime: number;
}

export type ExtractorFunction = (html: string, url: string) => string[];
