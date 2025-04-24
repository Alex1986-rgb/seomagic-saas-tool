
export interface AuditData {
  id: string;
  url: string;
  date: string;
  score: number;
  issues: IssuesData;
  details: AuditDetailsData;
  pageCount?: number;
  crawledPages?: number;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface AuditDetailsData {
  seo: CategoryData;
  content: CategoryData;
  performance: CategoryData;
  technical: CategoryData;
  mobile: CategoryData;
  usability: CategoryData;
}

export interface CategoryData {
  score: number;
  passed: number;
  warning: number;
  failed: number;
  previousScore?: number;
  items: AuditItemData[];
  name?: string;
  description?: string;
  id?: string; // Add id property to match AuditCategoryData
}

export interface AuditItemData {
  id: string;
  title: string;
  description: string;
  status: 'error' | 'warning' | 'good';
  score: number;
  previousScore?: number;
  trend: 'up' | 'down' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  solution?: string;
  recommendation?: string;
  affectedUrls?: string[];
  value?: number | string;
  helpText?: string;
}

export interface IssuesData {
  critical: number;
  important: number;
  minor: number;
  passed: number;
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  date: string;
  score: number;
  changes?: number;
  categoryScores?: Record<string, number>;
}
