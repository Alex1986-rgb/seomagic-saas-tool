
export interface OptimizationResult {
  beforeScore: number;
  afterScore: number;
  demoPage?: {
    title: string;
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    optimized?: {
      content: string;
      meta?: {
        description?: string;
        keywords?: string;
      };
    };
  };
}

export interface OptimizationProgressState {
  current: number;
  total: number;
  stage: string;
}

export interface OptimizationItem {
  type: string;
  count: number;
  pricePerUnit: number;
  totalPrice: number;
  description: string;
  name: string;
  price: number;
}
