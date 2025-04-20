
import { SiteScanner } from './crawler/siteScanner';
import { SitemapExtractor } from './crawler/sitemapExtractor';

export interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  timeout?: number;
  followRedirects?: boolean;
}

export class SimpleSitemapCreator {
  private options: SimpleSitemapCreatorOptions;
  private sitemapExtractor: SitemapExtractor;
  
  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: 10000,
      maxDepth: 5,
      includeStylesheet: true,
      timeout: 15000,
      followRedirects: true,
      ...options
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  /**
   * Crawl a website and return all URLs
   */
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      // First, try to find and parse sitemaps
      const sitemapUrls = await this.sitemapExtractor.findSitemaps(normalizedUrl);
      let allUrls: string[] = [];
      
      for (const sitemapUrl of sitemapUrls) {
        try {
          console.log(`Found sitemap at ${sitemapUrl}, extracting URLs...`);
          
          // Fetch the sitemap
          const response = await fetch(sitemapUrl);
          if (response.ok) {
            const sitemapXml = await response.text();
            const extractedUrls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
            
            if (extractedUrls.length > 0) {
              console.log(`Extracted ${extractedUrls.length} URLs from sitemap ${sitemapUrl}`);
              allUrls = [...allUrls, ...extractedUrls];
              
              // Report progress if we have a callback
              if (progressCallback) {
                progressCallback(
                  extractedUrls.length,
                  extractedUrls.length,
                  "Extracted URLs from sitemap"
                );
              }
            }
          }
        } catch (error) {
          console.warn(`Error processing sitemap ${sitemapUrl}:`, error);
        }
      }
      
      // If we found URLs from sitemaps, return them
      if (allUrls.length > 0) {
        return [...new Set(allUrls)]; // Remove duplicates
      }
      
      // If no sitemaps found or they were empty, fall back to crawler
      console.log('No valid sitemaps found or they were empty, falling back to crawling...');
      
      const scanner = new SiteScanner(normalizedUrl, {
        maxPages: this.options.maxPages,
        maxDepth: this.options.maxDepth,
        timeout: this.options.timeout,
        onProgress: progressCallback
      });
      
      const result = await scanner.scan();
      return result.urls;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
  
  /**
   * Generate sitemap XML from a list of URLs
   */
  generateSitemapXml(urls: string[]): string {
    const now = new Date().toISOString().substring(0, 10);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(url)}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }
  
  /**
   * Escape special characters for XML
   */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
