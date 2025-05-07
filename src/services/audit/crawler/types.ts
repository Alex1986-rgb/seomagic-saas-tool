
export interface PageData {
  url: string;
  title: string;
  description: string;
  h1: string[];
  links: string[];
  internalLinks?: string[]; // Added for report generator
  externalLinks?: string[]; // Added for report generator
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
  onProgress?: (progress: TaskProgress) => void; // Fixed callback signature
}

export interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

export interface CrawlResult {
  urls: string[];
  visitedCount?: number;
  pageCount?: number;
  metadata: {
    totalRequests?: number;
    successRequests?: number;
    failedRequests?: number;
    domain?: string;
    startTime: string;
    endTime: string;
    totalTime: number;
    totalPages?: number; // Added for queue managers
    // Added for compatibility with firecrawl type
    keywords?: string[];
    sitemap?: string;
    links?: {
      internal: number;
      external: number;
      broken: number;
    };
  };
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
  configure: (options: any) => void;
  pause: () => void;
  resume: () => void;
  processCrawlQueue: (
    queue: { url: string; depth: number }[],
    visited: Set<string>,
    options: any,
    processFunction: (url: string, depth: number) => Promise<void>
  ) => Promise<CrawlResult>;
}

export interface SiteStructureAnalysis {
  totalPages: number;
  depth: {
    [depth: string]: number;
  };
  pageTypes: {
    [type: string]: number;
  };
  linkDistribution: {
    internal: number;
    external: number;
  };
}
