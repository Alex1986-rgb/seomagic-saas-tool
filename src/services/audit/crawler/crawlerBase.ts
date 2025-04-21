
/**
 * Base crawler class with common functionality for all crawler types
 */

import { DeepCrawlerCore } from '../deepCrawlerCore';
import { RobotsTxtParser } from './robotsTxtParser';
import { PageData } from './types';

export class CrawlerBase extends DeepCrawlerCore {
  protected pageData: Map<string, PageData> = new Map();
  protected userAgent: string = 'Mozilla/5.0 (compatible; AdvancedSEOBot/2.0; +https://example.com/bot)';
  protected crawlStartTime: number = 0;
  protected crawlEndTime: number = 0;
  protected excludePatterns: RegExp[] = [
    /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico|css|js|pdf|zip|rar|gz|tar|mp4|mp3|webm|ogg|avi|mov|wmv|doc|docx|xls|xlsx|ppt|pptx)$/i,
    /\/?(wp-admin|wp-includes|wp-content\/plugins|cgi-bin|admin|login|logout|sign-in|signup|register|cart|checkout|account|search|sitemaps?)/i
  ];
  protected robotsTxtParser: RobotsTxtParser;

  constructor(url: string, options: any) {
    super(url, options);
    this.robotsTxtParser = new RobotsTxtParser(this.getBaseUrl(), this.userAgent, this.excludePatterns);
  }

  async startCrawling() {
    this.crawlStartTime = Date.now();
    console.log(`Starting crawl of ${this.getBaseUrl()}`);
    
    // Try to read robots.txt first
    this.excludePatterns = await this.robotsTxtParser.readRobotsTxt();
    
    // Run the original crawler method
    const result = await super.startCrawling();
    
    this.crawlEndTime = Date.now();
    console.log(`Crawl completed in ${(this.crawlEndTime - this.crawlStartTime) / 1000} seconds`);
    
    return result;
  }
  
  // Get all collected page data
  getPageData(): Map<string, PageData> {
    return this.pageData;
  }
}
