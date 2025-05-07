
import { UrlProcessor } from '../audit/crawler/UrlProcessor';
import { CrawlQueueManager } from '../audit/crawler/CrawlQueueManager';
import { RobotsTxtParser } from '../audit/crawler/RobotsTxtParser';
import { SitemapExtractor } from '../audit/crawler/sitemapExtractor';
import { TaskProgress } from '../audit/crawler/types';

/**
 * Service for handling website scanning operations
 */
export class ScanningService {
  private urlProcessor: UrlProcessor;
  private queueManager: CrawlQueueManager;
  private robotsParser: RobotsTxtParser;
  private sitemapExtractor: SitemapExtractor;
  
  constructor() {
    this.queueManager = new CrawlQueueManager();
    this.robotsParser = new RobotsTxtParser();
    this.sitemapExtractor = new SitemapExtractor({ maxSitemaps: 50 });
  }

  /**
   * Initialize scanning for a new URL
   * 
   * @param url URL to scan
   */
  initializeScan(url: string) {
    this.urlProcessor = new UrlProcessor(url);
    
    this.queueManager.configure({
      maxConcurrentRequests: 10,
      retryAttempts: 3,
      requestTimeout: 15000
    });
  }

  /**
   * Extract sitemap URLs
   * 
   * @param url Base URL
   * @returns Array of URLs from sitemap
   */
  async extractSitemapUrls(url: string): Promise<string[]> {
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const sitemapUrl = `${formattedUrl}/sitemap.xml`.replace(/([^:]\/)\/+/g, "$1");
      
      console.log('Attempting to extract URLs from sitemap:', sitemapUrl);
      return await this.sitemapExtractor.fetchAndProcessSitemaps(sitemapUrl);
    } catch (error) {
      console.error('Error extracting sitemap URLs:', error);
      return [];
    }
  }

  /**
   * Extract sitemap from robots.txt
   * 
   * @param url Base URL
   * @returns Array of sitemap URLs
   */
  async extractSitemapFromRobots(url: string): Promise<string[]> {
    try {
      return await this.robotsParser.parse(url);
    } catch (error) {
      console.error('Error parsing robots.txt:', error);
      return [];
    }
  }

  /**
   * Cancel ongoing scan
   */
  cancelScan() {
    this.queueManager.pause();
  }

  /**
   * Process a scan with progress callback
   * 
   * @param url URL to scan
   * @param options Scan options
   * @param onProgress Progress callback
   * @returns Scan result
   */
  async processScan(
    url: string, 
    options: { 
      maxPages: number; 
      maxDepth: number;
    }, 
    onProgress?: (progress: TaskProgress) => void
  ) {
    // Initialize scan
    this.initializeScan(url);
    
    // Start scan process
    const queue: { url: string; depth: number }[] = [];
    const visited = new Set<string>();
    
    // Add initial URL to queue
    queue.push({ url, depth: 0 });
    
    // Configure queue manager
    this.queueManager.configure({
      maxConcurrentRequests: 10,
      retryAttempts: 3,
      requestTimeout: 15000,
      onProgress: onProgress
    });
    
    try {
      // Process queue
      return await this.queueManager.processQueue(queue, visited, options);
    } catch (error) {
      console.error('Error processing scan:', error);
      throw error;
    }
  }
}

export const scanningService = new ScanningService();
