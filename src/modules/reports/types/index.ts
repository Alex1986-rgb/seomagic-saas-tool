export interface Report {
  id: string;
  user_id: string;
  task_id?: string;
  url: string;
  file_path: string;
  report_title?: string;
  company_name?: string;
  file_size?: number;
  sections_included?: ReportSection[] | any;
  downloaded_count: number;
  last_downloaded_at?: string;
  created_at: string;
}

export interface ReportSection {
  name: string;
  included: boolean;
}

export interface ReportGenerationOptions {
  sections?: string[];
  format?: 'pdf' | 'excel' | 'json';
  includeCharts?: boolean;
  companyName?: string;
  reportTitle?: string;
}
