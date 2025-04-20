
export * from './generators';
export * from './recommendations';
export * from './history';
export * from './seoDetails';
export * from './sitemap';

// Selectively export from content and optimization
export { collectPagesContent, type PageContent, optimizePageContent, improveSeoDescription, generateSeoDescription, generateKeywords } from './content';
export { calculateOptimizationMetrics } from './optimization';

export * from './optimizedSite';

// Don't re-export PageContent from scanner to avoid ambiguity
import { scanWebsite, generateSitemap, calculateScannerOptimizationMetrics, createOptimizedSite } from './scanner';
export { 
  scanWebsite, 
  generateSitemap, 
  calculateScannerOptimizationMetrics, 
  createOptimizedSite 
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
