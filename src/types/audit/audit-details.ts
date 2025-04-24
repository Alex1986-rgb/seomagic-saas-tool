
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
  critical: string[]; // Changed from number to string[]
  important: string[]; // Changed from number to string[]
  minor: number;
  passed: number;
  opportunities: string[]; // Added opportunities property
}
