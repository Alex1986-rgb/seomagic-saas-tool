
// Simple types without self-references to avoid deep type instantiation
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Array<JsonValue>;
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Core analytics data structure
export interface AnalyticsData {
  id?: string;
  project_id?: string | null;
  url: string;
  score: number;
  pages_scanned?: number | null;
  positions_tracked?: number | null;
  active_users?: number | null;
  trends?: JsonValue | null;
  distribution?: JsonValue | null;
  created_at?: string | null;
}

// Task data structure
export interface CrawlTaskData {
  id?: string;
  task_id: string;
  project_id?: string | null;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number | null;
  pages_scanned?: number | null;
  estimated_total_pages?: number | null;
  options?: JsonValue | null;
  start_time?: string | null;
  updated_at?: string | null;
}

// Result data structure
export interface CrawlResultData {
  id?: string;
  task_id: string;
  project_id?: string | null;
  urls: string[];
  page_count: number;
  created_at?: string;
  page_types?: JsonValue | null;
  depth_data?: JsonValue | null;
  broken_links?: JsonValue | null;
  duplicate_pages?: JsonValue | null;
}

// Configuration options
export interface MassiveCrawlOptions {
  maxPages: number;
  maxDepth: number;
  followExternalLinks: boolean;
  crawlSpeed: 'slow' | 'medium' | 'fast';
  includeMedia: boolean;
  userAgent?: string;
  respectRobotsTxt: boolean;
}

export interface CrawlStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  pagesScanned: number;
  estimatedTotalPages: number;
  startTime: string;
  lastUpdated: string;
}
