
// Define types for the error report PDF

// Error structure
export interface AnalyzedError {
  title: string;
  description: string;
  solution?: string;
  url?: string;
  severity: 'critical' | 'important' | 'minor';
  category: string;
  impact?: 'high' | 'medium' | 'low';
}

// Analyzed errors structure
export interface AnalyzedErrors {
  critical: AnalyzedError[];
  important: AnalyzedError[];
  minor: AnalyzedError[];
  byPage?: Record<string, AnalyzedError[]>;
}

// Options for the error report PDF generator
export interface ErrorReportPdfOptions {
  auditData: any;
  url: string;
  urls?: string[];
  includeScreenshots?: boolean;
  detailed?: boolean;
}

// ErrorReportData for the sections module
export interface ErrorReportData {
  critical: ErrorTypeData[];
  major: ErrorTypeData[];
  minor: ErrorTypeData[];
}

export interface ErrorTypeData {
  name: string;
  description: string;
  urls: string[];
  solution?: string;
}
