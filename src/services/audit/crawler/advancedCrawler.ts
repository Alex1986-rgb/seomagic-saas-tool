
/**
 * Advanced web crawler with enhanced features for deep site analysis
 * Specialized in handling large sites and e-commerce catalogs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from '../linkExtraction';
import { DeepCrawler } from '../deepCrawler';
import JSZip from 'jszip';

// Rate limiting and request management
interface RequestManager {
  delayBetweenRequests: number;
  maxConcurrentRequests: number;
  requestQueue: Array<() => Promise<void>>;
  activeRequests: number;
  pause: () => void;
  resume: () => void;
  addToQueue: (request: () => Promise<void>) => void;
  processQueue: () => void;
}

interface PageData {
  url: string;
  title: string | null;
  headings: {h1: string[], h2: string[]};
  metaDescription: string | null;
  statusCode: number;
  contentType: string | null;
  contentLength: number | null;
  internalLinks: string[];
  externalLinks: string[];
  images: {url: string, alt: string | null}[];
  hasCanonical: boolean;
  canonicalUrl: string | null;
}

export class AdvancedCrawler extends DeepCrawler {
  private pageData: Map<string, PageData> = new Map();
  private requestManager: RequestManager;
  private userAgent: string = 'Mozilla/5.0 (compatible; AdvancedSEOBot/2.0; +https://example.com/bot)';
  private crawlStartTime: number = 0;
  private crawlEndTime: number = 0;
  private excludePatterns: RegExp[] = [
    /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|css|js|pdf|zip|rar|gz|tar|mp4|mp3|webm|ogg|avi|mov|wmv|doc|docx|xls|xlsx|ppt|pptx)$/i,
    /\/?(wp-admin|wp-includes|wp-content\/plugins|cgi-bin|admin|login|logout|sign-in|signup|register|cart|checkout|account|search|sitemaps?)/i
  ];
  private robotsTxtRules: Map<string, boolean> = new Map();
  private hasReadRobotsTxt: boolean = false;

  constructor(url: string, options: any) {
    super(url, options);

    // Initialize request manager
    this.requestManager = {
      delayBetweenRequests: 50,
      maxConcurrentRequests: 8,
      requestQueue: [],
      activeRequests: 0,
      
      pause: () => {
        console.log('Request manager paused');
      },
      
      resume: () => {
        console.log('Request manager resumed');
        this.requestManager.processQueue();
      },
      
      addToQueue: (request: () => Promise<void>) => {
        this.requestManager.requestQueue.push(request);
        this.requestManager.processQueue();
      },
      
      processQueue: () => {
        if (this.requestManager.activeRequests >= this.requestManager.maxConcurrentRequests) {
          return;
        }
        
        if (this.requestManager.requestQueue.length === 0) {
          return;
        }
        
        const request = this.requestManager.requestQueue.shift();
        if (request) {
          this.requestManager.activeRequests++;
          
          setTimeout(() => {
            request().finally(() => {
              this.requestManager.activeRequests--;
              this.requestManager.processQueue();
            });
          }, this.requestManager.delayBetweenRequests);
        }
      }
    };
  }

  async startCrawling() {
    this.crawlStartTime = Date.now();
    console.log(`Starting advanced crawl of ${this.baseUrl}`);
    
    // Try to read robots.txt first
    await this.readRobotsTxt();
    
    // Run the original crawler method
    const result = await super.startCrawling();
    
    this.crawlEndTime = Date.now();
    console.log(`Crawl completed in ${(this.crawlEndTime - this.crawlStartTime) / 1000} seconds`);
    
    return result;
  }
  
  private async readRobotsTxt() {
    if (this.hasReadRobotsTxt) return;
    
    try {
      const robotsUrl = new URL('/robots.txt', this.baseUrl).toString();
      console.log(`Reading robots.txt from ${robotsUrl}`);
      
      const response = await axios.get(robotsUrl, { timeout: 5000 });
      const lines = response.data.split('\n');
      
      let currentUserAgent: string | null = null;
      let isRelevantForUs = false;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;
        
        // Check for User-agent
        if (trimmedLine.toLowerCase().startsWith('user-agent:')) {
          const agent = trimmedLine.substring(11).trim();
          currentUserAgent = agent;
          
          // Check if this section applies to us
          isRelevantForUs = agent === '*' || this.userAgent.includes(agent);
        }
        
        // Process disallow rules if relevant for our user agent
        if (isRelevantForUs && trimmedLine.toLowerCase().startsWith('disallow:')) {
          const path = trimmedLine.substring(9).trim();
          if (path) {
            // Convert simple pattern to regex and store
            const escapedPath = path
              .replace(/\//g, '\\/')
              .replace(/\./g, '\\.')
              .replace(/\*/g, '.*');
            
            const pathPattern = new RegExp(`^${escapedPath}`);
            this.excludePatterns.push(pathPattern);
            this.robotsTxtRules.set(path, true);
          }
        }
      }
      
      this.hasReadRobotsTxt = true;
      console.log(`Processed robots.txt, added ${this.robotsTxtRules.size} exclusion rules`);
      
    } catch (error) {
      console.warn('Could not read robots.txt:', error);
      this.hasReadRobotsTxt = true; // Mark as read anyway to avoid retries
    }
  }
  
  protected async processUrl(url: string, depth: number): Promise<void> {
    // Check if URL should be excluded based on patterns
    for (const pattern of this.excludePatterns) {
      if (pattern.test(url)) {
        return;
      }
    }
    
    try {
      const response = await axios.get(url, { 
        timeout: 15000,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8'
        },
        maxRedirects: 5
      });
      
      const $ = cheerio.load(response.data);
      const links: string[] = [];
      
      // Add extended page data collection
      const pageData: PageData = {
        url,
        title: $('title').text() || null,
        headings: {
          h1: $('h1').map((_, el) => $(el).text().trim()).get(),
          h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        },
        metaDescription: $('meta[name="description"]').attr('content') || null,
        statusCode: response.status,
        contentType: response.headers['content-type'] || null,
        contentLength: parseInt(response.headers['content-length'] || '0') || null,
        internalLinks: [],
        externalLinks: [],
        images: [],
        hasCanonical: $('link[rel="canonical"]').length > 0,
        canonicalUrl: $('link[rel="canonical"]').attr('href') || null
      };

      // Extract all links
      $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            // Normalize URL
            let fullUrl = href;
            if (href.startsWith('/')) {
              fullUrl = new URL(href, this.baseUrl).toString();
            } else if (!href.startsWith('http')) {
              fullUrl = new URL(href, url).toString();
            } else {
              fullUrl = href;
            }
            
            const urlObj = new URL(fullUrl);
            const isExternalLink = urlObj.hostname !== this.domain;
            
            // Categorize as internal or external
            if (isExternalLink) {
              pageData.externalLinks.push(fullUrl);
              
              // Only follow internal links or external if specified
              if (this.options.followExternalLinks) {
                links.push(fullUrl);
              }
            } else {
              // It's an internal link
              pageData.internalLinks.push(fullUrl);
              links.push(fullUrl);
            }
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Extract image information
      $('img').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          try {
            let fullUrl = src;
            if (src.startsWith('/')) {
              fullUrl = new URL(src, this.baseUrl).toString();
            } else if (!src.startsWith('http')) {
              fullUrl = new URL(src, url).toString();
            }
            
            pageData.images.push({
              url: fullUrl,
              alt: $(element).attr('alt') || null
            });
          } catch (e) {
            // Skip invalid URLs
          }
        }
      });
      
      // Store the page data
      this.pageData.set(url, pageData);
      
      // Add links to queue
      for (const link of links) {
        if (!this.visited.has(link)) {
          // Prioritize product links
          const isProductLink = this.productPatterns.some(pattern => pattern.test(link));
          
          if (isProductLink) {
            this.queue.unshift({ url: link, depth: depth + 1 });
          } else {
            this.queue.push({ url: link, depth: depth + 1 });
          }
        }
      }
    } catch (error) {
      console.warn(`Error processing URL ${url}:`, error);
    }
  }
  
  // Export the crawl data to a zip file
  async exportCrawlData(): Promise<Blob> {
    const zip = new JSZip();
    
    // Add sitemap.xml
    const domain = new URL(this.baseUrl).hostname;
    const sitemap = this.generateSitemap();
    zip.file('sitemap.xml', sitemap);
    
    // Add crawl summary report
    const summary = this.generateSummaryReport();
    zip.file('crawl-summary.json', JSON.stringify(summary, null, 2));
    
    // Add detailed page data
    const pagesData = Array.from(this.pageData.values());
    zip.file('pages-data.json', JSON.stringify(pagesData, null, 2));
    
    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  }
  
  // Generate a sitemap based on discovered URLs
  generateSitemap(): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add all URLs to the sitemap
    for (const url of this.visited) {
      // Skip URLs that don't belong to the crawled domain
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== this.domain) continue;
        
        // Skip non-HTML resources
        if (this.excludePatterns.some(pattern => pattern.test(url))) continue;
        
        sitemap += `  <url>\n    <loc>${url}</loc>\n`;
        
        // Add priority based on depth (estimated)
        const pageData = this.pageData.get(url);
        if (pageData) {
          // Higher priority for pages with h1 headings and full content
          if (pageData.headings.h1.length > 0) {
            sitemap += `    <priority>0.8</priority>\n`;
          } else {
            sitemap += `    <priority>0.5</priority>\n`;
          }
        }
        
        sitemap += `  </url>\n`;
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  // Generate a summary report of the crawl
  generateSummaryReport() {
    const totalPages = this.pageData.size;
    const crawlTime = (this.crawlEndTime - this.crawlStartTime) / 1000;
    
    // Calculate statistics
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;
    let totalImages = 0;
    let pagesWithoutTitle = 0;
    let pagesWithoutDescription = 0;
    let pagesWithoutH1 = 0;
    
    for (const page of this.pageData.values()) {
      totalInternalLinks += page.internalLinks.length;
      totalExternalLinks += page.externalLinks.length;
      totalImages += page.images.length;
      
      if (!page.title) pagesWithoutTitle++;
      if (!page.metaDescription) pagesWithoutDescription++;
      if (page.headings.h1.length === 0) pagesWithoutH1++;
    }
    
    return {
      crawlSummary: {
        url: this.baseUrl,
        domain: this.domain,
        startTime: new Date(this.crawlStartTime).toISOString(),
        endTime: new Date(this.crawlEndTime).toISOString(),
        duration: `${crawlTime.toFixed(2)} seconds`,
        totalPages,
        crawlRate: `${(totalPages / crawlTime).toFixed(2)} pages/sec`
      },
      pageStats: {
        totalInternalLinks,
        totalExternalLinks,
        totalImages,
        avgInternalLinksPerPage: (totalInternalLinks / totalPages).toFixed(2),
        avgExternalLinksPerPage: (totalExternalLinks / totalPages).toFixed(2),
        avgImagesPerPage: (totalImages / totalPages).toFixed(2)
      },
      seoIssues: {
        pagesWithoutTitle,
        pagesWithoutDescription,
        pagesWithoutH1,
        percentWithoutTitle: `${((pagesWithoutTitle / totalPages) * 100).toFixed(2)}%`,
        percentWithoutDescription: `${((pagesWithoutDescription / totalPages) * 100).toFixed(2)}%`,
        percentWithoutH1: `${((pagesWithoutH1 / totalPages) * 100).toFixed(2)}%`
      }
    };
  }
  
  // Get all collected page data
  getPageData(): Map<string, PageData> {
    return this.pageData;
  }
  
  // Enhanced site structure analysis
  analyzeSiteStructure() {
    const levels: Record<number, number> = {};
    const pathCounts: Record<string, number> = {};
    
    for (const url of this.visited) {
      try {
        const urlObj = new URL(url);
        
        // Skip external URLs
        if (urlObj.hostname !== this.domain) continue;
        
        // Calculate level (depth) based on path segments
        const pathSegments = urlObj.pathname.split('/').filter(s => s);
        const level = pathSegments.length;
        
        levels[level] = (levels[level] || 0) + 1;
        
        // Count URLs by first directory
        if (pathSegments.length > 0) {
          const firstDir = pathSegments[0];
          pathCounts[firstDir] = (pathCounts[firstDir] || 0) + 1;
        } else {
          // Root pages
          pathCounts['root'] = (pathCounts['root'] || 0) + 1;
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    return {
      levels,
      pathCounts
    };
  }
}
