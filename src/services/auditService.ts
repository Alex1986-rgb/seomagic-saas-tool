
// Экспортируем все сервисы аудита из модульной структуры

// Экспорт основных функций аудита
export { 
  fetchAuditData,
  scanWebsite,
  generateSitemap,
  calculateScannerOptimizationMetrics,
  createOptimizedSite,
  collectPagesContent,
  calculateOptimizationMetrics
} from './audit';

// Экспорт отдельных типов для устранения неоднозначности
export type { PageContent } from './audit/optimization/types';
export type { OptimizationMetrics, OptimizationItem, OptimizationResponse } from './audit/optimization/types';

// Экспорт модулей сканера и карты сайта
export * from './audit/scanner';
export * from './audit/sitemap';
export * from './audit/optimization';
export * from './audit/optimizedSite';

// Экспорт функций рекомендаций и истории
export { fetchRecommendations } from './audit/recommendations';
export { fetchAuditHistory } from './audit/history';

// Экспорт функций анализа сайта
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
} from './audit/siteAnalysis';
