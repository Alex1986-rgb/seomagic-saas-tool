
import * as cheerio from 'cheerio';
import axios from 'axios';

export class SitemapExtractor {
  private visitedSitemaps: Set<string> = new Set();
  private maxSitemaps: number;

  constructor(options: { maxSitemaps?: number } = {}) {
    this.maxSitemaps = options.maxSitemaps || 10;
  }

  /**
   * Extract URLs from a sitemap XML string
   */
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    try {
      const $ = cheerio.load(sitemapXml, { xmlMode: true });
      const urls: string[] = [];
      
      // Process regular sitemap URLs
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url && urls.indexOf(url) === -1) {
          urls.push(url);
        }
      });
      
      // Process sitemap index if present
      $('sitemap > loc').each((_, element) => {
        const sitemapUrl = $(element).text().trim();
        if (sitemapUrl) {
          console.log(`Found sitemap reference: ${sitemapUrl}`);
          // We'll handle these references in fetchAndProcessSitemaps
        }
      });
      
      return urls;
    } catch (error) {
      console.error('Error extracting URLs from sitemap:', error);
      return [];
    }
  }

  /**
   * Fetch a sitemap from a URL and extract the URLs
   */
  async fetchSitemap(sitemapUrl: string): Promise<string[]> {
    try {
      const response = await axios.get(sitemapUrl, {
        headers: {
          'User-Agent': 'SeoMagic Sitemap Crawler/1.0',
          'Accept': 'application/xml, text/xml, */*'
        },
        timeout: 10000
      });
      
      return this.extractUrlsFromSitemap(response.data);
    } catch (error) {
      console.error(`Error fetching sitemap from ${sitemapUrl}:`, error);
      return [];
    }
  }

  /**
   * Recursively fetch and process sitemaps, including sitemap indexes
   */
  async fetchAndProcessSitemaps(initialSitemapUrl: string): Promise<string[]> {
    this.visitedSitemaps.clear();
    return this.processSitemap(initialSitemapUrl);
  }

  /**
   * Process a single sitemap, handling both regular sitemaps and sitemap indexes
   */
  private async processSitemap(sitemapUrl: string): Promise<string[]> {
    // Prevent infinite loops and excessive requests
    if (this.visitedSitemaps.has(sitemapUrl) || this.visitedSitemaps.size >= this.maxSitemaps) {
      return [];
    }
    
    this.visitedSitemaps.add(sitemapUrl);
    console.log(`Processing sitemap: ${sitemapUrl}`);
    
    try {
      const response = await axios.get(sitemapUrl, {
        headers: {
          'User-Agent': 'SeoMagic Sitemap Crawler/1.0',
          'Accept': 'application/xml, text/xml, */*'
        },
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data, { xmlMode: true });
      let allUrls: string[] = [];
      
      // Extract URLs from regular sitemap
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url && !allUrls.includes(url)) {
          allUrls.push(url);
        }
      });
      
      // Process nested sitemaps
      const sitemapPromises: Promise<string[]>[] = [];
      $('sitemap > loc').each((_, element) => {
        const nestedSitemapUrl = $(element).text().trim();
        if (nestedSitemapUrl && !this.visitedSitemaps.has(nestedSitemapUrl)) {
          sitemapPromises.push(this.processSitemap(nestedSitemapUrl));
        }
      });
      
      // Wait for all nested sitemaps to be processed
      const nestedResults = await Promise.all(sitemapPromises);
      nestedResults.forEach(urls => {
        urls.forEach(url => {
          if (!allUrls.includes(url)) {
            allUrls.push(url);
          }
        });
      });
      
      return allUrls;
    } catch (error) {
      console.error(`Error processing sitemap ${sitemapUrl}:`, error);
      return [];
    }
  }

  /**
   * Detect and extract sitemap URL from robots.txt
   */
  async extractSitemapFromRobotsTxt(domain: string): Promise<string | null> {
    try {
      const robotsUrl = `${domain.startsWith('http') ? domain : `https://${domain}`}/robots.txt`;
      const response = await axios.get(robotsUrl, { 
        timeout: 5000,
        headers: { 'User-Agent': 'SeoMagic Sitemap Crawler/1.0' } 
      });
      
      const robotsTxt = response.data;
      const sitemapMatches = robotsTxt.match(/Sitemap:\s*([^\s]+)/gi);
      
      if (sitemapMatches && sitemapMatches.length > 0) {
        // Extract URL from the Sitemap: directive
        const sitemapUrl = sitemapMatches[0].replace(/Sitemap:\s*/i, '').trim();
        return sitemapUrl;
      }
      
      return null;
    } catch (error) {
      console.log(`No robots.txt found for ${domain} or error accessing it:`, error);
      return null;
    }
  }
}
