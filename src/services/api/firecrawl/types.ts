
import { v4 as uuidv4 } from 'uuid';

export interface CrawlTask {
  id: string;
  url: string;
  domain: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  pages_scanned: number;
  estimated_total_pages: number;
  start_time: string;
  updated_at: string;
  urls?: string[];
  error?: string;
}

export const crawlTasks: CrawlTask[] = [];

export const generateTaskId = (): string => {
  return uuidv4();
};
