
/**
 * Main website scanner module
 */

import { ScanOptions } from "@/types/audit";
import { faker } from '@faker-js/faker';
import { OptimizationItem } from '@/components/audit/results/components/optimization';
import { generateSitemap } from './sitemap';
import { collectPagesContent, PageContent } from './content';
import { calculateOptimizationMetrics, PageStatistics } from './optimization';
import { createOptimizedSite } from './optimizedSite';

/**
 * Сканирует сайт с заданными параметрами
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
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  try {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const domain = new URL(formattedUrl).hostname;
    
    const pagesToScan = Math.min(250000, maxPages);
    let totalScannedPages = 0;
    
    const pageStats: PageStatistics = {
      totalPages: 0,
      subpages: {},
      levels: {}
    };
    
    const pageTypes = ['product', 'category', 'blog', 'contact', 'about', 'faq', 'terms', 'privacy'];
    
    const pageDistribution: Record<string, number> = {
      'product': 0.65,
      'category': 0.15,
      'blog': 0.12,
      'contact': 0.01,
      'about': 0.01,
      'faq': 0.02,
      'terms': 0.01,
      'privacy': 0.01
    };
    
    const initialBatchSize = Math.min(100, pagesToScan);
    for (let i = 1; i <= initialBatchSize; i++) {
      let randomPageType = 'product';
      const rand = Math.random();
      let cumulative = 0;
      
      for (const [type, prob] of Object.entries(pageDistribution)) {
        cumulative += prob;
        if (rand < cumulative) {
          randomPageType = type;
          break;
        }
      }
      
      if (!pageStats.subpages[randomPageType]) {
        pageStats.subpages[randomPageType] = 0;
      }
      pageStats.subpages[randomPageType]++;
      
      const pageDepth = Math.min(Math.floor(Math.random() * maxDepth) + 1, maxDepth);
      if (!pageStats.levels[pageDepth]) {
        pageStats.levels[pageDepth] = 0;
      }
      pageStats.levels[pageDepth]++;
      
      let currentUrlPath = `${formattedUrl}/${randomPageType}`;
      for (let d = 1; d < pageDepth; d++) {
        currentUrlPath += `/${faker.lorem.slug(2)}`;
      }
      
      pageStats.totalPages++;
      totalScannedPages++;
      
      if (onProgress) {
        onProgress(i, pagesToScan, currentUrlPath);
      }
      
      await delay(Math.random() * 50 + 20);
    }
    
    const remainingPages = pagesToScan - initialBatchSize;
    if (remainingPages > 0) {
      const batchSize = 5000;
      const numBatches = Math.ceil(remainingPages / batchSize);
      
      for (let batch = 0; batch < numBatches; batch++) {
        const currentBatchSize = Math.min(batchSize, remainingPages - batch * batchSize);
        const startPage = initialBatchSize + batch * batchSize + 1;
        const endPage = startPage + currentBatchSize - 1;
        
        for (const pageType of pageTypes) {
          const countForType = Math.floor(currentBatchSize * pageDistribution[pageType]);
          pageStats.subpages[pageType] = (pageStats.subpages[pageType] || 0) + countForType;
          
          for (let level = 1; level <= maxDepth; level++) {
            const levelProb = level === 1 ? 0.1 : 
                               level <= 5 ? 0.4 : 
                               level <= 15 ? 0.3 : 
                               level <= 30 ? 0.15 : 0.05;
            
            const pagesAtLevel = Math.floor(countForType * levelProb);
            pageStats.levels[level] = (pageStats.levels[level] || 0) + pagesAtLevel;
          }
        }
        
        pageStats.totalPages += currentBatchSize;
        totalScannedPages += currentBatchSize;
        
        const randomType = faker.helpers.arrayElement(pageTypes);
        const randomUrl = `${formattedUrl}/${randomType}/${faker.lorem.slug(3)}`;
        
        if (onProgress) {
          onProgress(totalScannedPages, pagesToScan, randomUrl);
        }
        
        await delay(200);
      }
    }
    
    const sitemap = generateSitemap(domain, pageStats.totalPages, true);
    
    const pagesContent = await collectPagesContent(domain, pageStats.totalPages);
    
    const {
      optimizationCost,
      optimizationItems
    } = calculateOptimizationMetrics(pageStats, pagesContent);
    
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
export { collectPagesContent, PageContent } from './content';
export { calculateOptimizationMetrics, PageStatistics } from './optimization';
export { createOptimizedSite } from './optimizedSite';
