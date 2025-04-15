
export interface TaskResponse {
  task_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  pages_scanned?: number;
  total_pages?: number;
  estimated_completion?: string;
  error?: string;
}

export interface OptimizationItem {
  name: string;
  count: number;
  price: number;
}

export interface OptimizationResponse {
  items: OptimizationItem[];
  discount?: number;
  total: number;
}

export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
}

export interface PageStats {
  totalPages: number;
  indexablePages: number;
  nonIndexablePages: number;
  brokenLinks: number;
  externalLinks: number;
  duplicateContent: number;
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
}
