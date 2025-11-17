export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
  audits_count?: number;
  reports_count?: number;
}

export interface AdminStats {
  total_users: number;
  total_audits: number;
  total_reports: number;
  active_audits: number;
  completed_audits: number;
  failed_audits: number;
  total_pages_scanned: number;
  average_seo_score: number;
}

export interface ApiLog {
  id: string;
  user_id?: string;
  function_name: string;
  request_data?: any;
  response_data?: any;
  status_code?: number;
  duration_ms?: number;
  created_at: string;
}
