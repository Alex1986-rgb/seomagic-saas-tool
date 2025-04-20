
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { analyzeContent } from './audit/optimization/contentAnalyzer';
import { 
  detectBrokenLinks, 
  detectDuplicates, 
  generateSitemap as generateSitemapFromUrls,
  analyzeSiteStructure,
  analyzeContentUniqueness
} from './audit/siteAnalysis';
import { SimpleSitemapCreator } from './audit/simpleSitemapCreator';
import { DeepCrawlerCore } from './audit/crawler/deepCrawlerCore';
import { extractLinks, parseSitemapUrls } from './audit/linkExtraction';
import { firecrawlService } from './api/firecrawl';

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  checkBrokenLinks?: boolean;
  findDuplicates?: boolean;
  analyzeStructure?: boolean;
  checkContent?: boolean;
  generateSitemap?: boolean;
}

export interface CrawlProgress {
  status: 'pending' | 'crawling' | 'analyzing' | 'completed' | 'failed';
  pagesScanned: number;
  totalPages: number;
  currentUrl?: string;
  stage?: string;
  error?: string;
}

export interface CrawlResult {
  domain: string;
  urls: string[];
  brokenLinks?: any[];
  redirects?: any[];
  duplicatePages?: any[];
  duplicateMeta?: any[];
  siteStructure?: any;
  contentAnalysis?: any;
  sitemap?: string;
}

export const crawlService = {
  /**
   * Start a new crawl for a domain
   */
  startCrawl: async (
    url: string, 
    options: CrawlOptions = {},
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<CrawlResult> => {
    try {
      // Normalize URL
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      
      // Initial progress update
      if (onProgress) {
        onProgress({
          status: 'pending',
          pagesScanned: 0,
          totalPages: 0,
          stage: 'Preparing to crawl'
        });
      }
      
      // Use the existing FireCrawl service or the SimpleSitemapCreator
      // depending on what's more appropriate
      let urls: string[] = [];
      let taskId: string | null = null;
      
      try {
        // Try using FireCrawl service first if it exists
        taskId = firecrawlService.getTaskIdForUrl(url);
        
        if (!taskId) {
          // Start a new crawl
          const task = await firecrawlService.startCrawl(url);
          taskId = task.id;
        }
        
        // Wait for the crawl to complete or check status
        const maxWaitTime = 300000; // 5 minutes max wait
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
          const status = await firecrawlService.getStatus(taskId);
          
          if (onProgress) {
            onProgress({
              status: 'crawling',
              pagesScanned: status.pages_scanned || 0,
              totalPages: status.estimated_total_pages || 1000,
              currentUrl: status.current_url,
              stage: 'Crawling website'
            });
          }
          
          if (status.status === 'completed') {
            // We have a completed crawl, proceed with analysis
            // In a real implementation, we would get URLs from FireCrawl results
            // For now, we'll simulate it
            urls = await new SimpleSitemapCreator().crawl(
              url,
              (scanned, total, currentUrl) => {
                if (onProgress) {
                  onProgress({
                    status: 'crawling',
                    pagesScanned: scanned,
                    totalPages: total,
                    currentUrl,
                    stage: 'Discovering pages'
                  });
                }
              }
            );
            break;
          }
          
          if (status.status === 'failed') {
            throw new Error('Crawl failed: ' + (status.error || 'Unknown error'));
          }
          
          // Wait before checking again
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.warn('Error using FireCrawl service, falling back to SimpleSitemapCreator:', error);
        
        // Fall back to SimpleSitemapCreator if FireCrawl is not available
        const sitemapCreator = new SimpleSitemapCreator({
          maxPages: options.maxPages || 500,
          maxDepth: options.maxDepth || 5
        });
        
        urls = await sitemapCreator.crawl(
          url,
          (scanned, total, currentUrl) => {
            if (onProgress) {
              onProgress({
                status: 'crawling',
                pagesScanned: scanned,
                totalPages: total,
                currentUrl,
                stage: 'Discovering pages'
              });
            }
          }
        );
      }
      
      // Now we have the URLs, continue with analysis
      const result: CrawlResult = {
        domain,
        urls
      };
      
      // Check broken links
      if (options.checkBrokenLinks) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: urls.length,
            totalPages: urls.length,
            stage: 'Checking for broken links'
          });
        }
        
        const { brokenLinks, redirects } = await detectBrokenLinks(
          domain,
          urls.slice(0, 100), // Limit to 100 URLs for performance
          (current, total) => {
            if (onProgress) {
              onProgress({
                status: 'analyzing',
                pagesScanned: current,
                totalPages: total,
                stage: 'Checking for broken links'
              });
            }
          }
        );
        
        result.brokenLinks = brokenLinks;
        result.redirects = redirects;
      }
      
      // Find duplicates
      if (options.findDuplicates) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: urls.length,
            totalPages: urls.length,
            stage: 'Finding duplicate content'
          });
        }
        
        const { duplicatePages, duplicateMeta } = await detectDuplicates(
          urls.slice(0, 200), // Limit to 200 URLs for performance
          (current, total) => {
            if (onProgress) {
              onProgress({
                status: 'analyzing',
                pagesScanned: current,
                totalPages: total,
                stage: 'Finding duplicate content'
              });
            }
          }
        );
        
        result.duplicatePages = duplicatePages;
        result.duplicateMeta = duplicateMeta;
      }
      
      // Analyze site structure
      if (options.analyzeStructure) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: urls.length,
            totalPages: urls.length,
            stage: 'Analyzing site structure'
          });
        }
        
        result.siteStructure = await analyzeSiteStructure(
          domain,
          urls.slice(0, 200), // Limit to 200 URLs for performance
          (current, total) => {
            if (onProgress) {
              onProgress({
                status: 'analyzing',
                pagesScanned: current,
                totalPages: total,
                stage: 'Analyzing site structure'
              });
            }
          }
        );
      }
      
      // Content analysis
      if (options.checkContent) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: urls.length,
            totalPages: urls.length,
            stage: 'Analyzing content uniqueness'
          });
        }
        
        result.contentAnalysis = await analyzeContentUniqueness(
          urls.slice(0, 100), // Limit to 100 URLs for performance
          (current, total) => {
            if (onProgress) {
              onProgress({
                status: 'analyzing',
                pagesScanned: current,
                totalPages: total,
                stage: 'Analyzing content uniqueness'
              });
            }
          }
        );
      }
      
      // Generate sitemap
      if (options.generateSitemap) {
        if (onProgress) {
          onProgress({
            status: 'analyzing',
            pagesScanned: urls.length,
            totalPages: urls.length,
            stage: 'Generating sitemap'
          });
        }
        
        result.sitemap = generateSitemapFromUrls(domain, urls);
      }
      
      // Final progress update
      if (onProgress) {
        onProgress({
          status: 'completed',
          pagesScanned: urls.length,
          totalPages: urls.length,
          stage: 'Analysis completed'
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error during crawl:', error);
      
      if (onProgress) {
        onProgress({
          status: 'failed',
          pagesScanned: 0,
          totalPages: 0,
          stage: 'Error during crawl',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      throw error;
    }
  },
  
  /**
   * Download sitemap for a domain
   */
  downloadSitemap: (domain: string, urls: string[]): void => {
    const sitemap = generateSitemapFromUrls(domain, urls);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, `sitemap_${domain}.xml`);
  },
  
  /**
   * Create and download an optimized version of the site
   */
  createOptimizedSite: async (
    domain: string,
    urls: string[],
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    const zip = new JSZip();
    const rootFolder = zip.folder(domain);
    
    // Add a basic robots.txt
    rootFolder?.file('robots.txt', `User-agent: *\nAllow: /\nSitemap: https://${domain}/sitemap.xml`);
    
    // Add the sitemap
    const sitemap = generateSitemapFromUrls(domain, urls);
    rootFolder?.file('sitemap.xml', sitemap);
    
    // For each URL, create a sample optimized HTML file
    // In a real implementation, this would be the actual optimized content
    const total = Math.min(urls.length, 100); // Limit to 100 files
    
    for (let i = 0; i < total; i++) {
      const url = urls[i];
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      
      if (path === '/') {
        path = '/index.html';
      } else if (!path.endsWith('.html') && !path.endsWith('.htm')) {
        path = path + '.html';
      }
      
      // Sample optimized HTML
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimized ${path} - ${domain}</title>
  <meta name="description" content="This is an optimized version of ${url}">
</head>
<body>
  <h1>Optimized page for ${path}</h1>
  <p>This is a placeholder for the optimized content of ${url}</p>
</body>
</html>`;
      
      rootFolder?.file(path.startsWith('/') ? path.substring(1) : path, html);
      
      if (onProgress) {
        onProgress((i + 1) / total * 100);
      }
    }
    
    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  },
  
  /**
   * Generate a PDF report for the crawl results
   */
  generateReport: async (result: CrawlResult): Promise<Blob> => {
    // This would typically use a library like jspdf to create a PDF
    // For now, we'll create a simple HTML report as a blob
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report - ${result.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>SEO Audit Report for ${result.domain}</h1>
  <p>Generated on ${new Date().toLocaleDateString()}</p>
  
  <h2>Summary</h2>
  <p>Total URLs discovered: ${result.urls.length}</p>
  
  ${result.brokenLinks ? `
  <h2>Broken Links</h2>
  <p>Found ${result.brokenLinks.length} broken links</p>
  <table>
    <tr>
      <th>URL</th>
      <th>Status Code</th>
      <th>From Page</th>
    </tr>
    ${result.brokenLinks.slice(0, 10).map(link => `
    <tr>
      <td>${link.url}</td>
      <td>${link.statusCode}</td>
      <td>${link.fromPage}</td>
    </tr>
    `).join('')}
  </table>
  ${result.brokenLinks.length > 10 ? '<p>And more...</p>' : ''}
  ` : ''}
  
  ${result.duplicatePages ? `
  <h2>Duplicate Pages</h2>
  <p>Found ${result.duplicatePages.length} groups of duplicate pages</p>
  ` : ''}
  
  <h2>Top URLs</h2>
  <ul>
    ${result.urls.slice(0, 20).map(url => `<li>${url}</li>`).join('')}
  </ul>
  ${result.urls.length > 20 ? '<p>And more...</p>' : ''}
</body>
</html>`;
    
    return new Blob([html], { type: 'text/html' });
  }
};
