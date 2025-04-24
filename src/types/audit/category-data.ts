
import { AuditItemData } from './audit-items';

export interface CategoryData {
  score: number;
  passed: number;
  warning: number;
  failed: number;
  previousScore?: number;
  items: AuditItemData[];
  name?: string;
  description?: string;
  id?: string;
}

export interface AuditCategoryData {
  id?: string;
  name: string;
  description: string;
  score: number;
  previousScore?: number;
  items: AuditItemData[];
  passed: number;
  warning: number;
  failed: number;
}

