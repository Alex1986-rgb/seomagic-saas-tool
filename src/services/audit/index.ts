
export * from './generators';
export * from './recommendations';
export * from './history';
export * from './seoDetails';
export * from './sitemap';
export * from './content';
export * from './optimization';
export * from './optimizedSite';

// Don't re-export PageContent from scanner to avoid ambiguity
// since it's already exported from content or optimization
import { scanWebsite, generateSitemap, calculateOptimizationMetrics, createOptimizedSite } from './scanner';
export { scanWebsite, generateSitemap, calculateOptimizationMetrics, createOptimizedSite };

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
