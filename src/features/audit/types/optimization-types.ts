
// Define optimization types used across the application

export interface OptimizationItem {
  // Core properties
  id: string;
  page: string;
  tasks: string[];
  cost: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  
  // Component-specific properties
  name: string;
  description: string;
  count: number;
  price: number;
  totalPrice: number;
  pricePerUnit?: number;
  type?: string;
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
  // Add missing properties referenced in contentAnalyzer.ts
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
}

export interface OptimizationCosts {
  baseCost: number;
  pagesMultiplier: number;
  pagesCost: number;
  tasksCost: number;
  discounts: number;
  totalCost: number;
}

export interface OptimizationMetrics {
  beforeScore: number;
  afterScore: number;
  improvement: number;
  pageSpeedImprovement: number;
  seoScoreImprovement: number;
}

export interface OptimizationResults {
  costs: OptimizationCosts;
  metrics: OptimizationMetrics;
  items: OptimizationItem[];
}
