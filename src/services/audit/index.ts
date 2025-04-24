
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
import { 
  scanWebsite, 
  generateSitemap, 
  calculateScannerOptimizationMetrics, 
  createScannerOptimizedSite,
  downloadAuditPdfReport,
  downloadErrorReport
} from './scanner';

export { 
  scanWebsite, 
  generateSitemap, 
  calculateScannerOptimizationMetrics,
  createScannerOptimizedSite,
  downloadAuditPdfReport,
  downloadErrorReport
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
      // First generate the data
      const data = generateAuditData(url || "example.com");
      // Convert to the expected type using type assertion
      const auditData = {
        ...data,
        // Ensure the issues property has the right structure
        issues: {
          critical: data.issues.critical,
          important: data.issues.important,
          opportunities: data.issues.opportunities,
          minor: data.issues.minor,
          passed: data.issues.passed
        }
      };
      resolve(auditData as AuditData);
    }, 1000);
  });
};
