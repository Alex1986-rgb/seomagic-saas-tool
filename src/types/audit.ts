export interface AuditItemData {
  title: string;
  description: string;
  status: 'good' | 'warning' | 'error';
  details?: string;
}

export interface AuditCategoryData {
  score: number;
  previousScore?: number;
  items: AuditItemData[];
}

export interface AuditData {
  id: string;
  url: string;
  date: string;
  score: number;
  previousScore?: number;
  issues: number;
  details: {
    seo: AuditCategoryData;
    performance: AuditCategoryData;
    content: AuditCategoryData;
    technical: AuditCategoryData;
  };
}

export interface RecommendationData {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AuditHistoryItem {
  id: string;
  date: string;
  score: number;
}

export interface AuditHistoryData {
  items: AuditHistoryItem[];
}
