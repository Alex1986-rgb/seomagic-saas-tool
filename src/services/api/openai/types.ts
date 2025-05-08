
import { OptimizationOptions as BaseOptimizationOptions } from '@/types/audit/optimization-types';

export type OptimizationOptions = BaseOptimizationOptions;

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
