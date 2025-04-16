
// This file now re-exports all audit services from the new modular structure
// for backwards compatibility

// Selectively re-export from main audit module
export { 
  fetchAuditData,
  scanWebsite,
  generateSitemap,
  calculateScannerOptimizationMetrics,
  createOptimizedSite,
  collectPagesContent,
  calculateOptimizationMetrics
} from './audit';

// Re-export specific named types to avoid ambiguity
export type { PageContent } from './audit/content';

// Re-export these modules directly
export * from './audit/scanner';
export * from './audit/sitemap';
export * from './audit/optimization';
export * from './audit/optimizedSite';

// Re-export recommendations and history functions
export { fetchRecommendations } from './audit/recommendations';
export { fetchAuditHistory } from './audit/history';
