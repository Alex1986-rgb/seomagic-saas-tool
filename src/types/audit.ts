
import { CategoryData } from './audit';

export interface AuditDetailsData {
  seo: CategoryData;
  content: CategoryData;
  performance: CategoryData;
  technical: CategoryData;
  mobile: CategoryData;
  usability: CategoryData; // Add the missing usability property
}
