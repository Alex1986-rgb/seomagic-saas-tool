
// API Response Types
export interface ScanStatusResponse {
  task_id: string;
  url: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  pages_scanned: number;
  total_pages: number;
  progress: number;
  error: string;
  isLargeSite: boolean;
}

export interface PageStats {
  total: number;
  html: number;
  images: number;
  other: number;
}

export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress?: number;
}

export interface AuditInfo {
  id: string;
  pageCount: number;
  score: number;
  domain: string;
  scanTime: string;
}

export interface OptimizationResult {
  success: boolean;
  message: string;
  cost?: number;
  items?: any[];
}

// Request Types
export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  ignoreRobotsTxt?: boolean;
  followRedirects?: boolean;
}
