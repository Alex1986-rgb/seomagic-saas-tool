
import { PageData } from '../crawlerService';

export interface OptimizationOptions {
  optimizeMetaTags: boolean;
  optimizeHeadings: boolean;
  optimizeContent: boolean;
  optimizeImages: boolean;
  language: string;
  prompt?: string;
  temperature?: number;
  model?: string;
}

export interface OptimizationResult {
  title: string | null;
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

