
export * from './generators';
export * from './recommendations';
export * from './history';
export * from './seoDetails';
export * from './sitemap';

// Selectively export from content and optimization
export { collectPagesContent, type PageContent, optimizePageContent, improveSeoDescription, generateSeoDescription, generateKeywords } from './content';
export { calculateOptimizationMetrics } from './optimization';

// Export site analysis features
export {
  detectBrokenLinks,
  detectDuplicates,
  analyzeSiteStructure,
  analyzeContentUniqueness,
  type BrokenLink,
  type Redirect,
  type DuplicatePage,
  type DuplicateMetaTag,
  type SiteStructure,
  type PageNode,
  type ContentAnalysisResult
} from './siteAnalysis';

// Export optimized site
export { createOptimizedSite } from './optimizedSite';

// Export functions from scanner.ts
import { scanWebsite, generateSitemap, calculateScannerOptimizationMetrics, createOptimizedSite as createScannerOptimizedSite } from './scanner';
export { 
  scanWebsite, 
  generateSitemap, 
  calculateScannerOptimizationMetrics,
  createScannerOptimizedSite 
};

import { AuditData } from "@/types/audit";
import { generateAuditData } from './generators';

/**
 * Fetches audit data for a URL
 */
export const fetchAuditData = async (url?: string): Promise<AuditData> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAuditData(url || "example.com"));
    }, 1000);
  });
};
