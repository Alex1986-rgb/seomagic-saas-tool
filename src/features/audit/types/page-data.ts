
export interface PageData {
  url: string;
  title: string;
  meta: {
    description?: string;
    keywords?: string;
  };
  content?: string;
  score?: number;
  issues?: string[];
  lastModified?: string;
  status?: number;
  contentLength?: number;
}

export interface PageAnalysisData {
  url: string;
  title: string;
  scoreDetails: {
    seo: number;
    performance: number;
    content: number;
    technical: number;
  };
  totalScore: number;
  status: 'success' | 'warning' | 'error' | 'info';
  issueCount: number;
  lastChecked: string;
}
