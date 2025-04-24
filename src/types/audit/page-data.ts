
export interface PageData {
  url: string;
  title: string | null;
  html: string;
  content: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  metaTags: {
    description: string | null;
    keywords: string | null;
  };
  links: {
    internal: string[];
    external: string[];
  };
  images: {
    url: string;
    alt: string | null;
    size?: number;
  }[];
  issues: {
    critical: string[];
    important: string[];
    opportunities: string[];
  };
}

