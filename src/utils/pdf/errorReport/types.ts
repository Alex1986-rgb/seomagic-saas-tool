
import { AuditData } from '@/types/audit';

export interface ErrorData {
  url: string;
  errorType: string;
  errorMessage: string;
  statusCode?: number;
  timestamp: string;
  stackTrace?: string;
  browser?: string;
  device?: string;
  userAgent?: string;
}

export interface ErrorReportOptions {
  includeStackTrace?: boolean;
  includeBrowserInfo?: boolean;
  includeUserAgent?: boolean;
  title?: string;
  subtitle?: string;
  groupByType?: boolean;
}

export interface ErrorReportSection {
  title: string;
  errors: AnalyzedError[];
  color: [number, number, number];
}

export interface ErrorGroupData {
  type: string;
  count: number;
  percentage: string;
  errors: ErrorData[];
}

export interface ErrorReportContext {
  doc: jsPDF;
  currentY: number;
  options: ErrorReportOptions;
}

