
// Export core interfaces from audit.d.ts
import type { 
  AuditData,
  AuditDetailsData,
  CategoryData,
  AuditItemData,
  IssuesData,
  AuditHistoryItem,
  AuditHistoryData 
} from './audit/audit-core';

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
