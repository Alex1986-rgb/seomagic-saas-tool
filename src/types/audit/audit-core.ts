
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
    critical: any[];
    important: any[];
    opportunities?: any[];
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
  issues?: {
    critical: number;
    important: number;
    opportunities?: number;
  };
  details?: {
    seo: { score: number; };
    performance: { score: number; };
    content: { score: number; };
    technical: { score: number; };
  };
  changes?: number;
  categoryScores?: Record<string, number>;
}

export interface AuditHistoryData {
  url: string;
  items: AuditHistoryItem[];
}

