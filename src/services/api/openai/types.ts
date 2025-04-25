
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

export interface OptimizationResult {
  title: string;
  metaTags: {
    description: string | null;
    keywords: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  optimizedHtml: string | null;
  suggestions: string[];
}
