
/**
 * Shared types for the crawler system
 */

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

export interface PageData {
  url: string;
  title: string | null;
  headings: {h1: string[], h2: string[]};
  metaDescription: string | null;
  statusCode: number;
  contentType: string | null;
  contentLength: number | null;
  internalLinks: string[];
  externalLinks: string[];
  images: {url: string, alt: string | null}[];
  hasCanonical: boolean;
  canonicalUrl: string | null;
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

export interface SiteStructureAnalysis {
  levels: Record<number, number>;
  pathCounts: Record<string, number>;
}
