/**
 * Report generator for crawl results
 */

import { PageData, CrawlSummary } from './types';

export class ReportGenerator {
  // Generate sitemap XML for discovered URLs
  static generateSitemap(domain: string, visited: Set<string>, excludePatterns: RegExp[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of visited) {
      try {
        // Skip URLs that match exclude patterns
        let shouldSkip = false;
        for (const pattern of excludePatterns) {
          if (pattern.test(url)) {
            shouldSkip = true;
            break;
          }
        }
        
        if (shouldSkip) continue;
        
        const urlObj = new URL(url);
        if (urlObj.hostname === domain) {
          sitemap += `  <url>\n    <loc>${url}</loc>\n`;
          sitemap += `    <priority>0.5</priority>\n`;
          sitemap += `  </url>\n`;
        }
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  // Generate summary report of crawling
  static generateSummaryReport(
    pageData: Map<string, PageData>, 
    domain: string, 
    baseUrl: string, 
    startTime: number, 
    endTime: number
  ): CrawlSummary {
    const pages = Array.from(pageData.values());
    
    // Calculate total internal and external links
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;
    
    for (const page of pages) {
      totalInternalLinks += page.internalLinks?.length || 0;
      totalExternalLinks += page.externalLinks?.length || 0;
    }
    
    // Count pages with missing meta elements
    let pagesWithoutTitle = 0;
    let pagesWithoutDescription = 0;
    let pagesWithoutH1 = 0;
    
    for (const page of pages) {
      if (!page.title) pagesWithoutTitle++;
      if (!page.description) pagesWithoutDescription++;
      if (!page.h1 || page.h1.length === 0) pagesWithoutH1++;
    }
    
    // Calculate total time and rate
    const totalTimeMs = endTime - startTime;
    const totalTimeSeconds = totalTimeMs / 1000;
    const crawlRate = totalTimeSeconds > 0 ? `${(pages.length / totalTimeSeconds).toFixed(2)} pages/sec` : 'N/A';
    
    // Generate formatted time
    const durationFormatted = totalTimeSeconds < 60 
      ? `${totalTimeSeconds.toFixed(2)} seconds`
      : `${Math.floor(totalTimeSeconds / 60)} minutes ${Math.floor(totalTimeSeconds % 60)} seconds`;
    
    // Calculate page statistics
    const avgInternalLinks = pages.length > 0 
      ? (totalInternalLinks / pages.length).toFixed(1) 
      : '0';
      
    const avgExternalLinks = pages.length > 0 
      ? (totalExternalLinks / pages.length).toFixed(1) 
      : '0';
      
    const totalImages = pages.reduce((sum, page) => sum + (page.images?.length || 0), 0);
    const avgImages = pages.length > 0 
      ? (totalImages / pages.length).toFixed(1) 
      : '0';
    
    // Calculate percentages
    const percentWithoutTitle = pages.length > 0 
      ? `${((pagesWithoutTitle / pages.length) * 100).toFixed(1)}%` 
      : '0%';
      
    const percentWithoutDescription = pages.length > 0 
      ? `${((pagesWithoutDescription / pages.length) * 100).toFixed(1)}%` 
      : '0%';
      
    const percentWithoutH1 = pages.length > 0 
      ? `${((pagesWithoutH1 / pages.length) * 100).toFixed(1)}%` 
      : '0%';
    
    return {
      crawlSummary: {
        url: baseUrl,
        domain,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        duration: durationFormatted,
        totalPages: pages.length,
        crawlRate
      },
      pageStats: {
        totalInternalLinks,
        totalExternalLinks,
        totalImages,
        avgInternalLinksPerPage: avgInternalLinks,
        avgExternalLinksPerPage: avgExternalLinks,
        avgImagesPerPage: avgImages
      },
      seoIssues: {
        pagesWithoutTitle,
        pagesWithoutDescription,
        pagesWithoutH1,
        percentWithoutTitle,
        percentWithoutDescription,
        percentWithoutH1
      }
    };
  }
  
  // Create a ZIP file with crawl data
  static async createCrawlDataZip(
    domain: string, 
    sitemap: string, 
    summary: CrawlSummary, 
    pagesData: PageData[]
  ): Promise<Blob> {
    // For now, we'll just return a simple blob since we're missing JSZip implementation
    // In a real implementation, we would create a zip file with multiple files
    const reportData = JSON.stringify({
      domain,
      summary,
      pagesCount: pagesData.length,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    return new Blob([reportData], { type: 'application/json' });
  }
}
