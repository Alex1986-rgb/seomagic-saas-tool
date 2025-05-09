
/**
 * Типы данных для оптимизации сайта
 */

import { 
  OptimizationItem as BaseOptimizationItem,
  PageContent as BasePageContent
} from '@/features/audit/types/optimization-types';

// Re-export types from the central type definitions
export type OptimizationItem = BaseOptimizationItem;
export type PageContent = BasePageContent;

export interface OptimizationMetrics {
  missingMetaDescriptions: number;
  missingMetaKeywords: number;
  missingAltTags: number;
  duplicateMetaTags: number;
  lowContentPages: number;
  poorTitleTags: number;
  poorHeadingStructure: number;
  slowLoadingPages: number;
  poorMobileOptimization: number;
  brokenLinks: number;
  poorUrlStructure: number;
  underscoreUrls?: number;
  duplicateContent?: number;
  contentToRewrite?: number;
  totalScore: number;
  potentialScoreIncrease: number;
  estimatedCost: number;
  optimizationItems: OptimizationItem[];
}

export interface OptimizationResponse {
  blob: Blob;
  beforeScore: number;
  afterScore: number;
  demoPage?: PageContent;
}

export interface OptimizationCosts {
  sitemap: number;
  metaTags: number;
  content: number;
  images: number;
  performance: number;
  links: number;
  structure: number;
  total: number;
  discountPercentage?: number;
  discountAmount?: number;
  finalTotal?: number;
}

export interface PageStatistics {
  totalPages: number;
  indexablePages: number;
  blockedPages: number;
  brokenLinks: number;
  averageLoadTime: number;
  totalWordCount: number;
  averageWordCount: number;
}

export interface OptimizationResults {
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
  recommendations: string[];
}
