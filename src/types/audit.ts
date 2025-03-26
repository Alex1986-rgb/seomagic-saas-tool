
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
  issues: {
    critical: number;
    important: number;
    opportunities: number;
  };
  pageCount?: number;
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
  url?: string;
  issues?: {
    critical: number;
    important: number;
    opportunities: number;
  };
  pageCount?: number;
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

export interface ScanOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks?: boolean;
  checkMobile?: boolean;
  analyzeSEO?: boolean;
  analyzePerformance?: boolean;
  onProgress?: (pagesScanned: number, totalPages: number, currentUrl: string) => void;
}

export interface PageScanResult {
  url: string;
  statusCode: number;
  title: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  metaTags: {
    description?: string;
    keywords?: string;
    robots?: string;
    viewport?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
  };
  links: {
    internal: string[];
    external: string[];
  };
  images: {
    withAlt: number;
    withoutAlt: number;
    totalSize: number;
  };
  performance: {
    documentSize: number;
    loadTime?: number;
    resourceCount: number;
  };
  errors: string[];
  warnings: string[];
}

export interface WebsiteScanResult {
  domain: string;
  pagesScanned: number;
  startTime: string;
  endTime: string;
  pageResults: PageScanResult[];
  summary: {
    averageScore: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
    passedChecks: number;
  };
}
