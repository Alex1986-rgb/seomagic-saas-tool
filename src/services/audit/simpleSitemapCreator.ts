
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SimpleSitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  timeout?: number;
}

export class SimpleSitemapCreator {
  private options: SimpleSitemapCreatorOptions;
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private domain: string = '';
  
  constructor(options: SimpleSitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 1000,
      maxDepth: options.maxDepth || 5,
      includeStylesheet: options.includeStylesheet || false,
      timeout: options.timeout || 10000
    };
  }
  
  async crawl(url: string, progressCallback?: (scanned: number, total: number, currentUrl: string) => void): Promise<string[]> {
    this.visited.clear();
    this.queue = [];
    
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      this.domain = new URL(normalizedUrl).hostname;
      
      this.queue.push({ url: normalizedUrl, depth: 0 });
      
      while (this.queue.length > 0 && this.visited.size < this.options.maxPages!) {
        const { url: currentUrl, depth } = this.queue.shift()!;
        
        if (this.visited.has(currentUrl) || depth > this.options.maxDepth!) {
          continue;
        }
        
        this.visited.add(currentUrl);
        
        if (progressCallback) {
          progressCallback(this.visited.size, this.visited.size + this.queue.length, currentUrl);
        }
        
        try {
          const response = await axios.get(currentUrl, {
            timeout: this.options.timeout,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; SimpleSitemapCreator/1.0)'
            }
          });
          
          if (response.status === 200 && response.headers['content-type']?.includes('text/html')) {
            const $ = cheerio.load(response.data);
            
            $('a').each((_, element) => {
              const href = $(element).attr('href');
              if (!href) return;
              
              try {
                const absoluteUrl = new URL(href, currentUrl).href;
                const absoluteUrlObj = new URL(absoluteUrl);
                
                // Only process URLs from the same domain
                if (absoluteUrlObj.hostname === this.domain) {
                  // Skip certain file types and patterns
                  const shouldSkip = /\.(jpg|jpeg|png|gif|css|js|ico|svg|pdf|zip|rar|doc|docx|xls|xlsx)$/i.test(absoluteUrl) ||
                                    absoluteUrl.includes('#') ||
                                    absoluteUrl.includes('?') ||
                                    absoluteUrl === currentUrl;
                                    
                  if (!shouldSkip && !this.visited.has(absoluteUrl)) {
                    this.queue.push({ url: absoluteUrl, depth: depth + 1 });
                  }
                }
              } catch (e) {
                // Skip invalid URLs
              }
            });
          }
        } catch (error) {
          console.warn(`Error fetching ${currentUrl}:`, error);
        }
      }
      
      return Array.from(this.visited);
    } catch (error) {
      console.error('Error in crawl:', error);
      return [];
    }
  }
  
  generateSitemap(urls: string[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    if (this.options.includeStylesheet) {
      xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
    }
    
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }
}
