
/**
 * Sitemap extraction functionality
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

export class SitemapExtractor {
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    const urls: string[] = [];
    const $ = cheerio.load(sitemapXml, { xmlMode: true });
    
    // Extract URLs from the sitemap
    $('url > loc').each((_, element) => {
      const url = $(element).text().trim();
      if (url) {
        urls.push(url);
      }
    });
    
    // Fixed: Collect nested sitemap URLs first, then process them sequentially
    const nestedSitemapUrls: string[] = [];
    $('sitemap > loc').each((_, element) => {
      const sitemapUrl = $(element).text().trim();
      if (sitemapUrl) {
        nestedSitemapUrls.push(sitemapUrl);
      }
    });
    
    // Process nested sitemaps sequentially
    for (const sitemapUrl of nestedSitemapUrls) {
      try {
        const response = await axios.get(sitemapUrl, { timeout: 8000 });
        const nestedUrls = await this.extractUrlsFromSitemap(response.data);
        urls.push(...nestedUrls);
      } catch (error) {
        console.error(`Error processing nested sitemap ${sitemapUrl}:`, error);
      }
    }
    
    return urls;
  }
}
