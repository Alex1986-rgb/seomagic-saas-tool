/**
 * Consolidated types for optimization functionality
 */

export interface OptimizationItem {
  id?: string;
  page?: string;
  tasks?: string[];
  cost?: number;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  name: string;
  description: string;
  count: number;
  price: number;
  pricePerUnit?: number;
  totalPrice: number;
  type?: string;
  errorCount?: number;
}

export interface OptimizationOptions {
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
  includeImages?: boolean;
  optimizationLevel?: 'basic' | 'standard' | 'advanced';
  targetPageSpeed?: number;
  minifyCode?: boolean;
  compressImages?: boolean;
}

export interface OptimizationResult {
  beforeScore: number;
  afterScore: number;
  demoPage?: {
    title: string;
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    optimized?: {
      content: string;
      meta?: {
        description?: string;
        keywords?: string;
      };
    };
  };
}

export interface OptimizationProgressState {
  progress: number;
  stage: string;
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
  underscoreUrls?: number;
  duplicateContent?: number;
  contentToRewrite?: number;
  totalScore: number;
  potentialScoreIncrease: number;
  estimatedCost: number;
  optimizationItems: OptimizationItem[];
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

export interface OptimizationResponse {
  blob: Blob;
  beforeScore: number;
  afterScore: number;
  demoPage?: PageContent;
}
