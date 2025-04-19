
export interface CrawlOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  userAgent: string;
  checkImages: boolean;
  checkPerformance: boolean;
}

export interface ScanOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  onProgress?: (progress: number, total: number, url: string) => void;
}

export interface OptimizationOptions {
  optimizeMetaTags: boolean;
  optimizeHeadings: boolean;
  optimizeContent: boolean;
  optimizeImages: boolean;
  language: string;
  prompt?: string;
  temperature?: number;
  model?: string;
}

export interface AuditItemData {
  id: string;
  title: string;
  description: string;
  status: 'error' | 'warning' | 'good';
  score: number;
  previousScore?: number;
  trend: 'up' | 'down' | 'same';
  impact: 'high' | 'medium' | 'low';
  solution?: string;
  recommendation?: string;
  affectedUrls?: string[];
}

export interface CategoryData {
  score: number;
  previousScore?: number;
  items: AuditItemData[];
  passed: number;
  warning: number;
  failed: number;
}

export interface AuditCategoryData extends CategoryData {
  id: string;
  name: string;
  description: string;
}

export interface AuditDetailsData {
  seo: CategoryData;
  content: CategoryData;
  performance: CategoryData;
  technical: CategoryData;
  mobile: CategoryData; 
}

export interface IssuesData {
  critical: number;
  important: number;
  minor: number;
  passed: number;
}

export interface AuditHistoryItem {
  id: string;
  date: string;
  score: number;
  pageCount: number;
  url: string;
  issues: {
    critical: number;
    important: number;
    opportunities: number;
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

export interface AuditData {
  id: string;
  url: string;
  title: string;
  score: number;
  previousScore?: number;
  pageCount: number;
  date: string;
  status: 'completed' | 'in-progress' | 'failed';
  issues: {
    critical: string[];
    important: string[];
    opportunities: string[];
  };
  pageSpeed: {
    desktop: number;
    mobile: number;
  };
  mobileFriendliness: number;
  security: number;
  technologies: string[];
  structuredData: string[];
  contentQuality: number;
  keywords: string[];
  competitors: string[];
  backlinks: number;
  socialShares: number;
  traffic: number;
  organicTraffic: number;
  paidTraffic: number;
  bounceRate: number;
  timeOnSite: number;
  demographics: {
    age: string;
    gender: string;
    location: string;
  };
  deviceTypes: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  details: AuditDetailsData;
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

export interface PageData {
  url: string;
  title: string | null;
  html: string;
  content: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  metaTags: {
    description: string | null;
    keywords: string | null;
  };
  links: {
    internal: string[];
    external: string[];
  };
  images: {
    url: string;
    alt: string | null;
    size?: number;
  }[];
  issues: {
    critical: string[];
    important: string[];
    opportunities: string[];
  };
}
