
export interface OptimizationItem {
  id: string;
  name: string;
  description: string;
  pagesCount?: number;
  count?: number;
  costPerPage?: number;
  price?: number;
  totalCost?: number;
  totalPrice?: number;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  page?: string;
  tasks?: string[];
  cost?: number;
  errorCount?: number;
  type?: string;
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
  totalScore: number;
  potentialScoreIncrease: number;
  estimatedCost: number;
  optimizationItems?: OptimizationItem[];
}

export interface OptimizationCosts {
  baseCost: number;
  pagesMultiplier: number;
  pagesCost: number;
  tasksCost: number;
  discounts: number;
  totalCost: number;
  total: number;
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

export interface PageContent {
  url: string;
  title: string;
  metaDescription?: string;
  metaKeywords?: string;
  h1?: string;
  content?: string;
  imageCount?: number;
  imagesWithoutAlt?: number;
  wordCount?: number;
}

export interface OptimizationResults {
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
  items: OptimizationItem[];
  recommendations: string[];
}

export interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult: (result: any) => void;
  setLocalIsOptimized: (isOptimized: boolean) => void;
}
