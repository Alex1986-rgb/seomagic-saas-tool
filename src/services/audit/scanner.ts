
// This file likely doesn't exist yet, so we'll create it with the correct method name
import { SimpleSitemapCreator } from './simpleSitemapCreator';

export class WebsiteScanner {
  private sitemapCreator: SimpleSitemapCreator;
  
  constructor() {
    this.sitemapCreator = new SimpleSitemapCreator({
      maxPages: 10000,
      maxDepth: 10,
      includeStylesheet: true
    });
  }
  
  async scanWebsite(url: string, progressCallback?: (scanned: number, total: number, currentUrl: string) => void) {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      // Scan website and get URLs
      const urls = await this.sitemapCreator.crawl(normalizedUrl, progressCallback);
      
      // Generate sitemap XML
      const sitemap = this.sitemapCreator.generateSitemap(urls);
      
      return {
        success: true,
        urls,
        sitemap,
        pageCount: urls.length
      };
    } catch (error) {
      console.error('Error scanning website:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        urls: [],
        pageCount: 0
      };
    }
  }
}

export const websiteScanner = new WebsiteScanner();
