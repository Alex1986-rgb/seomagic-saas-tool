/**
 * Типы данных для оптимизации сайта
 */

export interface PageContent {
  url: string;
  title: string;
  meta: {
    description: string | null;
    keywords: string | null;
  };
  content: string;
  images: {
    url: string;
    alt: string | null;
  }[];
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  wordCount: number;
  optimized?: {
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    score?: number;
  };
}

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
  totalScore: number;
  potentialScoreIncrease: number;
  estimatedCost: number;
  optimizationItems: OptimizationItem[];
}

export interface OptimizationItem {
  name: string;
  description: string;
  count: number;
  price: number;
  totalPrice: number;
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
