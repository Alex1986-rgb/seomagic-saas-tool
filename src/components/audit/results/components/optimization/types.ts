
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
  progress: number;
  stage: string;
}
