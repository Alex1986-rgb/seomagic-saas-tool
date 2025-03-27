
/**
 * Catalog page detection for crawler
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export class CatalogProcessor {
  constructor(
    private domain: string,
    private baseUrl: string
  ) {}

  async findCatalogPages(
    visited: Set<string>,
    queue: { url: string; depth: number }[],
    productPatterns: RegExp[]
  ): Promise<void> {
    console.log('Looking for catalog pages...');
    try {
      const response = await axios.get(this.baseUrl, { timeout: 8000 });
      const $ = cheerio.load(response.data);
      
      // Find all links to potential catalog pages
      const catalogLinks: string[] = [];
      
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = `${this.baseUrl}${href}`;
            } else if (!href.startsWith('http')) {
              fullUrl = `${this.baseUrl}/${href}`;
            }
            
            // Check if it matches product/catalog patterns
            const isProductPattern = productPatterns.some(pattern => pattern.test(fullUrl));
            
            // Check if it's an external link
            const isExternalLink = (() => {
              try {
                const urlObj = new URL(fullUrl);
                return urlObj.hostname !== this.domain;
              } catch (e) {
                return false;
              }
            })();
            
            if (isProductPattern && !isExternalLink) {
              catalogLinks.push(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Add catalog links to the front of the queue for priority processing
      catalogLinks.forEach(url => {
        if (!visited.has(url)) {
          queue.unshift({ url, depth: 1 });
        }
      });
      
      console.log(`Found ${catalogLinks.length} potential catalog links`);
    } catch (error) {
      console.error('Error finding catalog pages:', error);
    }
  }
}
