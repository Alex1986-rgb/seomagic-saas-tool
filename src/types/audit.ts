
export interface AuditData {
  id: string;
  url: string;
  domain: string;
  score: number;
  pageCount?: number;
  scanTime: string;
  issues: {
    critical: AuditIssue[];
    important: AuditIssue[];
    opportunities: AuditIssue[];
    minor: AuditIssue[];
    passed: AuditCheck[];
  };
}

export interface AuditIssue {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface AuditCheck {
  title: string;
  description: string;
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  score: number;
  date: string;
  pageCount?: number;
}

export interface AuditHistoryData {
  url: string;
  items: AuditHistoryItem[];
}
