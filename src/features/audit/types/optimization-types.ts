
export interface OptimizationItem {
  id: string;
  name: string;
  description: string;
  count: number;
  price: number;
  totalPrice: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  page: string;
  tasks: string[];
  cost: number;
  errorCount: number;
  pricePerUnit?: number;
  type?: string;
}

export interface OptimizationCosts {
  items: OptimizationItem[];
  totalCost: number;
  discountPercentage: number;
  discountAmount: number;
  finalCost: number;
  pageCount: number;
}

export interface OptimizationResults {
  url: string;
  completedAt: string;
  pageCount: number;
  score: {
    before: number;
    after: number;
  };
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
}

export interface OptimizationMetrics {
  fixedIssues: number;
  optimizedPages: number;
  optimizedImages: number;
  totalTime: number; // seconds
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
  beforeScore?: number;
  afterScore?: number;
  improvement?: number;
  pageSpeedImprovement?: number;
  seoScoreImprovement?: number;
}

export interface PageContent {
  url: string;
  title: string;
  content: string;
  metadata: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
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
  message: string;
  data?: {
    optimizedPages: PageContent[];
    totalOptimized: number;
    downloadUrl?: string;
  };
  error?: string;
}

export interface OptimizationOptions {
  url: string;
  maxPages?: number;
  fixAll?: boolean; 
  priorities?: ('high' | 'medium' | 'low')[];
  categories?: string[];
  prompt?: string;
}

export interface OptimizationPlan {
  name: string;
  pagesLimit: number;
  discount: number;
  price: number;
  features: string[];
  workItems: Array<{ name: string; price: number; unit: string }>;
}

export interface BulkDiscountTier {
  threshold: number;
  discountPercentage: number;
}

export interface OptimizationProgressState {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  step: string;
  error?: string;
}

export interface OptimizationProcessContainerProps {
  url?: string;
  progress?: number;
  setOptimizationResult?: (result: any) => void;
  setLocalIsOptimized?: (isOptimized: boolean) => void;
}
