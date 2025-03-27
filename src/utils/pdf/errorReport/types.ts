
import { AuditData } from '@/types/audit';

export interface ErrorReportPdfOptions {
  auditData: AuditData;
  url: string;
  urls?: string[];
}

export interface AnalyzedError {
  title: string;
  description: string;
}

export interface AnalyzedErrors {
  critical: AnalyzedError[];
  important: AnalyzedError[];
  minor: AnalyzedError[];
}
