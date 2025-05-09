
export interface OptimizationItem {
  name: string;
  description: string;
  count: number;
  price: number;
  pricePerUnit?: number;
  totalPrice: number;
  type?: 'base' | 'critical' | 'warning' | 'technical' | 'content' | 'additional';
}

export interface OptimizationResult {
  success: boolean;
  message: string;
  taskId?: string;
  cost?: number;
  completionTime?: string;
}

export interface OptimizationProgressState {
  stage: 'analyzing' | 'optimizing' | 'finalizing' | 'completed' | 'failed';
  progress: number;
  message: string;
  error?: string;
}
