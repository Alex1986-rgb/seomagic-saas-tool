
import { CategoryData } from './category-data';

export interface AuditDetailsData {
  seo: CategoryData;
  content: CategoryData;
  performance: CategoryData;
  technical: CategoryData;
  mobile: CategoryData;
  usability: CategoryData;
}

export interface IssuesData {
  critical: number;
  important: number;
  minor: number;
  passed: number;
  opportunities?: string[];
}

