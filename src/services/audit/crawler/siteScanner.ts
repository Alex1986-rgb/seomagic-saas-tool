
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapExtractor } from './sitemapExtractor';

interface ScanOptions {
  maxDepth?: number;
  maxPages?: number;
  respectRobotsTxt?: boolean;
  followExternalLinks?: boolean;
  crawlDelay?: number;
  userAgent?: string;
  timeout?: number;
  onProgress?: (scanned: number, total: number, currentUrl: string) => void;
}

interface ScanResult {
  urls: string[];
  pageCount: number;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  brokenLinks?: { url: string; statusCode: number }[];
  redirects?: { from: string; to: string }[];
}

export class SiteScanner {
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  private domain: string;
  private baseUrl: string;
  private options: ScanOptions;
  private brokenLinks: { url: string; statusCode: number }[] = [];
  private redirects: { from: string; to: string }[] = [];
  private sitemapExtractor: SitemapExtractor;
  private abortController: AbortController | null = null;
  private isPaused = false;
  private isAborted = false;
  
  constructor(url: string, options: ScanOptions = {}) {
    // Set default options
    this.options = {
      maxDepth: 5,
      maxPages: 10000,
      respectRobotsTxt: true,
      followExternalLinks: false,
      crawlDelay: 200,
      userAgent: 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://example.com/bot)',
      timeout: 15000,
      ...options
    };
    
    // Normalize URL
    this.baseUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // Extract domain
    try {
      const urlObj = new URL(this.baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      this.domain = url;
    }
    
    this.sitemapExtractor = new SitemapExtractor();
    this.abortController = new AbortController();
  }
  
  /**
   * Start the scanning process
   */
  async scan(): Promise<ScanResult> {
    this.visited.clear();
    this.queue = [{ url: this.baseUrl, depth: 0 }];
    this.brokenLinks = [];
    this.redirects = [];
    this.isPaused = false;
    this.isAborted = false;
    
    // Try to find sitemap first
    try {
      await this.processSitemap();
    } catch (error) {
      console.warn('Error processing sitemap:', error);
      // Continue with regular crawling
    }
    
    // Process the queue
    while (this.queue.length > 0 && this.visited.size < this.options.maxPages! && !this.isAborted) {
      if (this.isPaused) {
        await new Promise(resolve => setTimeout(resolve, 500));
        continue;
      }
      
      const { url, depth } = this.queue.shift()!;
      
      if (this.visited.has(url) || depth > this.options.maxDepth!) {
        continue;
      }
      
      // Add to visited before processing to avoid duplicate processing
      this.visited.add(url);
      
      try {
        await this.processUrl(url, depth);
        
        // Report progress
        if (this.options.onProgress) {
          this.options.onProgress(
            this.visited.size,
            Math.max(this.visited.size + this.queue.length, this.visited.size * 2),
            url
          );
        }
        
        // Respect crawl delay
        if (this.options.crawlDelay && this.options.crawlDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, this.options.crawlDelay));
        }
      } catch (error) {
        console.warn(`Error processing URL ${url}:`, error);
        
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status >= 300 && error.response.status < 400 && error.response.headers.location) {
            // Handle redirect
            this.redirects.push({
              from: url,
              to: new URL(error.response.headers.location, url).toString()
            });
          } else if (error.response.status >= 400) {
            // Handle broken link
            this.brokenLinks.push({
              url,
              statusCode: error.response.status
            });
          }
        }
      }
    }
    
    // Save urls to localStorage for future use
    localStorage.setItem(`crawl_urls_${this.domain}`, JSON.stringify(Array.from(this.visited)));
    
    return {
      urls: Array.from(this.visited),
      pageCount: this.visited.size,
      brokenLinks: this.brokenLinks,
      redirects: this.redirects
    };
  }
  
  /**
   * Process a URL and extract links
   */
  private async processUrl(url: string, depth: number): Promise<void> {
    if (!this.shouldCrawl(url)) {
      return;
    }
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': this.options.userAgent!,
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: this.options.timeout!,
      validateStatus: status => status < 500, // Accept 404s but not server errors
      signal: this.abortController?.signal
    });
    
    // Skip non-HTML responses
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return;
    }
    
    const $ = cheerio.load(response.data);
    
    // Extract links
    const links = new Set<string>();
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const absoluteUrl = this.resolveUrl(href, url);
        if (absoluteUrl && this.shouldQueue(absoluteUrl)) {
          links.add(absoluteUrl);
        }
      }
    });
    
    // Add links to queue
    for (const link of links) {
      if (!this.visited.has(link)) {
        this.queue.push({ url: link, depth: depth + 1 });
      }
    }
  }
  
  /**
   * Try to process sitemap.xml to get initial URLs
   */
  private async processSitemap(): Promise<void> {
    const possibleSitemapLocations = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/sitemap/`,
      `${this.baseUrl}/sitemaps/sitemap.xml`
    ];
    
    try {
      // Also check robots.txt for sitemap
      const robotsTxtUrl = `${this.baseUrl}/robots.txt`;
      const robotsResponse = await axios.get(robotsTxtUrl, { 
        timeout: 5000,
        signal: this.abortController?.signal
      });
      
      if (robotsResponse.status === 200) {
        const sitemapMatches = robotsResponse.data.match(/Sitemap:\s*(.+)/gi);
        if (sitemapMatches) {
          for (const match of sitemapMatches) {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            possibleSitemapLocations.unshift(sitemapUrl);
          }
        }
      }
    } catch (error) {
      // Ignore errors from robots.txt
    }
    
    // Try each possible sitemap location
    for (const sitemapUrl of possibleSitemapLocations) {
      try {
        const response = await axios.get(sitemapUrl, { 
          timeout: 10000,
          signal: this.abortController?.signal
        });
        
        if (response.status === 200 && response.data) {
          const urls = await this.sitemapExtractor.extractUrlsFromSitemap(response.data);
          
          console.log(`Found ${urls.length} URLs in sitemap ${sitemapUrl}`);
          
          // Add URLs from sitemap to our queue with a low depth to prioritize them
          for (const url of urls) {
            if (this.shouldQueue(url) && !this.visited.has(url)) {
              this.queue.push({ url, depth: 0 });
            }
          }
          
          // If we found a valid sitemap, no need to check others
          if (urls.length > 0) {
            break;
          }
        }
      } catch (error) {
        console.warn(`Error loading sitemap from ${sitemapUrl}:`, error);
        // Continue to the next possible location
      }
    }
  }
  
  /**
   * Resolve a URL to an absolute URL
   */
  private resolveUrl(href: string, base: string): string | null {
    try {
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return null;
      }
      
      return new URL(href, base).toString();
    } catch (error) {
      return null;
    }
  }
  
  /**
   * Check if a URL should be crawled
   */
  private shouldCrawl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Only crawl same domain unless followExternalLinks is true
      if (!this.options.followExternalLinks && parsedUrl.hostname !== this.domain) {
        return false;
      }
      
      // Skip common file extensions that are not HTML
      const ext = parsedUrl.pathname.split('.').pop()?.toLowerCase();
      if (ext && ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'tar', 'gz', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Check if a URL should be added to the queue
   */
  private shouldQueue(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      
      // Only queue URLs from the same domain unless followExternalLinks is true
      if (!this.options.followExternalLinks && parsedUrl.hostname !== this.domain) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Pause the crawler
   */
  pause(): void {
    this.isPaused = true;
  }
  
  /**
   * Resume the crawler
   */
  resume(): void {
    this.isPaused = false;
  }
  
  /**
   * Abort the crawler
   */
  abort(): void {
    this.isAborted = true;
    this.abortController?.abort();
    this.abortController = new AbortController();
  }
  
  /**
   * Get crawler stats
   */
  getStats(): { visited: number; queued: number; broken: number; redirects: number } {
    return {
      visited: this.visited.size,
      queued: this.queue.length,
      broken: this.brokenLinks.length,
      redirects: this.redirects.length
    };
  }
}
