
import { AuditData } from '@/types/audit';

export interface ErrorReportPdfOptions {
  auditData: AuditData;
  url: string;
  urls?: string[];
  includeScreenshots?: boolean;
  detailed?: boolean;
}

export interface AnalyzedError {
  title: string;
  description: string;
  impact?: 'high' | 'medium' | 'low';
  category?: string;
  solution?: string;
  url?: string;
}

export interface AnalyzedErrors {
  critical: AnalyzedError[];
  important: AnalyzedError[];
  minor: AnalyzedError[];
  byPage?: Record<string, AnalyzedError[]>;
}

export interface ErrorReportSection {
  title: string;
  errors: AnalyzedError[];
  color: [number, number, number];
}

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
