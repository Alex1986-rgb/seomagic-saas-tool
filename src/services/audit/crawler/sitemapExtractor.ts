
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
  
  /**
   * Try to locate sitemap files on a website
   */
  async findSitemaps(baseUrl: string): Promise<string[]> {
    const possibleLocations = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap/',
      '/sitemaps/',
      '/sitemap/sitemap.xml',
      '/sitemap.php',
      '/sitemap.txt',
    ];
    
    const sitemapUrls: string[] = [];
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    for (const location of possibleLocations) {
      try {
        const url = normalizedBaseUrl + location;
        const response = await axios.get(url, { timeout: 5000 });
        if (response.status === 200) {
          sitemapUrls.push(url);
        }
      } catch (error) {
        // Ignore errors, just try next location
      }
    }
    
    // Also try to find sitemap URL in robots.txt
    try {
      const robotsUrl = normalizedBaseUrl + '/robots.txt';
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      
      if (response.status === 200) {
        const robotsTxt = response.data;
        const sitemapMatches = robotsTxt.match(/Sitemap:\s*(.+)/gi);
        
        if (sitemapMatches) {
          for (const match of sitemapMatches) {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            if (sitemapUrl) {
              sitemapUrls.push(sitemapUrl);
            }
          }
        }
      }
    } catch (error) {
      // Ignore errors from robots.txt
    }
    
    return sitemapUrls;
  }
}
