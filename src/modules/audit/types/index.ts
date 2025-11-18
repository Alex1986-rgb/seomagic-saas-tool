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
  // Performance metrics (Sprint 3)
  avg_load_time_ms?: number;
  success_rate?: number;
  redirect_pages_count?: number;
  error_pages_count?: number;
  total_urls?: number;
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
  
  // Weighted scores (Sprint 2)
  global_score?: number;
  seo_score?: number;
  technical_score?: number;
  content_score?: number;
  performance_score?: number;
  
  // Percentage metrics (Sprint 2)
  pct_missing_title?: number;
  pct_missing_h1?: number;
  pct_missing_description?: number;
  pct_missing_canonical?: number;
  pct_not_indexable?: number;
  pct_thin_content?: number;
  pct_slow_pages?: number;
  
  // Redirect metrics (Sprint 3)
  pct_pages_with_redirects?: number;
  pct_long_redirect_chains?: number;
  
  // Distribution data
  pages_by_type?: Record<string, number>;
  pages_by_depth?: Record<string, number>;
  issues_by_severity?: Record<string, number>;
}

export interface PageAnalysis {
  id: string;
  audit_id: string;
  url: string;
  title?: string;
  meta_description?: string;
  
  // Basic metrics
  status_code?: number;
  load_time?: number;
  ttfb?: number;
  content_length?: number;
  transfer_size?: number;
  
  // Redirect data (Sprint 3)
  redirect_chain_length: number;
  final_url?: string;
  
  // Compression (Sprint 3)
  is_compressed: boolean;
  compression_type?: string;
  
  // SEO metrics
  h1_count: number;
  h1_text?: string;
  h2_count: number;
  h3_count: number;
  image_count: number;
  missing_alt_images_count: number;
  word_count: number;
  
  // Technical metrics
  depth: number;
  is_indexable: boolean;
  has_canonical: boolean;
  canonical_url?: string;
  has_viewport: boolean;
  
  // Content quality
  has_thin_content: boolean;
  text_html_ratio?: number;
  
  // Links
  internal_links_count: number;
  external_links_count: number;
  
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
  estimated_pages?: number;
  stage?: string;
  current_url?: string;
  error?: string;
  audit_data?: any;
}
