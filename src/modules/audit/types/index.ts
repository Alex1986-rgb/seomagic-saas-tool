export interface Audit {
  id: string;
  user_id: string;
  url: string;
  status: 'pending' | 'scanning' | 'analyzing' | 'completed' | 'failed';
  pages_scanned: number;
  total_pages: number;
  seo_score?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface AuditTask {
  id: string;
  audit_id?: string;
  user_id: string;
  url: string;
  task_type: 'quick' | 'deep';
  status: 'queued' | 'scanning' | 'analyzing' | 'completed' | 'failed' | 'cancelled';
  stage: string;
  progress: number;
  pages_scanned: number;
  estimated_pages: number;
  current_url?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditResult {
  id: string;
  task_id: string;
  audit_id: string;
  user_id: string;
  audit_data: any;
  score: number;
  page_count: number;
  issues_count: number;
  created_at: string;
}

export interface StartAuditOptions {
  maxPages?: number;
  type?: 'quick' | 'deep';
}

export interface AuditStatusResponse {
  task_id: string;
  url: string;
  status: string;
  progress: number;
  pages_scanned: number;
  total_pages: number;
  stage?: string;
  current_url?: string;
  error?: string;
}
