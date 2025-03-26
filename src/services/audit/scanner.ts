
/**
 * Main website scanner module with improved accuracy for large sites
 */

import { ScanOptions } from "@/types/audit";
import type { OptimizationItem } from '@/components/audit/results/components/optimization';
import { detectPlatform, fetchRobotsTxt } from './detection';
import { extractLinks, parseSitemapUrls, urlCache } from './linkExtraction';
import { estimatePageCount } from './estimator';
import { generatePageStatistics } from './statistics';
import { generateSitemap } from './sitemap';
import { collectPagesContent, type PageContent } from './content';
import { calculateOptimizationMetrics, type PageStatistics } from './optimization';
import { createOptimizedSite } from './optimizedSite';

/**
 * Main scanning function with improved accuracy
 */
export const scanWebsite = async (
  url: string, 
  options: ScanOptions
): Promise<{ 
  success: boolean; 
  pageStats: PageStatistics; 
  sitemap?: string;
  pagesContent?: PageContent[];
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
}> => {
  const { maxPages, maxDepth, onProgress } = options;
  
  try {
    // Reset URL cache for new scan
    urlCache.clear();
    
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    if (onProgress) {
      onProgress(1, 100, formattedUrl);
    }
    
    // Step 1: Detect platform
    const platform = await detectPlatform(formattedUrl);
    console.log(`Detected platform: ${platform}`);
    
    if (onProgress) {
      onProgress(5, 100, `Analyzing ${platform} platform...`);
    }
    
    // Step 2: Check robots.txt for sitemaps
    const { robotsTxt, sitemapUrls } = await fetchRobotsTxt(domain);
    
    if (onProgress) {
      onProgress(10, 100, `Checking robots.txt and sitemaps...`);
    }
    
    // Step 3: Collect sample URLs from homepage and sitemap
    let sampleUrls: string[] = [];
    
    // Get links from homepage
    const homepageLinks = await extractLinks(formattedUrl);
    sampleUrls = sampleUrls.concat(homepageLinks);
    
    // Process sitemap if available
    if (sitemapUrls.length > 0) {
      for (const sitemapUrl of sitemapUrls.slice(0, 3)) { // Limit to first 3 sitemaps for performance
        const urls = await parseSitemapUrls(sitemapUrl);
        sampleUrls = sampleUrls.concat(urls.slice(0, 200)); // Take sample of up to 200 URLs from each sitemap
        
        if (onProgress) {
          onProgress(20, 100, `Processing sitemap: ${sitemapUrl}`);
        }
      }
    }
    
    // Filter and clean URLs
    sampleUrls = sampleUrls
      .filter(link => link && typeof link === 'string')
      .filter(link => {
        try {
          const linkUrl = link.startsWith('http') ? new URL(link) : new URL(link, formattedUrl);
          return linkUrl.hostname === domain; // Keep only internal links
        } catch (e) {
          return false;
        }
      })
      .filter((link, index, self) => self.indexOf(link) === index); // Remove duplicates
    
    if (onProgress) {
      onProgress(30, 100, `Collected ${sampleUrls.length} sample URLs...`);
    }
    
    // Step 4: Estimate total page count based on platform and URL patterns
    const estimatedPageCount = Math.min(await estimatePageCount(platform, sampleUrls, domain), maxPages);
    
    if (onProgress) {
      onProgress(40, 100, `Estimated ${estimatedPageCount} total pages...`);
    }
    
    // Step 5: Generate page statistics based on sample URLs and estimates
    const pageStats = generatePageStatistics(estimatedPageCount, sampleUrls, platform);
    
    if (onProgress) {
      onProgress(60, 100, `Generating detailed statistics...`);
    }
    
    // Step 6: Generate sitemap
    const sitemap = generateSitemap(domain, estimatedPageCount, true);
    
    if (onProgress) {
      onProgress(80, 100, `Creating sitemap with ${estimatedPageCount} URLs...`);
    }
    
    // Step 7: Generate page content samples for analysis
    const pagesContent = await collectPagesContent(domain, estimatedPageCount);
    
    if (onProgress) {
      onProgress(90, 100, `Analyzing content samples...`);
    }
    
    // Step 8: Calculate optimization metrics
    const {
      optimizationCost,
      optimizationItems
    } = calculateOptimizationMetrics(pageStats, pagesContent);
    
    if (onProgress) {
      onProgress(100, 100, `Scan complete. Found ${estimatedPageCount} pages.`);
    }
    
    return { 
      success: true, 
      pageStats, 
      sitemap, 
      pagesContent, 
      optimizationCost,
      optimizationItems
    };
  } catch (error) {
    console.error('Ошибка сканирования сайта:', error);
    return { success: false, pageStats: { totalPages: 0, subpages: {}, levels: {} } };
  }
};

// Re-export all the needed functions from the other modules
export { generateSitemap } from './sitemap';
export type { PageContent } from './content';
export { collectPagesContent } from './content';
export type { PageStatistics } from './optimization';
export { calculateOptimizationMetrics } from './optimization';
export { createOptimizedSite } from './optimizedSite';
