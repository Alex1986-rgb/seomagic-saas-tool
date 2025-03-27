
// Re-export all PDF-related utilities
export * from './reportGenerator';
export * from './auditPdf';
export * from './historyPdf';
export * from './errorReportPdf';

// Export helpers from the new structure
export * from './helpers';
export * from './styles';

// Note: getScoreColorRGB is now available from both helpers and styles/colors
// but we handle this with an alias in the styles/colors module
