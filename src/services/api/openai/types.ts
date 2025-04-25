export interface OptimizationOptions {
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  prompt?: string;
  language?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;  // Changed from maxTokens to max_tokens to match the API
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

export interface AISystemOptions {
  autoOptimize: boolean;
  autoFixErrors: boolean;
  contentQuality: 'standard' | 'premium' | 'ultimate';
  maxTokens: number;
  temperature: number;
}
