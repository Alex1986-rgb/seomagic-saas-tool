
/**
 * Type definitions for API requests and responses
 */

// Scan Details returned by the API
export type ScanDetails = {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress?: number;
  status?: string;
  audit_data?: any;
};

// Page statistics from the scan
export interface PageStats {
  total: number;
  scanned: number;
  withIssues: number;
  withWarnings: number;
  withErrors: number;
}

// API response for optimization 
export interface OptimizationApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  cost?: number;
}

// API response for sitemap generation
export interface SitemapResponse {
  success: boolean;
  url?: string;
  error?: string;
  format?: string;
}

// API response for scan status
export interface ScanStatusResponse {
  task_id: string;
  url: string;
  status: string;
  progress: number;
  pages_scanned: number;
  total_pages: number;
  error?: string;
}

// API response for export operations
export interface ExportResponse {
  success: boolean;
  url?: string;
  blob?: Blob;
  error?: string;
}
