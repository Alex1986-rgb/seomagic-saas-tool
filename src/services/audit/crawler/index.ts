
/**
 * Crawler module exports
 * This barrel file helps standardize imports and avoid case sensitivity issues
 */

export { DeepCrawler } from './deepCrawlerCore';
export { createRequestManager, type RequestManager } from './requestManager';
export type { CrawlOptions, CrawlResult, TaskProgress, PageData, DeepCrawlerOptions } from './types';

// Re-export other needed classes with consistent naming
export { RobotsTxtParser } from './RobotsTxtParser';
export { UrlProcessor } from './UrlProcessor';
export { CrawlQueueManager } from './CrawlQueueManager';
