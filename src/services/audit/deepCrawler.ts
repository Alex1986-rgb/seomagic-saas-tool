
/**
 * Deep crawler service for large e-commerce sites
 * Specialized in handling furniture catalogs and other large product collections
 */

import { DeepCrawlerCore } from './crawler/deepCrawlerCore';
import { DeepCrawlerOptions as AuditDeepCrawlerOptions, TaskProgress } from './crawler/types';

export class DeepCrawler extends DeepCrawlerCore {
  constructor(url: string, options: AuditDeepCrawlerOptions) {
    // Create a compatible options object
    const compatibleOptions: AuditDeepCrawlerOptions = {
      maxPages: options.maxPages || 500000, // Увеличиваем лимит по умолчанию до 500,000 страниц
      maxDepth: options.maxDepth || 10,     // Увеличиваем глубину поиска
      onProgress: options.onProgress 
        ? (progress: TaskProgress) => {
            // Convert the new progress object format to match the callback's expected parameters
            if (typeof options.onProgress === 'function') {
              options.onProgress(progress);
            }
          }
        : undefined
    };
    
    super(url, compatibleOptions);
  }
}
