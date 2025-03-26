
export interface AuditIssues {
  critical: number;
  important: number;
  opportunities: number;
}

export interface AuditItemData {
  id: string;
  title: string;
  description?: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'neutral';
  helpText?: string;
}

export interface AuditCategoryData {
  score: number;
  items: AuditItemData[];
  previousScore?: number;
}

export interface AuditDetailsData {
  performance: AuditCategoryData;
  seo: AuditCategoryData;
  content: AuditCategoryData;
  technical: AuditCategoryData;
}

export interface AuditData {
  id: string;
  score: number;
  date: string;
  issues: AuditIssues;
  details: AuditDetailsData;
  previousScore?: number;
  historyAvailable?: boolean;
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
  issues: AuditIssues;
  details?: {
    performance?: { score?: number };
    seo?: { score?: number };
    content?: { score?: number };
    technical?: { score?: number };
  };
}

export interface AuditHistoryData {
  items: AuditHistoryItem[];
}
