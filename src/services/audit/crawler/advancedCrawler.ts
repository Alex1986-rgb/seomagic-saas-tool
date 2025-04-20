
/**
 * Advanced web crawler with enhanced features for deep site analysis
 * Specialized in handling large sites and e-commerce catalogs
 */

import { saveAs } from 'file-saver';
import { createRequestManager } from './requestManager';
import { ReportGenerator } from './reportGenerator';
import { SiteAnalyzer } from './siteAnalyzer';
import { CrawlerBase } from './crawlerBase';
import { PageProcessor } from './pageProcessor';

export class AdvancedCrawler extends CrawlerBase {
  private requestManager = createRequestManager();
  private pageProcessor: PageProcessor;
  // Add the missing productPatterns property
  protected productPatterns: RegExp[] = [
    /\/product\//i, 
    /\/products\//i, 
    /\/item\//i, 
    /\/catalog\//i, 
    /\/collection\//i
  ];

  constructor(url: string, options: any) {
    super(url, options);
    this.pageProcessor = new PageProcessor(this.domain, this.baseUrl, this.userAgent);
  }

  protected async processUrl(url: string, depth: number): Promise<void> {
    // Check if URL should be excluded based on patterns
    for (const pattern of this.excludePatterns) {
      if (pattern.test(url)) {
        return;
      }
    }
    
    const { pageData, links } = await this.pageProcessor.processPage(url);
    
    if (pageData) {
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
  
  // Enhanced site structure analysis
  analyzeSiteStructure() {
    return SiteAnalyzer.analyzeSiteStructure(this.visited, this.domain);
  }
}
