
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
}

export interface AuditCategoryData {
  score: number;
  items: AuditItemData[];
}

export interface AuditDetailsData {
  performance: AuditCategoryData;
  seo: AuditCategoryData;
  content: AuditCategoryData;
  technical: AuditCategoryData;
}

export interface AuditData {
  score: number;
  date: string;
  issues: AuditIssues;
  details: AuditDetailsData;
}

export interface RecommendationData {
  critical: string[];
  important: string[];
  opportunities: string[];
}
