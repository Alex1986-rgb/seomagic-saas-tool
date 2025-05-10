
export interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult?: (result: any) => void;
  setLocalIsOptimized?: (value: boolean) => void;
}

export interface OptimizationItem {
  id: string;  // Changed from optional to required
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

export interface OptimizationResults {
  metrics: any;
  costs: OptimizationCosts;
  recommendations: string[];
  items?: OptimizationItem[];
}

export interface OptimizationProgressState {
  progress: number;
  stage: string;
  message: string;
  isComplete: boolean;
}

export interface OptimizationResponse {
  success: boolean;
  message: string;
  data?: OptimizationResult;
  blob?: Blob;
  beforeScore?: number;
  afterScore?: number;
  demoPage?: PageContent;
}

export interface OptimizationCosts {
  basic: number;
  standard: number;
  premium: number;
  // Additional fields needed by the calculator
  sitemap?: number;
  metaTags?: number;
  content?: number;
  images?: number;
  performance?: number;
  links?: number;
  structure?: number;
  total?: number;
  discountPercentage?: number;
  discountAmount?: number;
  finalTotal?: number;
  totalCost?: number;
  discounts?: number;
  baseCost?: number;
  pagesMultiplier?: number;
  pagesCost?: number;
  tasksCost?: number;
  items?: OptimizationItem[];
}

export interface OptimizationMetrics {
  beforeScore: number;
  afterScore: number;
  improvement?: number;
  pageSpeedImprovement?: number;
  seoScoreImprovement?: number;
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

// Added for backward compatibility 
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
