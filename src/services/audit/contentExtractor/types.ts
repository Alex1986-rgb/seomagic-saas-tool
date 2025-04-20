
export interface ExtractedPage {
  url: string;
  title: string;
  content: string;
  html: string;
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
}

export interface ExtractionOptions {
  includeHtml?: boolean;
  includeText?: boolean;
  includeMetaTags?: boolean;
  includeHeadings?: boolean;
  includeLinks?: boolean;
  includeImages?: boolean;
  maxPages?: number;
}

export interface ExtractedSite {
  domain: string;
  extractedAt: string;
  pageCount: number;
  pages: ExtractedPage[];
}
