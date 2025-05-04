
import { WebCrawler, PageContent } from './crawler/WebCrawler';
import { SeoAuditor, SeoAuditResult } from './seoAuditor/SeoAuditor';
import { SiteGenerator } from './siteGenerator/SiteGenerator';
import { FtpPublisher } from './publisher/FtpPublisher';

export interface AuditOptions {
  maxPages?: number;
  maxDepth?: number;
  includeAssets?: boolean;
  followExternalLinks?: boolean;
}

export interface PublishOptions {
  host: string;
  port?: number;
  username: string;
  password: string;
  path?: string;
}

export interface AuditHistory {
  id: string;
  url: string;
  timestamp: string;
  score: number;
  pagesScanned: number;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
    minor: number;
  };
}

export class SeoAuditController {
  private crawler: WebCrawler;
  private auditor: SeoAuditor;
  private siteGenerator: SiteGenerator;
  private auditHistory: AuditHistory[] = [];
  
  constructor() {
    this.crawler = new WebCrawler();
    this.auditor = new SeoAuditor();
    this.siteGenerator = new SiteGenerator();
    this.loadAuditHistory();
  }
  
  /**
   * Perform a full SEO audit on a website
   */
  async auditWebsite(
    url: string, 
    options: AuditOptions = {}, 
    onProgress?: (progress: any) => void
  ): Promise<SeoAuditResult> {
    try {
      // Create crawler with options and progress callback
      this.crawler = new WebCrawler({
        maxPages: options.maxPages || 1000,
        maxDepth: options.maxDepth || 5,
        includeAssets: options.includeAssets || false,
        followExternalLinks: options.followExternalLinks || false
      }, onProgress);
      
      // Crawl website
      const pages = await this.crawler.crawlWebsite(url);
      
      // Perform SEO audit
      const domain = this.extractDomain(url);
      const auditResult = await this.auditor.auditWebsite(domain, pages);
      
      // Save audit to history
      this.saveAuditToHistory({
        id: this.generateId(),
        url: url,
        timestamp: new Date().toISOString(),
        score: auditResult.score,
        pagesScanned: pages.size,
        issues: {
          critical: auditResult.issues.critical.length,
          important: auditResult.issues.important.length,
          opportunities: auditResult.issues.opportunities.length,
          minor: auditResult.issues.minor.length
        }
      });
      
      return auditResult;
    } catch (error) {
      console.error('Error auditing website:', error);
      throw error;
    }
  }
  
  /**
   * Generate optimized site ZIP
   */
  async generateOptimizedSite(
    url: string,
    pages: Map<string, PageContent>,
    optimizedHtml: Map<string, string>
  ): Promise<Blob> {
    try {
      const domain = this.extractDomain(url);
      return await this.siteGenerator.generateOptimizedSite(domain, pages, optimizedHtml);
    } catch (error) {
      console.error('Error generating optimized site:', error);
      throw error;
    }
  }
  
  /**
   * Download optimized site as ZIP
   */
  async downloadOptimizedSite(
    url: string,
    pages: Map<string, PageContent>,
    optimizedHtml: Map<string, string>
  ): Promise<void> {
    try {
      const domain = this.extractDomain(url);
      await this.siteGenerator.downloadOptimizedSite(domain, pages, optimizedHtml);
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      throw error;
    }
  }
  
  /**
   * Publish optimized site to FTP/WebDAV
   */
  async publishOptimizedSite(
    url: string,
    pages: Map<string, PageContent>,
    optimizedHtml: Map<string, string>,
    publishOptions: PublishOptions
  ): Promise<boolean> {
    try {
      const domain = this.extractDomain(url);
      const zip = await this.siteGenerator.generateOptimizedSite(domain, pages, optimizedHtml);
      
      // Publish site
      const ftpPublisher = new FtpPublisher();
      return await ftpPublisher.publishSite(zip, publishOptions);
    } catch (error) {
      console.error('Error publishing optimized site:', error);
      throw error;
    }
  }
  
  /**
   * Get audit history
   */
  getAuditHistory(): AuditHistory[] {
    return this.auditHistory;
  }
  
  /**
   * Clear audit history
   */
  clearAuditHistory(): void {
    this.auditHistory = [];
    this.saveAuditHistory();
  }
  
  private extractDomain(url: string): string {
    try {
      let formattedUrl = url;
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      const urlObj = new URL(formattedUrl);
      return urlObj.hostname;
    } catch (error) {
      console.error('Error extracting domain:', error);
      return url;
    }
  }
  
  private generateId(): string {
    return 'audit_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  private saveAuditToHistory(audit: AuditHistory): void {
    // Add to beginning of history
    this.auditHistory.unshift(audit);
    
    // Limit history to last 50 audits
    if (this.auditHistory.length > 50) {
      this.auditHistory = this.auditHistory.slice(0, 50);
    }
    
    // Save to local storage
    this.saveAuditHistory();
  }
  
  private saveAuditHistory(): void {
    try {
      localStorage.setItem('seoAuditHistory', JSON.stringify(this.auditHistory));
    } catch (error) {
      console.error('Error saving audit history:', error);
    }
  }
  
  private loadAuditHistory(): void {
    try {
      const history = localStorage.getItem('seoAuditHistory');
      if (history) {
        this.auditHistory = JSON.parse(history);
      }
    } catch (error) {
      console.error('Error loading audit history:', error);
    }
  }
}
