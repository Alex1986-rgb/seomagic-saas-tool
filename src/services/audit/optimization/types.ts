
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
  underscoreUrls: number;
  duplicateContent: number;
  contentToRewrite: number;
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
