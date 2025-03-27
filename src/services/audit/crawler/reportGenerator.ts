
/**
 * Report generator for creating summaries and sitemaps from crawl data
 */

import { PageData, CrawlSummary } from './types';
import JSZip from 'jszip';

export class ReportGenerator {
  // Generate a sitemap based on discovered URLs
  static generateSitemap(domain: string, visited: Set<string>, excludePatterns: RegExp[]): string {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add all URLs to the sitemap
    for (const url of visited) {
      // Skip URLs that don't belong to the crawled domain
      try {
        const urlObj = new URL(url);
        if (urlObj.hostname !== domain) continue;
        
        // Skip non-HTML resources
        if (excludePatterns.some(pattern => pattern.test(url))) continue;
        
        sitemap += `  <url>\n    <loc>${url}</loc>\n`;
        
        // Add default priority
        sitemap += `    <priority>0.5</priority>\n`;
        
        sitemap += `  </url>\n`;
      } catch (e) {
        // Skip invalid URLs
      }
    }
    
    sitemap += '</urlset>';
    return sitemap;
  }
  
  // Generate a summary report of the crawl
  static generateSummaryReport(
    pageData: Map<string, PageData>, 
    domain: string, 
    baseUrl: string, 
    crawlStartTime: number, 
    crawlEndTime: number
  ): CrawlSummary {
    const totalPages = pageData.size;
    const crawlTime = (crawlEndTime - crawlStartTime) / 1000;
    
    // Calculate statistics
    let totalInternalLinks = 0;
    let totalExternalLinks = 0;
    let totalImages = 0;
    let pagesWithoutTitle = 0;
    let pagesWithoutDescription = 0;
    let pagesWithoutH1 = 0;
    
    for (const page of pageData.values()) {
      totalInternalLinks += page.internalLinks.length;
      totalExternalLinks += page.externalLinks.length;
      totalImages += page.images.length;
      
      if (!page.title) pagesWithoutTitle++;
      if (!page.metaDescription) pagesWithoutDescription++;
      if (page.headings.h1.length === 0) pagesWithoutH1++;
    }
    
    return {
      crawlSummary: {
        url: baseUrl,
        domain: domain,
        startTime: new Date(crawlStartTime).toISOString(),
        endTime: new Date(crawlEndTime).toISOString(),
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
  
  // Create a ZIP archive with crawl data
  static async createCrawlDataZip(
    domain: string, 
    sitemap: string, 
    summary: CrawlSummary, 
    pagesData: PageData[]
  ): Promise<Blob> {
    const zip = new JSZip();
    
    // Add sitemap.xml
    zip.file('sitemap.xml', sitemap);
    
    // Add crawl summary report
    zip.file('crawl-summary.json', JSON.stringify(summary, null, 2));
    
    // Add detailed page data
    zip.file('pages-data.json', JSON.stringify(pagesData, null, 2));
    
    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  }
}
