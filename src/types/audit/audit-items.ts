
export interface AuditItemData {
  id: string;
  title: string;
  description: string;
  status: 'error' | 'warning' | 'good';
  score: number;
  previousScore?: number;
  trend: 'up' | 'down' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  solution?: string;
  recommendation?: string;
  affectedUrls?: string[];
  value?: number | string;
  helpText?: string;
}

