
export interface OptimizationOptions {
  optimizeMetaTags?: boolean;
  optimizeHeadings?: boolean;
  optimizeContent?: boolean;
  optimizeImages?: boolean;
  prompt?: string;
  language?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;  // This is the correct name as per previous fixes
  maxTokens?: number;   // Adding this as an alias to maintain compatibility
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
