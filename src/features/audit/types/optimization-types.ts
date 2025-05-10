
export interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult?: (result: any) => void;
  setLocalIsOptimized?: (value: boolean) => void;
}

export interface OptimizationItem {
  id?: string;
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
  progress: number;
  stage: string;
  message: string;
  isComplete: boolean;
}

export interface OptimizationResponse {
  success: boolean;
  message: string;
  data?: OptimizationResults;
}

export interface OptimizationCosts {
  basic: number;
  standard: number;
  premium: number;
}
