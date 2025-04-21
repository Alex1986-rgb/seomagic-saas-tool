
export interface DeepCrawlerOptions {
  maxPages?: number;
  maxDepth?: number;
  onProgress?: (progress: { pagesScanned: number; currentUrl: string; totalUrls: number; }) => void;
}

export interface CrawlResult {
  urls: string[];
  pageCount?: number;
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
  url?: string;
  title: string;
  description: string;
  h1s?: string[];
  headings: {h1: string[]; h2: string[]; h3: string[]; h4: string[]; h5: string[]; h6: string[];};
  wordCount?: number;
  links?: {internal: string[]; external: string[];};
  internalLinks?: string[];
  externalLinks?: string[];
  images: {src: string; alt: string; title?: string; url?: string;}[];
  statusCode: number;
  contentType: string;
  loadTime?: number;
  contentLength?: number | null;
  hasCanonical?: boolean;
  canonicalUrl?: string | null;
  metaDescription?: string; // Adding this for backward compatibility
}

export type ExtractorFunction = (html: string, url: string) => string[];

export interface CrawlSummary {
  crawlSummary: {
    url: string;
    domain: string;
    startTime: string;
    endTime: string;
    duration: string;
    totalPages: number;
    crawlRate: string;
  };
  pageStats: {
    totalInternalLinks: number;
    totalExternalLinks: number;
    totalImages: number;
    avgInternalLinksPerPage: string;
    avgExternalLinksPerPage: string;
    avgImagesPerPage: string;
  };
  seoIssues: {
    pagesWithoutTitle: number;
    pagesWithoutDescription: number;
    pagesWithoutH1: number;
    percentWithoutTitle: string;
    percentWithoutDescription: string;
    percentWithoutH1: string;
  };
}

export interface RequestManager {
  configure(options: any): void;
  pause(): void;
  resume(): void;
  processCrawlQueue(
    queue: { url: string; depth: number }[],
    visited: Set<string>,
    options: DeepCrawlerOptions,
    processFunction: (url: string, depth: number) => Promise<void>
  ): Promise<CrawlResult>;
}

export interface SiteStructureAnalysis {
  pages: number;
  depth: number;
  breadth: number;
  sections: { [key: string]: number };
  orphanedPages: string[];
}
