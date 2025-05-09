
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

// Import OptimizationItem from features path to re-export
import type { OptimizationItem } from '@/features/audit/types/optimization-types';

export interface AuditIssue {
  id?: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AuditCheck {
  id?: string;
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
  RecommendationData,
  OptimizationItem
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
  ignoreRobotsTxt?: boolean;
  followRedirects?: boolean;
}

export interface OptimizationOptions {
  includeImages?: boolean;
  optimizationLevel?: 'basic' | 'standard' | 'advanced';
  targetPageSpeed?: number;
  minifyCode?: boolean;
  compressImages?: boolean;
  fixMetaTags?: boolean;
  improveContent?: boolean;
  fixLinks?: boolean;
  improveStructure?: boolean;
  optimizeSpeed?: boolean;
  maxTokens?: number;
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  temperature?: number;
  max_tokens?: number;
  contentQuality?: string | 'standard' | 'premium' | 'ultimate';
  language?: string;
  model?: string;
  prompt?: string;
}

// Add API types that might be needed elsewhere
export interface ScanStatusResponse {
  task_id: string;
  url: string;
  status: string;
  progress: number;
  pages_scanned: number;
  total_pages: number;
  error?: string;
}

export interface OptimizationResult {
  url: string;
  score_before: number;
  score_after: number;
  improvements: string[];
  content: {
    before: string;
    after: string;
  };
  metadata: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  completion_time: string;
}
