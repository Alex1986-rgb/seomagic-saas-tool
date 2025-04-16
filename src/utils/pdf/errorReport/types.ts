import { AuditData } from '@/types/audit';
import jsPDF from 'jspdf';

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
  errors: ErrorData[];
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

export interface ErrorReportData {
  critical: ErrorTypeData[];
  major: ErrorTypeData[];
  minor: ErrorTypeData[];
}

export interface ErrorTypeData {
  name: string;
  description: string;
  solution?: string;
  urls: string[];
}
