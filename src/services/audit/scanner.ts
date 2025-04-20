
import { DeepCrawlerCore } from './crawler/deepCrawlerCore';
import { extractLinks } from './linkExtraction';
import { collectPagesContent } from './content';
import { calculateOptimizationMetrics } from './optimization';
import { siteGeneratorService } from '../api/siteGeneratorService';
import { SimpleSitemapCreator } from './simpleSitemapCreator';

export const scanWebsite = async (
  url: string,
  maxPages: number = 500,
  onProgress?: (current: number, total: number, currentUrl: string) => void
): Promise<string[]> => {
  const sitemapCreator = new SimpleSitemapCreator({
    maxPages,
    maxDepth: 5,
    includeStylesheet: true
  });
  
  return sitemapCreator.crawl(url, onProgress);
};

export const generateSitemap = (domain: string, urls: string[]): string => {
  const sitemapCreator = new SimpleSitemapCreator();
  return sitemapCreator.generateSitemapXml(urls);
};

export const calculateScannerOptimizationMetrics = async (
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<any> => {
  // First collect content from pages
  const pagesContent = await collectPagesContent(
    urls,
    100, // Limit to 100 pages for performance
    onProgress
  );
  
  // Then calculate metrics
  return calculateOptimizationMetrics(pagesContent, urls.length);
};

export const createOptimizedSite = async (
  domain: string,
  urls: string[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> => {
  // This is a simplified version - in a real implementation,
  // you would create actual optimized copies of the pages
  
  // Create a simple mapping of original to "optimized" pages
  const pages = new Map();
  const optimizedPages = new Map();
  
  for (let i = 0; i < Math.min(urls.length, 100); i++) {
    const url = urls[i];
    
    // Mock data for example purposes
    pages.set(url, {
      url,
      html: `<html><head><title>Original ${url}</title></head><body>Original content</body></html>`
    });
    
    optimizedPages.set(url, {
      optimizedHtml: `<html><head><title>Optimized ${url}</title></head><body>Optimized content</body></html>`,
      optimizedTitle: `Optimized ${url}`,
      optimizedDescription: `This is an optimized version of ${url}`,
    });
    
    if (onProgress) {
      onProgress(i + 1, Math.min(urls.length, 100));
    }
  }
  
  // Use the site generator service to create the ZIP file
  return siteGeneratorService.generateOptimizedSite(domain, pages, optimizedPages);
};
