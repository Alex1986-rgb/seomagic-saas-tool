// Define optimization types used across the application

export interface OptimizationItem {
  // Required core properties
  id: string;
  page: string;
  tasks: string[];
  cost: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  
  // Required display properties 
  name: string;
  description: string;
  count: number;
  price: number;
  totalPrice: number;
  
  // Optional properties
  pricePerUnit?: number;
  type?: string;
  errorCount?: number;
}

export interface OptimizationProgressState {
  totalPages: number;
  optimizedPages: number;
  currentPage: string;
  currentTask: string;
  progress: number;
}

export interface OptimizationResult {
  beforeScore: number;
  afterScore: number;
  improvements: string[];
}

export interface PageContent {
  url: string;
  title: string;
  content: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
  // Add all properties needed in contentAnalyzer.ts
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
  blob: Blob;
  beforeScore: number;
  afterScore: number;
  demoPage?: PageContent;
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
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  fixMeta?: boolean;
  fixHeadings?: boolean;
  generateSitemap?: boolean;
  optimizeContentSeo?: boolean;
  maxTokens?: number;
  temperature?: number;
  max_tokens?: number;
  contentQuality?: string | 'standard' | 'premium' | 'ultimate';
  language?: string;
  model?: string;
  prompt?: string;
}

export interface OptimizationCosts {
  baseCost: number;
  pagesMultiplier: number;
  pagesCost: number;
  tasksCost: number;
  discounts: number;
  totalCost: number;
  total?: number;
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
  items?: OptimizationItem[];
}

export interface OptimizationMetrics {
  beforeScore: number;
  afterScore: number;
  improvement: number;
  pageSpeedImprovement: number;
  seoScoreImprovement: number;
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
  improvementPercent?: number;
}

export interface OptimizationResults {
  costs: OptimizationCosts;
  metrics: OptimizationMetrics;
  items: OptimizationItem[];
  recommendations?: string[];
}
