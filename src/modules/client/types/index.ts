export interface ClientProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDashboardStats {
  total_audits: number;
  completed_audits: number;
  total_reports: number;
  average_seo_score: number;
  recent_audits: any[];
}
