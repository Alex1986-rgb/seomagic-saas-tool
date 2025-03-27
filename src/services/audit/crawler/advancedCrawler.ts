
/**
 * Advanced web crawler with enhanced features for deep site analysis
 * Specialized in handling large sites and e-commerce catalogs
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlCache } from '../linkExtraction';
import { DeepCrawler } from '../deepCrawler';
import { saveAs } from 'file-saver';
import { PageData } from './types';
import { createRequestManager } from './requestManager';
import { ReportGenerator } from './reportGenerator';
import { SiteAnalyzer } from './siteAnalyzer';
import { RobotsTxtParser } from './robotsTxtParser';

export class AdvancedCrawler extends DeepCrawler {
  private pageData: Map<string, PageData> = new Map();
  private requestManager = createRequestManager();
  private userAgent: string = 'Mozilla/5.0 (compatible; AdvancedSEOBot/2.0; +https://example.com/bot)';
  private crawlStartTime: number = 0;
  private crawlEndTime: number = 0;
  private excludePatterns: RegExp[] = [
    /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|css|js|pdf|zip|rar|gz|tar|mp4|mp3|webm|ogg|avi|mov|wmv|doc|docx|xls|xlsx|ppt|pptx)$/i,
    /\/?(wp-admin|wp-includes|wp-content\/plugins|cgi-bin|admin|login|logout|sign-in|signup|register|cart|checkout|account|search|sitemaps?)/i
  ];
  private robotsTxtParser: RobotsTxtParser;

  constructor(url: string, options: any) {
    super(url, options);
    this.robotsTxtParser = new RobotsTxtParser(this.baseUrl, this.userAgent, this.excludePatterns);
  }

  async startCrawling() {
    this.crawlStartTime = Date.now();
    console.log(`Starting advanced crawl of ${this.baseUrl}`);
    
    // Try to read robots.txt first
    this.excludePatterns = await this.robotsTxtParser.readRobotsTxt();
    
    // Run the original crawler method
    const result = await super.startCrawling();
    
    this.crawlEndTime = Date.now();
    console.log(`Crawl completed in ${(this.crawlEndTime - this.crawlStartTime) / 1000} seconds`);
    
    return result;
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
    const sitemap = this.generateSitemap();
    const summary = this.generateSummaryReport();
    const pagesData = Array.from(this.pageData.values());
    
    return ReportGenerator.createCrawlDataZip(this.domain, sitemap, summary, pagesData);
  }
  
  // Generate a sitemap based on discovered URLs
  generateSitemap(): string {
    return ReportGenerator.generateSitemap(this.domain, this.visited, this.excludePatterns);
  }
  
  // Generate a summary report of the crawl
  generateSummaryReport() {
    return ReportGenerator.generateSummaryReport(
      this.pageData, 
      this.domain, 
      this.baseUrl, 
      this.crawlStartTime, 
      this.crawlEndTime
    );
  }
  
  // Get all collected page data
  getPageData(): Map<string, PageData> {
    return this.pageData;
  }
  
  // Enhanced site structure analysis
  analyzeSiteStructure() {
    return SiteAnalyzer.analyzeSiteStructure(this.visited, this.domain);
  }
}
