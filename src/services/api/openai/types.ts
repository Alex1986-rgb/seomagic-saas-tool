
export interface OptimizationOptions {
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  prompt?: string;
  language?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;  // Keeping snake_case version for API compatibility
  maxTokens?: number;   // Keeping camelCase version for TypeScript compatibility
  contentQuality?: 'standard' | 'premium' | 'ultimate';
}
