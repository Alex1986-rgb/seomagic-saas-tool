
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
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
  ];
  
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
  
  // Get random user agent to avoid blocking
  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
  
  // Improved crawl method that actually crawls websites
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
        
        // Get next batch of URLs to process (up to concurrentRequests)
        const batch = this.queue.splice(0, this.options.concurrentRequests);
        
        // Skip if batch is empty
        if (batch.length === 0) continue;
        
        // Process all URLs in the batch concurrently
        await Promise.all(batch.map(async ({ url: currentUrl, depth }) => {
          // Skip if already visited or too deep
          if (this.visited.has(currentUrl) || depth > this.options.maxDepth) {
            return;
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
            // Random small delay to avoid being blocked
            await new Promise(resolve => setTimeout(resolve, 
              this.options.requestDelay + Math.floor(Math.random() * 500)));
            
            // Fetch page content with retries
            let response = null;
            let retries = 0;
            
            while (!response && retries <= this.options.retryCount) {
              try {
                response = await axios.get(currentUrl, {
                  headers: { 
                    'User-Agent': this.getRandomUserAgent(),
                    'Accept': 'text/html,application/xhtml+xml',
                    'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
                  },
                  timeout: this.options.timeout,
                  validateStatus: status => status < 400
                });
              } catch (error) {
                retries++;
                if (retries <= this.options.retryCount) {
                  await new Promise(resolve => 
                    setTimeout(resolve, this.options.retryDelay * retries));
                } else if (this.debugMode) {
                  console.warn(`Error processing ${currentUrl}:`, error);
                }
              }
            }
            
            if (!response) continue;
            
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
          } catch (error) {
            if (this.debugMode) {
              console.warn(`Error processing ${currentUrl}:`, error);
            }
          }
        }));
      }
      
      if (this.debugMode) {
        console.log(`Crawl completed, found ${discoveredUrls.length} URLs`);
      }
      
      // Make sure to return unique URLs
      const uniqueUrls = Array.from(new Set(discoveredUrls));
      return uniqueUrls;
    } catch (error) {
      console.error('Error during crawl:', error);
      throw error;
    }
  }
  
  // Extract links from HTML with improved accuracy
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const links: string[] = [];
    const seen = new Set<string>();
    
    try {
      const baseUrlObj = new URL(baseUrl);
      
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (!href) return;
        
        try {
          // Create absolute URL
          let url: URL;
          try {
            url = new URL(href, baseUrl);
          } catch (e) {
            return; // Skip invalid URLs
          }
          
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
          
          // Normalize URL for comparison (strip query and hash)
          let normalizedUrl = url.origin + url.pathname;
          if (normalizedUrl.endsWith('/')) {
            normalizedUrl = normalizedUrl.slice(0, -1);
          }
          
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
    } catch (error) {
      console.error('Error extracting links:', error);
    }
    
    return links;
  }
  
  // Find sitemaps with improved detection
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
        headers: { 'User-Agent': this.getRandomUserAgent() },
        timeout: this.options.timeout,
        validateStatus: status => status < 400
      }).catch(() => null);
      
      if (robotsResponse && robotsResponse.status === 200) {
        const robotsText = robotsResponse.data;
        const sitemapMatches = robotsText.match(/Sitemap:\s*(https?:\/\/[^\s]+)/gi);
        
        if (sitemapMatches && sitemapMatches.length > 0) {
          for (const match of sitemapMatches) {
            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
            try {
              const sitemapPath = new URL(sitemapUrl).pathname;
              if (!possibleSitemapPaths.includes(sitemapPath)) {
                possibleSitemapPaths.push(sitemapPath);
              }
            } catch (e) {
              // Skip invalid URLs
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error fetching robots.txt:', error);
    }
    
    // Try all possible sitemap locations with retries
    for (const path of possibleSitemapPaths) {
      try {
        const sitemapUrl = new URL(path, baseUrl).href;
        let response = null;
        let retries = 0;
        
        while (!response && retries <= this.options.retryCount) {
          try {
            response = await axios.get(sitemapUrl, {
              headers: { 
                'User-Agent': this.getRandomUserAgent(),
                'Accept': 'application/xml,text/xml'
              },
              timeout: this.options.timeout,
              validateStatus: status => status < 400
            });
          } catch (error) {
            retries++;
            if (retries <= this.options.retryCount) {
              await new Promise(resolve => 
                setTimeout(resolve, this.options.retryDelay * retries));
            }
          }
        }
        
        if (!response) continue;
        
        try {
          const contentType = response.headers['content-type'] || '';
          if (!contentType.includes('xml')) continue;
          
          const $ = cheerio.load(response.data, { xmlMode: true });
          
          // Check if it's a sitemap index
          const sitemapNodes = $('sitemapindex sitemap loc');
          if (sitemapNodes.length > 0) {
            // Process each sub-sitemap
            for (let i = 0; i < sitemapNodes.length; i++) {
              const subsitemapUrl = $(sitemapNodes[i]).text().trim();
              try {
                // Fetch each sub-sitemap
                const subResponse = await axios.get(subsitemapUrl, {
                  headers: { 'User-Agent': this.getRandomUserAgent() },
                  timeout: this.options.timeout
                }).catch(() => null);
                
                if (subResponse) {
                  const subUrls = this.extractFromSitemapXml(subResponse.data);
                  subUrls.forEach(url => {
                    if (!sitemapUrls.includes(url)) {
                      sitemapUrls.push(url);
                    }
                  });
                }
              } catch (error) {
                console.warn('Error processing sub-sitemap:', error);
              }
            }
          } else {
            // Process regular sitemap
            const urls = this.extractFromSitemapXml(response.data);
            urls.forEach(url => {
              if (!sitemapUrls.includes(url)) {
                sitemapUrls.push(url);
              }
            });
          }
        } catch (error) {
          console.warn(`Error parsing sitemap ${sitemapUrl}:`, error);
        }
      } catch (error) {
        // Skip sitemap location
      }
    }
    
    return sitemapUrls;
  }
  
  // Extract URLs from sitemap XML with improved parsing
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
