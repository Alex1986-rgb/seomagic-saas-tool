
export * from './generators';
export * from './recommendations';
export * from './history';
export * from './seoDetails';
export * from './sitemap';

// Export issues and pricing services
export { IssueClassifier, PricingService } from './issues';
export type { ClassifiedIssue } from './issues';

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
  type SiteStructureNode,
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

