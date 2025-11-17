export interface OptimizationJob {
  id: string;
  task_id: string;
  user_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  options: OptimizationOptions | any;
  result_data?: OptimizationResult | any;
  cost: number;
  created_at: string;
  updated_at: string;
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
  contentQuality?: 'standard' | 'premium' | 'ultimate';
  language?: string;
}

export interface OptimizationResult {
  optimized_pages: number;
  improvements: OptimizationImprovement[];
  total_cost: number;
  estimated_score_improvement: number;
}

export interface OptimizationImprovement {
  page_url: string;
  changes: string[];
  before_score: number;
  after_score: number;
}

export interface OptimizationItem {
  name: string;
  description: string;
  count: number;
  price: number;
  pricePerUnit: number;
  totalPrice: number;
  type?: string;
}

export interface OptimizationMetrics {
  totalCost: number;
  items: OptimizationItem[];
  estimatedTime: string;
}
