
export interface ExtractedSite {
  domain: string;
  extractedAt: string;
  pageCount: number;
  pages: ExtractedPage[];
}

export interface ExtractedPage {
  url: string;
  title: string;
  content: string;
  html: string | null;
  meta: {
    description: string | null;
    keywords: string | null;
    author: string | null;
    robots: string | null;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: {
    internal: string[];
    external: string[];
  };
  images: {
    url: string;
    alt: string | null;
    title: string | null;
  }[];
  contentAnalysis?: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    duplicateContentRisk: 'low' | 'medium' | 'high';
  };
}

export interface ExtractionOptions {
  includeHtml?: boolean;
  includeText?: boolean;
  includeMetaTags?: boolean;
  includeHeadings?: boolean;
  includeLinks?: boolean;
  includeImages?: boolean;
  maxConcurrent?: number;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  onProgress?: (completed: number, total: number) => void;
}

export interface ContentExtractionProgress {
  completed: number;
  total: number;
  currentUrl?: string;
  isComplete: boolean;
}

export interface SiteAnalysisResult {
  metaTagsQuality: {
    score: number;
    issues: string[];
  };
  headingsStructure: {
    score: number;
    issues: string[];
  };
  internalLinking: {
    score: number;
    issues: string[];
  };
  contentQuality: {
    averageWordCount: number;
    readabilityScore: number;
    issues: string[];
  };
  technicalSeo: {
    score: number;
    issues: string[];
  };
  overall: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  };
}
