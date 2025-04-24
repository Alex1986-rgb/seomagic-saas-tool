
import { AuditDetailsData } from './audit-details';

export interface AuditData {
  id: string;
  url: string;
  title?: string;
  score: number;
  previousScore?: number; // Added this to match usage in components
  pageCount?: number;
  crawledPages?: number;
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: {
    critical: string[]; // Changed to string[] from number
    important: string[]; // Changed to string[] from number
    opportunities: string[]; // Added opportunities property
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
  details?: { // Added details property to match usage
    seo: { score: number; };
    performance: { score: number; };
    content: { score: number; };
    technical: { score: number; };
    mobile?: { score: number; };
    usability?: { score: number; };
  };
  issues?: { // Added issues property to match usage
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
