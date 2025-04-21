
import axios from 'axios';
import * as cheerio from 'cheerio';
import { SitemapExtractor } from './crawler/sitemapExtractor';
import { generateSitemapXml } from './sitemap/generator';
import { normalizeUrl, isUrlFromSameDomain, getDomainFromUrl } from './crawler/urlUtils';

interface SitemapCreatorOptions {
  maxPages?: number;
  maxDepth?: number;
  includeStylesheet?: boolean;
  requestDelay?: number;
  userAgent?: string;
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
  
  // Debugging methods
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
  
  // Find sitemaps for a domain
  private async findSitemaps(url: string): Promise<string[]> {
    try {
      const commonSitemapPaths = [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemap/',
        '/sitemap/sitemap.xml',
        '/wp-sitemap.xml',
      ];
      
      // Extract domain for constructing sitemap URLs
      const baseUrl = new URL(url).origin;
      
      // Try common sitemap locations
      for (const path of commonSitemapPaths) {
        const sitemapUrl = `${baseUrl}${path}`;
        try {
          const response = await axios.get(sitemapUrl, {
            headers: { 'User-Agent': this.getRandomUserAgent() },
            timeout: 5000
          });
          
          if (response.status === 200 && 
              (response.headers['content-type']?.includes('xml') || 
               response.data?.includes('<urlset') || 
               response.data?.includes('<sitemapindex'))) {
            
            // Process the sitemap with SitemapExtractor
            const urls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapUrl);
            if (urls.length > 0) {
              if (this.debugMode) {
                console.log(`Found sitemap at ${sitemapUrl} with ${urls.length} URLs`);
              }
              return urls;
            }
          }
        } catch (error) {
          // Continue to next potential sitemap location
          if (this.debugMode) {
            console.log(`No sitemap found at ${sitemapUrl}`);
          }
        }
      }
      
      // Try to find sitemap URL in robots.txt
      try {
        const robotsTxtUrl = `${baseUrl}/robots.txt`;
        const response = await axios.get(robotsTxtUrl, {
          headers: { 'User-Agent': this.getRandomUserAgent() },
          timeout: 5000
        });
        
        if (response.status === 200) {
          const robotsTxt = response.data;
          const sitemapRegex = /Sitemap:\s*([^\s]+)/gi;
          let match;
          let sitemapUrls = [];
          
          while ((match = sitemapRegex.exec(robotsTxt)) !== null) {
            sitemapUrls.push(match[1]);
          }
          
          // Process each sitemap found in robots.txt
          if (sitemapUrls.length > 0) {
            let allUrls = [];
            
            for (const sitemapUrl of sitemapUrls) {
              try {
                const urls = await this.sitemapExtractor.extractUrlsFromSitemap(sitemapUrl);
                allUrls = [...allUrls, ...urls];
              } catch (error) {
                // Continue to next sitemap
              }
            }
            
            if (allUrls.length > 0) {
              if (this.debugMode) {
                console.log(`Found ${allUrls.length} URLs from sitemaps in robots.txt`);
              }
              return allUrls;
            }
          }
        }
      } catch (error) {
        // Robots.txt not found or couldn't be parsed
      }
    } catch (error) {
      console.error('Error finding sitemaps:', error);
    }
    
    return []; // No sitemaps found
  }
  
  // Extract links from HTML content
  private extractLinks(html: string, baseUrl: string): string[] {
    const links: string[] = [];
    const $ = cheerio.load(html);
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          // Resolve relative URLs
          const resolvedUrl = new URL(href, baseUrl).href;
          links.push(resolvedUrl);
        } catch (error) {
          // Skip invalid URLs
        }
      }
    });
    
    return links;
  }
  
  // Process a single URL with retry logic
  private async processSingleUrl(url: string, currentDepth: number): Promise<string[]> {
    if (this.isCancelled) {
      return [];
    }
    
    // Skip URLs from different domains
    if (!isUrlFromSameDomain(url, this.domain)) {
      return [];
    }
    
    const foundLinks: string[] = [];
    let retryCount = 0;
    
    while (retryCount <= this.options.retryCount) {
      try {
        // Add random delay to avoid being blocked
        const randomDelay = Math.floor(Math.random() * 300) + this.options.requestDelay;
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': this.getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
          },
          timeout: this.options.timeout,
          maxRedirects: 5
        });
        
        // Only process HTML content
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('text/html')) {
          break;
        }
        
        // Extract links from the page
        const links = this.extractLinks(response.data, url);
        
        for (const link of links) {
          try {
            // Filter links from the same domain
            if (isUrlFromSameDomain(link, this.domain)) {
              const normalizedLink = normalizeUrl(link);
              foundLinks.push(normalizedLink);
              
              // Add to queue for deeper crawling if needed
              if (currentDepth < this.options.maxDepth && !this.visited.has(normalizedLink)) {
                this.queue.push({ url: normalizedLink, depth: currentDepth + 1 });
              }
            }
          } catch (error) {
            // Skip invalid links
          }
        }
        
        break; // Successful, exit retry loop
      } catch (error) {
        retryCount++;
        
        if (retryCount <= this.options.retryCount) {
          // Exponential backoff with jitter
          const backoff = this.options.retryDelay * Math.pow(2, retryCount - 1) + Math.random() * 500;
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }
    
    return foundLinks;
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
      const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      this.queue.push({ url: normalizedUrl, depth: 0 });
      
      if (this.debugMode) {
        console.log(`Starting crawl for ${url} with max pages: ${this.options.maxPages}`);
      }
      
      // Try to find sitemap first for faster crawling
      const sitemapUrls = await this.findSitemaps(normalizedUrl);
      if (sitemapUrls.length > 0) {
        console.log(`Found ${sitemapUrls.length} URLs from sitemap(s)`);
        
        // Add sitemap URLs to the visited set and return them if we have enough
        sitemapUrls.forEach(sitemapUrl => this.visited.add(sitemapUrl));
        
        if (sitemapUrls.length >= this.options.maxPages) {
          console.log(`Returning ${this.options.maxPages} URLs from sitemap(s)`);
          if (progressCallback) {
            progressCallback(this.options.maxPages, this.options.maxPages, normalizedUrl);
          }
          return sitemapUrls.slice(0, this.options.maxPages);
        }
        
        // If sitemap doesn't have enough URLs, continue with crawling
        console.log(`Sitemap has ${sitemapUrls.length} URLs, continuing with crawling to find more...`);
      }
      
      // Start the crawling process
      let processedCount = 0;
      this.visited.add(normalizedUrl);
      
      // Calculate a sensible estimate of total pages
      let estimatedTotal = this.options.maxPages;
      if (sitemapUrls.length > 0) {
        estimatedTotal = Math.min(sitemapUrls.length * 2, this.options.maxPages);
      }
      
      // Report initial progress
      if (progressCallback) {
        progressCallback(processedCount, estimatedTotal, normalizedUrl);
      }
      
      // Process the queue using a BFS approach with concurrency limit
      while (this.queue.length > 0 && this.visited.size < this.options.maxPages && !this.isCancelled) {
        // Take a batch of URLs to process concurrently
        const batch = this.queue.splice(0, this.options.concurrentRequests);
        const promises = batch.map(({ url: queuedUrl, depth }) => {
          return this.processSingleUrl(queuedUrl, depth);
        });
        
        // Wait for all URLs in the batch to be processed
        const batchResults = await Promise.all(promises);
        
        // Process the results
        for (let i = 0; i < batch.length; i++) {
          const currentUrl = batch[i].url;
          const foundLinks = batchResults[i];
          
          processedCount++;
          
          // Add new links to visited set
          for (const link of foundLinks) {
            if (!this.visited.has(link) && this.visited.size < this.options.maxPages) {
              this.visited.add(link);
            }
          }
          
          // Update progress
          if (progressCallback && processedCount % 5 === 0) {
            progressCallback(this.visited.size, estimatedTotal, currentUrl);
            
            // Adjust the estimated total as we discover more pages
            if (this.visited.size > estimatedTotal * 0.8) {
              estimatedTotal = Math.min(this.visited.size * 1.25, this.options.maxPages);
            }
          }
        }
      }
      
      // Final progress report
      if (progressCallback) {
        progressCallback(this.visited.size, this.visited.size, "Завершено");
      }
      
      console.log(`Crawling completed. Found ${this.visited.size} URLs.`);
      return Array.from(this.visited);
    } catch (error) {
      console.error('Error during crawl:', error);
      return Array.from(this.visited);
    }
  }
}
