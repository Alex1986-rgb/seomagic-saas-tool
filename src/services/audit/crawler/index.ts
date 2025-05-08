
/**
 * Crawler module exports
 * This barrel file helps standardize imports and avoid case sensitivity issues
 */

export { DeepCrawler } from './deepCrawlerCore';
export { createRequestManager, type RequestManager } from './requestManager';
export type { 
  CrawlOptions, 
  CrawlResult, 
  TaskProgress, 
  PageData, 
  DeepCrawlerOptions,
  CrawlSummary,
  ImageData,
  PageIssue 
} from './types';

// Re-export using the correct casing to avoid issues
export { RobotsTxtParser } from './robotsTxtParser';
export { UrlProcessor } from './urlProcessor';
export { CrawlQueueManager } from './CrawlQueueManager';
