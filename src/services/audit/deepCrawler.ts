
/**
 * Deep crawler service for large e-commerce sites
 * Specialized in handling furniture catalogs and other large product collections
 */

import { DeepCrawler } from './crawler/deepCrawlerCore';

// Define TaskProgress interface here to avoid import issues
interface TaskProgress {
  pagesScanned: number;
  currentUrl: string;
  totalUrls: number;
}

// Define DeepCrawlerOptions interface here
interface DeepCrawlerOptions {
  maxPages: number;
  maxDepth?: number;
  onProgress?: (progress: TaskProgress) => void;
}

export class ExtendedDeepCrawler extends DeepCrawler {
  constructor(url: string, options: DeepCrawlerOptions) {
    // Create a compatible options object
    const compatibleOptions: DeepCrawlerOptions = {
      maxPages: options.maxPages || 500000, // Increase default limit to 500,000 pages
      maxDepth: options.maxDepth || 10,     // Increase search depth
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

export default ExtendedDeepCrawler;
