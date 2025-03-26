
export interface AuditItemData {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'error';
  details?: string;
  value?: number | string;
  trend?: 'up' | 'down' | 'neutral';
  helpText?: string;
}

export interface AuditCategoryData {
  score: number;
  previousScore?: number;
  items: AuditItemData[];
}

export interface AuditDetailsData {
  seo: AuditCategoryData;
  performance: AuditCategoryData;
  content: AuditCategoryData;
  technical: AuditCategoryData;
}

export interface AuditData {
  id: string;
  url: string;
  date: string;
  score: number;
  previousScore?: number;
  issues: number;
  details: AuditDetailsData;
}

export interface RecommendationData {
  critical: string[];
  important: string[];
  opportunities: string[];
}

export interface AuditHistoryItem {
  id: string;
  date: string;
  score: number;
  issues?: number;
  details?: {
    seo?: { score: number };
    performance?: { score: number };
    content?: { score: number };
    technical?: { score: number };
  };
}

export interface AuditHistoryData {
  items: AuditHistoryItem[];
}
