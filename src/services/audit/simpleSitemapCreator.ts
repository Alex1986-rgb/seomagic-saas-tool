
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapExtractor } from './crawler/sitemapExtractor';
import { generateSitemapXml } from './sitemap/generator';

interface SitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  userAgent?: string;
  // Added compatible parameters
  concurrentRequests?: number;
  retryCount?: number;
  retryDelay?: number;
  timeout?: number;
}

export class SimpleSitemapCreator {
  private options: Required<SitemapCreatorOptions>;
  private sitemapExtractor: SitemapExtractor;
  private baseUrl: string = '';
  private domain: string = '';
  private isCancelled: boolean = false;
  private debugMode: boolean = false;
  private visited = new Set<string>();
  private queue: { url: string; depth: number }[] = [];
  
  constructor(options: SitemapCreatorOptions = {}) {
    this.options = {
      maxPages: options.maxPages || 10000,
      maxDepth: options.maxDepth || 10,
      includeStylesheet: options.includeStylesheet !== undefined ? options.includeStylesheet : true,
      requestDelay: options.requestDelay || 300,
      userAgent: options.userAgent || 'SEO Market Website Scanner Bot',
      concurrentRequests: options.concurrentRequests || 5,
      retryCount: options.retryCount || 2,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 15000
    };
    
    this.sitemapExtractor = new SitemapExtractor();
  }
  
  // Add debugging methods required by other parts of the codebase
  enableDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'} for SimpleSitemapCreator`);
  }

  logCrawlSettings(): void {
    console.log('SimpleSitemapCreator settings:', {
      baseUrl: this.baseUrl,
      domain: this.domain,
      maxPages: this.options.maxPages,
      maxDepth: this.options.maxDepth,
      requestDelay: this.options.requestDelay,
      concurrentRequests: this.options.concurrentRequests,
      retryCount: this.options.retryCount,
      retryDelay: this.options.retryDelay,
      timeout: this.options.timeout,
      debugMode: this.debugMode
    });
  }
  
  // URL and domain management methods
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    try {
      const urlObj = new URL(url);
      this.domain = urlObj.hostname;
    } catch (error) {
      console.error('Invalid URL format:', error);
    }
  }
  
  getBaseUrl(): string {
    return this.baseUrl;
  }
  
  getDomain(): string {
    return this.domain;
  }
  
  // Method to cancel crawling
  cancel(): void {
    this.isCancelled = true;
    console.log('Crawling cancelled by user');
  }
  
  // Improved crawl method that actually crawls websites instead of mocking
  async crawl(
    url: string, 
    progressCallback?: (scanned: number, total: number, currentUrl: string) => void
  ): Promise<string[]> {
    try {
      // Reset state for new crawl
      this.isCancelled = false;
      this.visited.clear();
      this.queue = [];
      
      // Initialize with the base URL
      this.setBaseUrl(url);
      const normalizedUrl = url.endsWith('/') ? url : `${url}/`;
      this.queue.push({ url: normalizedUrl, depth: 0 });
      
      if (this.debugMode) {
        console.log(`Starting real crawl for ${url} with max pages: ${this.options.maxPages}`);
      }
      
      // Try to find sitemap first for faster crawling
      const sitemapUrls = await this.findSitemaps(normalizedUrl);
      if (sitemapUrls.length > 0) {
        console.log(`Found ${sitemapUrls.length} URLs from sitemaps`);
        // Add sitemap URLs to visited so we count them
        sitemapUrls.forEach(sitemapUrl => this.visited.add(sitemapUrl));
        
        // If we already found enough pages, return them
        if (sitemapUrls.length >= this.options.maxPages) {
          return sitemapUrls.slice(0, this.options.maxPages);
        }
      }
      
      // Process the queue until empty or max pages reached
      const discoveredUrls: string[] = [...sitemapUrls];
      let processed = 0;
      
      while (this.queue.length > 0 && !this.isCancelled) {
        // Check if we've reached the maximum number of pages
        if (this.visited.size >= this.options.maxPages) {
          console.log(`Reached maximum pages limit (${this.options.maxPages})`);
          break;
        }
        
        // Get next URL to process
        const { url: currentUrl, depth } = this.queue.shift()!;
        
        // Skip if already visited or too deep
        if (this.visited.has(currentUrl) || depth > this.options.maxDepth) {
          continue;
        }
        
        // Mark as visited
        this.visited.add(currentUrl);
        processed++;
        
        // Report progress
        if (progressCallback && processed % 5 === 0) {
          const estimatedTotal = Math.max(this.visited.size + this.queue.length, sitemapUrls.length);
          progressCallback(this.visited.size, estimatedTotal, currentUrl);
        }
        
        try {
          // Fetch page content
          const response = await axios.get(currentUrl, {
            headers: { 'User-Agent': this.options.userAgent },
            timeout: this.options.timeout,
            validateStatus: status => status < 400
          });
          
          // Skip non-HTML responses
          const contentType = response.headers['content-type'] || '';
          if (!contentType.includes('text/html')) {
            continue;
          }
          
          // Parse HTML and extract links
          const $ = cheerio.load(response.data);
          const links = this.extractLinks($, currentUrl);
          
          // Add found URLs to the discovery list
          if (!discoveredUrls.includes(currentUrl)) {
            discoveredUrls.push(currentUrl);
          }
          
          // Add internal links to queue
          for (const link of links) {
            if (!this.visited.has(link) && !this.queue.some(item => item.url === link)) {
              this.queue.push({ url: link, depth: depth + 1 });
            }
          }
          
          // Add a small delay to avoid overloading servers
          await new Promise(resolve => setTimeout(resolve, this.options.requestDelay));
        } catch (error) {
          if (this.debugMode) {
            console.warn(`Error processing ${currentUrl}:`, error);
          }
        }
      }
      
      if (this.debugMode) {
        console.log(`Crawl completed, found ${discoveredUrls.length} URLs`);
      }
      
      return discoveredUrls;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
  
  // Extract links from HTML
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const links: string[] = [];
    const baseUrlObj = new URL(baseUrl);
    const seen = new Set<string>();
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;
      
      try {
        // Create absolute URL
        const url = new URL(href, baseUrl);
        
        // Skip if it's the same page or has a fragment
        if (url.href === baseUrl || url.href === baseUrl + '#') {
          return;
        }
        
        // Only include URLs from the same domain
        if (url.hostname !== this.domain && 
            url.hostname !== 'www.' + this.domain && 
            this.domain !== 'www.' + url.hostname) {
          return;
        }
        
        // Skip files, admin pages, etc.
        if (
          /\.(jpg|jpeg|png|gif|pdf|zip|rar|doc|xls|csv|xml)$/i.test(url.pathname) ||
          url.pathname.includes('/wp-admin/') ||
          url.pathname.includes('/wp-login.php')
        ) {
          return;
        }
        
        // Normalize URL for comparison
        const normalizedUrl = url.href.endsWith('/') ? url.href.slice(0, -1) : url.href;
        
        // Skip if already seen
        if (seen.has(normalizedUrl)) {
          return;
        }
        
        seen.add(normalizedUrl);
        links.push(normalizedUrl);
      } catch (error) {
        // Skip invalid URLs
      }
    });
    
    return links;
  }
  
  // Find sitemaps
  private async findSitemaps(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    const possibleSitemapPaths = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap-index.xml',
      '/wp-sitemap.xml',
      '/sitemap1.xml',
      '/sitemap_1.xml',
      '/sitemap_product.xml',
      '/sitemap_category.xml'
    ];
    
    // Try to get robots.txt to find sitemaps
    try {
      const robotsUrl = `${baseUrl}/robots.txt`;
      const robotsResponse = await axios.get(robotsUrl, {
        headers: { 'User-Agent': this.options.userAgent },
        timeout: this.options.timeout,
        validateStatus: status => status < 400
      }).catch(() => null);
      
      if (robotsResponse && robotsResponse.status === 200) {
        const robotsText = robotsResponse.data;
        const sitemapMatches = robotsText.match(/Sitemap:\s*(https?:\/\/[^\s]+)/gi);
        
        if (sitemapMatches && sitemapMatches.length > 0) {
          sitemapMatches.forEach(match => {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            possibleSitemapPaths.push(new URL(sitemapUrl).pathname);
          });
        }
      }
    } catch (error) {
      console.warn('Error fetching robots.txt:', error);
    }
    
    // Try all possible sitemap locations
    for (const path of possibleSitemapPaths) {
      try {
        const sitemapUrl = new URL(path, baseUrl).href;
        const response = await axios.get(sitemapUrl, {
          headers: { 'User-Agent': this.options.userAgent },
          timeout: this.options.timeout,
          validateStatus: status => status < 400
        }).catch(() => null);
        
        if (response && response.status === 200) {
          const $ = cheerio.load(response.data, { xmlMode: true });
          
          // Check if it's a sitemap index
          const sitemapNodes = $('sitemapindex sitemap loc');
          if (sitemapNodes.length > 0) {
            // Process each sub-sitemap
            sitemapNodes.each((_, element) => {
              const subsitemapUrl = $(element).text().trim();
              try {
                const urls = this.extractFromSitemapXml(response.data);
                urls.forEach(url => {
                  if (!sitemapUrls.includes(url)) {
                    sitemapUrls.push(url);
                  }
                });
              } catch (error) {
                console.warn('Error processing sub-sitemap:', error);
              }
            });
          } else {
            // Process regular sitemap
            const urls = this.extractFromSitemapXml(response.data);
            urls.forEach(url => {
              if (!sitemapUrls.includes(url)) {
                sitemapUrls.push(url);
              }
            });
          }
        }
      } catch (error) {
        // Skip sitemap location
      }
    }
    
    return sitemapUrls;
  }
  
  // Extract URLs from sitemap XML
  private extractFromSitemapXml(xml: string): string[] {
    const urls: string[] = [];
    try {
      const $ = cheerio.load(xml, { xmlMode: true });
      
      // Extract from regular sitemap
      $('url > loc, url loc').each((_, element) => {
        const url = $(element).text().trim();
        if (url) {
          try {
            const urlObj = new URL(url);
            // Only include URLs from our domain
            if (urlObj.hostname === this.domain || 
                urlObj.hostname === 'www.' + this.domain || 
                this.domain === 'www.' + urlObj.hostname) {
              urls.push(url);
            }
          } catch (error) {
            // Skip invalid URLs
          }
        }
      });
    } catch (error) {
      console.warn('Error parsing sitemap XML:', error);
    }
    
    return urls;
  }
  
  // Generate sitemap XML
  generateSitemap(urls: string[]): string {
    return generateSitemapXml(urls, {
      includeStylesheet: this.options.includeStylesheet
    });
  }
  
  // Extract URLs from existing sitemap
  async extractFromSitemap(sitemapXml: string): Promise<string[]> {
    return this.sitemapExtractor.extractUrlsFromSitemap(sitemapXml);
  }
}
