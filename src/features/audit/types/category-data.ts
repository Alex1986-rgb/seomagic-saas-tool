
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
