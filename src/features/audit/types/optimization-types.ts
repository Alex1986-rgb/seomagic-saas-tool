
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
}

export interface OptimizationMetrics {
  beforeScore: number;
  afterScore: number;
  improvementPercent: number;
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
}

export interface OptimizationResponse {
  success: boolean;
  message?: string;
  data?: any;
}
