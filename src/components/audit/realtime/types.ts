export interface FlowNode {
  id: string;
  label: string;
  icon: string;
  status: 'idle' | 'active' | 'completed' | 'error';
  progress: number;
  metrics?: {
    value: number;
    label: string;
    trend?: 'up' | 'down';
  }[];
}

export interface AuditStage {
  id: 'discovery' | 'fetching' | 'analysis' | 'generating' | 'completed' | 'queued';
  label: string;
  icon: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'error';
}

export interface Issue {
  type: string;
  description: string;
  severity: 'error' | 'warning' | 'good';
  url: string;
  timestamp: Date;
}

export interface AuditMetrics {
  pagesScanned: number;
  totalPages: number;
  processingSpeed: number;
  avgLoadTime: number;
  currentUrl: string;
  errors: number;
  warnings: number;
  passed: number;
}
