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

export interface AuditData {
  url: string;
  title: string;
  score: number;
  previousScore: number;
  pageCount: number;
  date: string;
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
}

export interface AuditHistoryData {
  url: string;
  history: {
    date: string;
    score: number;
    pageCount: number;
    issues: {
      critical: number;
      important: number;
      opportunities: number;
    };
  }[];
}
