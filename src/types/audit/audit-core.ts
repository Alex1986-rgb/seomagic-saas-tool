
import { AuditDetailsData } from './audit-details';

export interface AuditData {
  id: string;
  url: string;
  title?: string;
  score: number;
  previousScore?: number;
  pageCount?: number;
  crawledPages?: number;
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: {
    critical: string[];
    important: string[];
    opportunities: string[];
    minor?: number;
    passed?: number;
  };
  details: AuditDetailsData;
  optimizationCost?: number;
  optimizationItems?: {
    name: string;
    description: string;
    count: number;
    price: number;
    totalPrice: number;
    type?: string;
  }[];
}

export interface AuditHistoryItem {
  id: string;
  date: string;
  score: number;
  pageCount?: number;
  url: string;
  details?: {
    seo: { score: number; };
    performance: { score: number; };
    content: { score: number; };
    technical: { score: number; };
  };
  issues?: {
    critical: number;
    important: number;
    opportunities?: number;
  };
  changes?: number;
  categoryScores?: Record<string, number>;
}

export interface AuditHistoryData {
  url: string;
  items: AuditHistoryItem[];
}

