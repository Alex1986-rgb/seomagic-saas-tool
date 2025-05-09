
/**
 * Типы данных для оптимизации сайта
 */

// Define comprehensive OptimizationItem type that works with all components
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
  beforeScore?: number;
  afterScore?: number;
  improvementPercent?: number;
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
  items?: OptimizationItem[];
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
  content: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
  // Add all required properties
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
