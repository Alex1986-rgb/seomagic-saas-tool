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

export interface IssuesData {
  critical: number;
  important: number;
  minor: number;
  passed: number;
}

export interface CategoryData {
  score: number;
  passed: number;
  warning: number;
  failed: number;
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  date: string;
  score: number;
  changes?: number;
  categoryScores?: Record<string, number>;
}
