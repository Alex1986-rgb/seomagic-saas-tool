
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from '../linkExtraction';

interface SiteScannerOptions {
  maxPages?: number;
  maxDepth?: number;
  timeout?: number;
  followExternalLinks?: boolean;
  respectRobotsTxt?: boolean;
  onProgress?: (pagesScanned: number, totalEstimated: number, currentUrl: string) => void;
  crawlDelay?: number;
}

interface ScanResult {
  urls: string[];
  pageDetails: Map<string, PageDetail>;
}

interface PageDetail {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  imageCount: number;
  wordCount: number;
  statusCode: number | null;
  loadTime: number | null;
}

export class SiteScanner {
  private baseUrl: string;
  private domain: string;
  private options: SiteScannerOptions;
  private visited = new Set<string>();
  private queue: Array<{ url: string; depth: number }> = [];
  private pageDetails = new Map<string, PageDetail>();
  private robotsTxtRules: string[] = [];
  private hasLoadedRobotsTxt = false;

  constructor(baseUrl: string, options: SiteScannerOptions = {}) {
    this.baseUrl = baseUrl;
    
    try {
      const urlObj = new URL(baseUrl);
      this.domain = urlObj.hostname;
    } catch (error) {
      this.domain = baseUrl;
    }
    
    this.options = {
      maxPages: 100,
      maxDepth: 3,
      timeout: 10000,
      followExternalLinks: false,
      respectRobotsTxt: true,
      crawlDelay: 500,
      ...options
    };
    
    // Initialize the queue with the base URL
    this.queue.push({ url: baseUrl, depth: 0 });
  }
  
  async scan(): Promise<ScanResult> {
    console.log(`Starting scan of ${this.baseUrl} with max ${this.options.maxPages} pages`);
    
    if (this.options.respectRobotsTxt) {
      await this.loadRobotsTxt();
    }
    
    // Process the queue until it's empty or we reach the max pages
    while (this.queue.length > 0 && this.visited.size < (this.options.maxPages || 100)) {
      // Get the next URL from the queue
      const { url, depth } = this.queue.shift()!;
      
      // Skip if we've already visited this URL
      if (this.visited.has(url)) continue;
      
      // Skip if this URL is disallowed by robots.txt
      if (this.options.respectRobotsTxt && this.isDisallowedByRobotsTxt(url)) {
        console.log(`Skipping ${url} - disallowed by robots.txt`);
        continue;
      }
      
      // Process the URL
      try {
        await this.processUrl(url, depth);
        
        // Report progress
        if (this.options.onProgress) {
          this.options.onProgress(
            this.visited.size,
            Math.min(this.visited.size + this.queue.length, this.options.maxPages || 100),
            url
          );
        }
        
        // Add a small delay to be respectful to the server
        if (this.options.crawlDelay) {
          await new Promise(resolve => setTimeout(resolve, this.options.crawlDelay));
        }
      } catch (error) {
        console.warn(`Error processing URL ${url}:`, error);
      }
    }
    
    console.log(`Scan completed. Visited ${this.visited.size} pages.`);
    
    // Return the scan results
    return {
      urls: Array.from(this.visited),
      pageDetails: this.pageDetails
    };
  }
  
  private async processUrl(url: string, depth: number): Promise<void> {
    // Skip if we've reached the max depth
    if (depth > (this.options.maxDepth || 3)) return;
    
    // Mark this URL as visited
    this.visited.add(url);
    urlCache.add(url);
    
    try {
      const startTime = performance.now();
      const response = await axios.get(url, {
        timeout: this.options.timeout,
        validateStatus: (status) => status < 500, // Accept all status codes < 500 to process redirects
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://example.com/bot)',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        allowAbsoluteUrls: true, // Allow absolute URLs in Node.js
      });
      
      const loadTime = performance.now() - startTime;
      const statusCode = response.status;
      
      // Skip non-HTML content
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        return;
      }
      
      // Parse the HTML
      const $ = cheerio.load(response.data);
      
      // Extract page details
      const title = $('title').text().trim() || null;
      const metaDescription = $('meta[name="description"]').attr('content') || null;
      const h1Count = $('h1').length;
      const imageCount = $('img').length;
      const text = $('body').text();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      // Store page details
      this.pageDetails.set(url, {
        url,
        title,
        metaDescription,
        h1Count,
        imageCount,
        wordCount,
        statusCode,
        loadTime
      });
      
      // Extract links
      const links = this.extractLinks($, url);
      
      // Add new links to the queue
      for (const link of links) {
        if (!this.visited.has(link) && !this.queue.some(item => item.url === link)) {
          this.queue.push({ url: link, depth: depth + 1 });
        }
      }
    } catch (error) {
      console.error(`Error processing URL ${url}:`, error);
      
      // Store error page details
      this.pageDetails.set(url, {
        url,
        title: null,
        metaDescription: null,
        h1Count: 0,
        imageCount: 0,
        wordCount: 0,
        statusCode: error.response?.status || null,
        loadTime: null
      });
    }
  }
  
  private extractLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
    const links: string[] = [];
    
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;
      
      try {
        // Resolve relative URLs
        const absoluteUrl = new URL(href, baseUrl).href;
        const urlObj = new URL(absoluteUrl);
        
        // Skip fragment identifiers and query params if the base URL is the same
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.hostname === baseUrlObj.hostname && 
            urlObj.pathname === baseUrlObj.pathname && 
            (urlObj.hash || urlObj.search)) {
          return;
        }
        
        // Skip mailto, tel, javascript, etc.
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          return;
        }
        
        // Skip external domains unless configured to follow them
        if (!this.options.followExternalLinks && urlObj.hostname !== this.domain) {
          return;
        }
        
        // Skip common file extensions
        const skipExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
        if (skipExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext))) {
          return;
        }
        
        links.push(absoluteUrl);
      } catch (error) {
        // Invalid URL, skip
      }
    });
    
    return links;
  }
  
  private async loadRobotsTxt(): Promise<void> {
    if (this.hasLoadedRobotsTxt) return;
    
    try {
      const robotsTxtUrl = `${this.baseUrl.replace(/\/$/, '')}/robots.txt`;
      const response = await axios.get(robotsTxtUrl, { 
        timeout: this.options.timeout,
        validateStatus: () => true
      });
      
      if (response.status === 200) {
        const robotsTxt = response.data;
        const lines = robotsTxt.split('\n');
        
        let isUserAgentRelevant = false;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('User-agent:')) {
            const userAgent = trimmedLine.substring('User-agent:'.length).trim();
            isUserAgentRelevant = userAgent === '*' || userAgent.toLowerCase().includes('bot');
          } else if (isUserAgentRelevant && trimmedLine.startsWith('Disallow:')) {
            const disallowPath = trimmedLine.substring('Disallow:'.length).trim();
            if (disallowPath) {
              this.robotsTxtRules.push(disallowPath);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Error loading robots.txt:', error);
    }
    
    this.hasLoadedRobotsTxt = true;
  }
  
  private isDisallowedByRobotsTxt(url: string): boolean {
    if (this.robotsTxtRules.length === 0) return false;
    
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      for (const rule of this.robotsTxtRules) {
        if (rule === '/') {
          // Disallow all
          return true;
        }
        
        if (rule.endsWith('*')) {
          // Wildcard match
          const prefix = rule.slice(0, -1);
          if (path.startsWith(prefix)) {
            return true;
          }
        } else {
          // Exact match
          if (path === rule || path.startsWith(`${rule}/`)) {
            return true;
          }
        }
      }
    } catch (error) {
      return false;
    }
    
    return false;
  }
}
