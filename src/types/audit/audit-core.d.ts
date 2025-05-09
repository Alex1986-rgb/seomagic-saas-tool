
import { AuditDetailsData, IssuesData } from './audit-details';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

export interface AuditData {
  id: string;
  url: string;
  date: string;
  score: number;
  previousScore?: number;
  issues: IssuesData;
  details: AuditDetailsData;
  pageCount?: number;
  crawledPages?: number;
  status: 'completed' | 'in-progress' | 'failed';
  title?: string;
  scanTime?: string;
  
  // Adding optimization data to the AuditData type
  optimizationItems?: OptimizationItem[];
  optimizationCost?: number;
  domain?: string;
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  date: string;
  score: number;
  changes?: number;
  categoryScores?: Record<string, number>;
  details?: {
    seo: { score: number; };
    performance: { score: number; };
    content: { score: number; };
    technical: { score: number; };
    mobile?: { score: number; };
    usability?: { score: number; };
  };
  issues?: {
    critical: number;
    important: number;
    opportunities?: number;
  };
}

export interface AuditHistoryData {
  url: string;
  items: AuditHistoryItem[];
}
