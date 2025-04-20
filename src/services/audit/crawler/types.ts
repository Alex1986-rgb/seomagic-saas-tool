
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
  maxPages: number; // Making this required to match the Firecrawl type
  maxDepth?: number;
  includeQuery?: boolean;
  respectRobotsTxt?: boolean;
  userAgent?: string;
  followRedirects?: boolean;
  timeout?: number;
  ignorePatterns?: string[];
  onProgress?: (scanned: number, total: number, currentUrl: string) => void;
}

export interface PageData {
  url: string;
  title: string | null;
  headings: {
    h1: string[];
    h2: string[];
  };
  metaDescription: string | null;
  statusCode: number;
  contentType: string | null;
  contentLength: number | null;
  internalLinks: string[];
  externalLinks: string[];
  images: Array<{
    url: string;
    alt: string | null;
  }>;
  hasCanonical: boolean;
  canonicalUrl: string | null;
  html?: string;
}

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
  delayBetweenRequests: number;
  maxConcurrentRequests: number;
  requestQueue: Array<() => Promise<void>>;
  activeRequests: number;
  pause: () => void;
  resume: () => void;
  addToQueue: (request: () => Promise<void>) => void;
  processQueue: () => void;
}

export interface SiteStructureAnalysis {
  levels: Record<number, number>;
  pathCounts: Record<string, number>;
}
