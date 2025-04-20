
export interface OptimizationMetrics {
  missingMetaTags: number;
  duplicateMetaTags: number;
  missingAltTags: number;
  lowContentPages: number;
  poorTitleTags: number;
  poorHeadingStructure: number;
  slowLoadingPages: number;
  poorMobileOptimization: number;
  brokenLinks: number;
  poorUrlStructure: number;
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
}

export interface OptimizationResults {
  metrics: OptimizationMetrics;
  costs: OptimizationCosts;
  recommendations: string[];
}
