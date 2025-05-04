
// Re-export all PDF export utilities from the new modular structure
export * from './pdf';

// Прямой экспорт для удобного импорта часто используемых функций
export { generateAuditPdf } from './pdf/auditPdf';
export { generateDeepCrawlPdf } from './pdf/deepCrawlPdf';
export { generateErrorReportPdf } from './pdf/errorReport';
export { generateHistoryPDF } from './pdf/historyPdf';
export { generateProxyReportPdf } from './pdf/proxyReport';

// Экспорт хелперов для форматирования
export { formatDateString } from './pdf/helpers/formatting';
