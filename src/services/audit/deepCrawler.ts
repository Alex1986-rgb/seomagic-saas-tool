
/**
 * Deep crawler service for large e-commerce sites
 * Specialized in handling furniture catalogs and other large product collections
 */

import { DeepCrawlerCore } from './crawler/deepCrawlerCore';
import { DeepCrawlerOptions as AuditDeepCrawlerOptions } from './crawler/types';
import { DeepCrawlerOptions as FirecrawlDeepCrawlerOptions } from '../api/firecrawl/types';

export class DeepCrawler extends DeepCrawlerCore {
  constructor(url: string, options: AuditDeepCrawlerOptions) {
    // Create a compatible options object that satisfies the FirecrawlDeepCrawlerOptions interface
    const compatibleOptions: FirecrawlDeepCrawlerOptions = {
      maxPages: options.maxPages || 1000, // Default value if not provided
      maxDepth: options.maxDepth || 5,
      onProgress: options.onProgress 
        ? (progress) => {
            // Adapt the new progress object format to the old callback format
            options.onProgress(
              progress.pagesScanned,
              progress.totalUrls,
              progress.currentUrl
            );
          }
        : undefined
    };
    
    super(url, compatibleOptions);
  }
}
