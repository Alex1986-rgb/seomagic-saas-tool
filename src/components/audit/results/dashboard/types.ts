export interface DashboardMetrics {
  totalScore: number;
  seoScore: number;
  technicalScore: number;
  performanceScore: number;
  contentScore: number;
  mobileScore: number;
  usabilityScore: number;
  totalPages: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  passedChecks: number;
  scanDuration?: string;
}

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'good';
  category: string;
  affectedPages: string[];
  solution?: string;
}

export interface PageAnalysisRow {
  url: string;
  title: string;
  statusCode: number;
  loadTime: number;
  wordCount: number;
  imageCount: number;
  h1Count: number;
  issuesCount: number;
  issues: IssueItem[];
  score: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export type ViewMode = 'dashboard' | 'pdf-preview' | 'list';
