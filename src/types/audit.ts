
// Export core interfaces from audit.d.ts
import type { 
  AuditData,
  AuditHistoryItem,
  AuditHistoryData 
} from './audit/audit-core';

// Import from specific modules to avoid conflicts
import type { AuditDetailsData } from './audit/audit-details';
import type { CategoryData } from './audit/category-data';
import type { AuditItemData } from './audit/audit-items';
import type { IssuesData } from './audit/audit-details';
import type { RecommendationData } from './audit/recommendations';

export interface AuditIssue {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AuditCheck {
  title: string;
  description: string;
}

// Export all the imported types
export type {
  AuditData,
  AuditDetailsData,
  CategoryData,
  AuditItemData,
  IssuesData,
  AuditHistoryItem,
  AuditHistoryData,
  RecommendationData
};

// Export CrawlOptions interfaces
export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  respectRobots?: boolean;
  followExternalLinks?: boolean;
  includeImages?: boolean;
  timeout?: number;
  userAgent?: string;
}

export interface OptimizationOptions {
  includeImages?: boolean;
  optimizationLevel?: 'basic' | 'standard' | 'advanced';
  targetPageSpeed?: number;
  minifyCode?: boolean;
  compressImages?: boolean;
}
