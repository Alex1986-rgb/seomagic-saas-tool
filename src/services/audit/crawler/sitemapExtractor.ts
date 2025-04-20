
import axios from 'axios';
import * as cheerio from 'cheerio';

export class SitemapExtractor {
  /**
   * Extract URLs from a sitemap XML string
   */
  async extractUrlsFromSitemap(sitemapXml: string): Promise<string[]> {
    const urls: string[] = [];
    
    try {
      const $ = cheerio.load(sitemapXml, { xmlMode: true });
      
      // Extract URLs from standard sitemap format
      $('url > loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url) urls.push(url);
      });
      
      // Also check for sitemap index format
      if (urls.length === 0) {
        const sitemapLocations: string[] = [];
        
        $('sitemap > loc').each((_, element) => {
          const sitemapUrl = $(element).text().trim();
          if (sitemapUrl) sitemapLocations.push(sitemapUrl);
        });
        
        // If this is a sitemap index, fetch each linked sitemap
        for (const sitemapUrl of sitemapLocations) {
          try {
            const response = await axios.get(sitemapUrl, { timeout: 10000 });
            const innerUrls = await this.extractUrlsFromSitemap(response.data);
            urls.push(...innerUrls);
          } catch (error) {
            console.warn(`Error fetching sitemap ${sitemapUrl}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing sitemap XML:', error);
    }
    
    return urls;
  }

  /**
   * Find all potential sitemap URLs for a domain
   */
  async findSitemaps(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // Common sitemap locations
    const commonLocations = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap_index.xml.gz',
      '/sitemap-index.xml',
      '/sitemap.php',
      '/sitemap.txt',
      '/sitemap-news.xml',
      '/sitemap-product.xml',
      '/sitemap-category.xml',
      '/sitemap-page.xml',
      '/sitemap-post.xml',
      '/sitemap-image.xml',
      '/wp-sitemap.xml'
    ];
    
    // Check each location
    for (const location of commonLocations) {
      const sitemapUrl = `${normalizedBaseUrl}${location}`;
      try {
        const response = await axios.head(sitemapUrl, { 
          timeout: 5000,
          validateStatus: (status) => status === 200
        });
        
        if (response.status === 200) {
          sitemapUrls.push(sitemapUrl);
        }
      } catch (error) {
        // Ignore errors - just means the sitemap doesn't exist at this location
      }
    }
    
    // If no sitemaps found at common locations, check robots.txt
    if (sitemapUrls.length === 0) {
      try {
        const robotsTxtUrl = `${normalizedBaseUrl}/robots.txt`;
        const response = await axios.get(robotsTxtUrl, { timeout: 5000 });
        
        if (response.status === 200) {
          const robotsTxt = response.data;
          const lines = robotsTxt.split('\n');
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.toLowerCase().startsWith('sitemap:')) {
              const sitemapUrl = trimmedLine.substring('sitemap:'.length).trim();
              if (sitemapUrl) {
                sitemapUrls.push(sitemapUrl);
              }
            }
          }
        }
      } catch (error) {
        console.warn('Error checking robots.txt for sitemaps:', error);
      }
    }
    
    return sitemapUrls;
  }
}
