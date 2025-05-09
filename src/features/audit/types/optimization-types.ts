
/**
 * Consolidated types for optimization functionality
 */

export interface OptimizationItem {
  name: string;
  description: string;
  count: number;
  price: number;
  pricePerUnit: number;
  totalPrice: number;
  type?: string;
}

export interface OptimizationCosts {
  total: number;
  items: OptimizationItem[];
  sitemap?: number;
  metaTags?: number;
  content?: number;
  images?: number;
  performance?: number;
  links?: number;
  structure?: number;
  discountPercentage?: number;
  discountAmount?: number;
  finalTotal?: number;
}

export interface OptimizationMetrics {
  beforeScore: number;
  afterScore: number;
  improvementPercent: number;
  missingMetaDescriptions?: number;
  missingMetaKeywords?: number;
  missingAltTags?: number;
  duplicateMetaTags?: number;
  lowContentPages?: number;
  poorTitleTags?: number;
  poorHeadingStructure?: number;
  slowLoadingPages?: number;
  poorMobileOptimization?: number;
  brokenLinks?: number;
  poorUrlStructure?: number;
  underscoreUrls?: number;
  duplicateContent?: number;
  contentToRewrite?: number;
  totalScore?: number;
  potentialScoreIncrease?: number;
  estimatedCost?: number;
  optimizationItems?: OptimizationItem[];
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

// Adding OptimizationResults for backward compatibility
export interface OptimizationResults {
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
  recommendations: string[];
}

export interface OptimizationProgressState {
  isOptimizing: boolean;
  progress: number;
  stage: string;
  url?: string;
  error?: string;
}

export interface PageContent {
  url: string;
  title: string;
  content: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
  images?: {
    url: string;
    alt: string | null;
  }[];
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  wordCount?: number;
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
  success: boolean;
  message?: string;
  data?: any;
  blob?: Blob;
  beforeScore?: number;
  afterScore?: number;
  demoPage?: PageContent;
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
