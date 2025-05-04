
import * as cheerio from 'cheerio';
import axios from 'axios';

export class SitemapExtractor {
  /**
   * Extracts URLs from a sitemap XML string
   */
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    try {
      const $ = cheerio.load(sitemapXml, { xmlMode: true });
      const urls: string[] = [];
      
      // Extract URLs from regular sitemap
      $('url > loc').each((_, element) => {
        const url = $(element).text();
        if (url) {
          urls.push(url);
        }
      });
      
      // Check if this is a sitemap index
      const sitemapRefs: string[] = [];
      $('sitemap > loc').each((_, element) => {
        const sitemapUrl = $(element).text();
        if (sitemapUrl) {
          sitemapRefs.push(sitemapUrl);
        }
      });
      
      // If this is a sitemap index, fetch each referenced sitemap
      if (sitemapRefs.length > 0 && urls.length === 0) {
        console.log(`Found sitemap index with ${sitemapRefs.length} sitemaps`);
        
        // Process only the first 5 sitemaps to avoid excessive requests
        const subSitemaps = sitemapRefs.slice(0, 5);
        
        for (const sitemapUrl of subSitemaps) {
          try {
            console.log(`Fetching sub-sitemap: ${sitemapUrl}`);
            const response = await axios.get(sitemapUrl, { timeout: 10000 });
            const subUrls = await this.extractUrlsFromSitemap(response.data);
            urls.push(...subUrls);
          } catch (error) {
            console.error(`Error fetching sub-sitemap ${sitemapUrl}:`, error);
          }
        }
      }
      
      return urls;
    } catch (error) {
      console.error('Error extracting URLs from sitemap:', error);
      return [];
    }
  }
  
  /**
   * Attempts to find and extract sitemap URL from robots.txt
   */
  async findSitemapInRobotsTxt(domain: string): Promise<string | null> {
    try {
      const robotsUrl = `https://${domain}/robots.txt`;
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      const robotsTxt = response.data;
      
      // Look for sitemap directive
      const lines = robotsTxt.split('\n');
      for (const line of lines) {
        if (line.toLowerCase().startsWith('sitemap:')) {
          const sitemapUrl = line.split(':', 2)[1].trim();
          return sitemapUrl;
        }
      }
      
      return null;
    } catch (error) {
      console.log(`No robots.txt found at ${domain} or error fetching it:`, error);
      return null;
    }
  }
}
