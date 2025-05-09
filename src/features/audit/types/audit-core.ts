
import { AuditDetailsData } from './audit-details';

export interface AuditData {
  id: string;
  url: string;
  title?: string;
  score: number;
  previousScore?: number;
  pageCount?: number;
  crawledPages?: number;
  date: string; // Ensuring date property is present
  scanTime?: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: {
    critical: string[] | any[];
    important: string[] | any[];
    opportunities: string[] | any[];
    minor: number | any[]; // Can be number or array of objects
    passed?: number | any[]; // Can be number or array of objects
  };
  details: AuditDetailsData; // Ensuring details property is present
  optimizationCost?: number;
  optimizationItems?: {
    name: string;
    description: string;
    count: number;
    price: number;
    pricePerUnit: number;
    totalPrice: number;
    type?: string;
  }[];
  domain?: string;
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
    mobile?: { score: number; };
    usability?: { score: number; };
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
