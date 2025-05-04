
// Re-export all PDF-related utilities
export * from './auditPdf';
export * from './historyPdf';
export * from './errorReport';
export * from './deepCrawlPdf';
export * from './proxyReport'; // Export the new proxy report generator

// Export helpers from the new structure
export * from './helpers';
export * from './styles';

// Note: getScoreColorRGB is now available from both helpers and styles/colors
// but we handle this with an alias in the styles/colors module
