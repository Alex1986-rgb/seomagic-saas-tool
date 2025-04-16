
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
export type { PageContent } from './audit/content';

// Экспорт модулей сканера и карты сайта
export * from './audit/scanner';
export * from './audit/sitemap';
export * from './audit/optimization';
export * from './audit/optimizedSite';

// Экспорт функций рекомендаций и истории
export { fetchRecommendations } from './audit/recommendations';
export { fetchAuditHistory } from './audit/history';
