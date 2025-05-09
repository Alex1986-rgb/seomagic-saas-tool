
export interface AuditData {
  id: string;
  url: string;
  date: string;
  score: number;
  previousScore?: number;
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
  id?: string;
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
  critical: string[] | any[];
  important: string[] | any[];
  opportunities: string[] | any[];
  minor: number | any[]; // Can be number or array of objects
  passed?: number | any[]; // Can be number or array of objects
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  date: string;
  score: number;
  changes?: number;
  categoryScores?: Record<string, number>;
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
}

export interface AuditHistoryData {
  url: string;
  items: AuditHistoryItem[];
}

export interface RecommendationData {
  url: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  affectedAreas: string[];
  estimatedEffort: string;
  potentialImpact: string;
  status: string;
  details: string;
  resources: string[];
  critical: string[];
  important: string[];
  opportunities: string[];
}
