
import { crawlService, CrawlOptions, CrawlProgress, CrawlResult } from '@/services/crawlService';
import { positionTrackingService } from '@/services/positionTrackingService';
import { calculateOptimizationMetrics, calculateOptimizationCosts, generateOptimizationRecommendations } from '@/services/audit/optimization/optimizationCalculator';
import { collectPagesContent } from '@/services/audit/content';
import { createOptimizedSite } from '@/services/audit/scanner';
import { saveAs } from 'file-saver';

export interface AuditOptions extends CrawlOptions {
  domain: string;
  trackPositions?: boolean;
  keywords?: string[];
}

export interface AuditProgress extends CrawlProgress {
  stage?: string;
}

export interface AuditResult extends CrawlResult {
  optimizationMetrics?: any;
  optimizationCosts?: any;
  recommendations?: string[];
  positionResults?: any;
}

export const auditApiService = {
  /**
   * Start a comprehensive audit of a website
   */
  startAudit: async (
    options: AuditOptions,
    onProgress?: (progress: AuditProgress) => void
  ): Promise<AuditResult> => {
    try {
      // Start with crawling
      if (onProgress) {
        onProgress({
          status: 'pending',
          pagesScanned: 0,
          totalPages: 0,
          stage: 'Preparing audit'
        });
      }
      
      // Normalize URL and domain
      const url = options.domain.startsWith('http') ? options.domain : `https://${options.domain}`;
      const domain = new URL(url).hostname;
      
      // Start crawl
      const crawlResult = await crawlService.startCrawl(
        url,
        {
          maxPages: options.maxPages,
          maxDepth: options.maxDepth,
          checkBrokenLinks: options.checkBrokenLinks,
          findDuplicates: options.findDuplicates,
          analyzeStructure: options.analyzeStructure,
          checkContent: options.checkContent,
          generateSitemap: options.generateSitemap
        },
        (progress) => {
          if (onProgress) {
            onProgress({
              ...progress,
              stage: progress.stage || 'Crawling website'
            });
          }
        }
      );
      
      const result: AuditResult = {
        ...crawlResult
      };
      
      // Collect page content for optimization analysis
      if (onProgress) {
        onProgress({
          status: 'analyzing',
          pagesScanned: crawlResult.urls.length,
          totalPages: crawlResult.urls.length,
          stage: 'Collecting page content'
        });
      }
      
      const pagesContent = await collectPagesContent(
        crawlResult.urls.slice(0, 100), // Limit to 100 pages for performance
        100,
        (current, total) => {
          if (onProgress) {
            onProgress({
              status: 'analyzing',
              pagesScanned: current,
              totalPages: total,
              stage: 'Collecting page content'
            });
          }
        }
      );
      
      // Calculate optimization metrics
      if (onProgress) {
        onProgress({
          status: 'analyzing',
          pagesScanned: crawlResult.urls.length,
          totalPages: crawlResult.urls.length,
          stage: 'Calculating optimization metrics'
        });
      }
      
      const brokenLinksCount = crawlResult.brokenLinks ? crawlResult.brokenLinks.length : 0;
      result.optimizationMetrics = calculateOptimizationMetrics(pagesContent, crawlResult.urls.length, brokenLinksCount);
      result.optimizationCosts = calculateOptimizationCosts(result.optimizationMetrics, crawlResult.urls.length);
      result.recommendations = generateOptimizationRecommendations(result.optimizationMetrics);
      
      // Track positions if requested
      if (options.trackPositions && options.keywords && options.keywords.length > 0) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: crawlResult.urls.length,
            totalPages: crawlResult.urls.length,
            stage: 'Tracking keyword positions'
          });
        }
        
        result.positionResults = await positionTrackingService.trackPositions({
          domain: options.domain,
          keywords: options.keywords,
          searchEngine: 'all',
          depth: 100,
          scanFrequency: 'once',
          useProxy: false
        });
      }
      
      // Final progress update
      if (onProgress) {
        onProgress({
          status: 'completed',
          pagesScanned: crawlResult.urls.length,
          totalPages: crawlResult.urls.length,
          stage: 'Audit completed'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error during audit:', error);
      
      if (onProgress) {
        onProgress({
          status: 'failed',
          pagesScanned: 0,
          totalPages: 0,
          stage: 'Error during audit',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      throw error;
    }
  },
  
  /**
   * Download audit results as PDF
   */
  downloadAuditReport: async (result: AuditResult): Promise<void> => {
    const reportBlob = await crawlService.generateReport(result);
    saveAs(reportBlob, `seo_audit_${result.domain}.html`);
  },
  
  /**
   * Generate and download optimized version of the site
   */
  downloadOptimizedSite: async (
    result: AuditResult,
    onProgress?: (progress: number) => void
  ): Promise<void> => {
    const optimizedSiteBlob = await createOptimizedSite(
      result.domain,
      result.urls,
      (current, total) => {
        if (onProgress) {
          onProgress((current / total) * 100);
        }
      }
    );
    
    saveAs(optimizedSiteBlob, `optimized_${result.domain}.zip`);
  }
};
