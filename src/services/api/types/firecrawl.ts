
// Simple types without self-references to avoid deep type instantiation
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Supabase compatible JSON type for database operations
export type Json = JsonValue;

// Core analytics data structure
export interface AnalyticsData {
  id?: string;
  project_id?: string | null;
  url: string;
  score: number;
  pages_scanned?: number | null;
  positions_tracked?: number | null;
  active_users?: number | null;
  trends?: Json;
  distribution?: Json;
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
  options?: Json;
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
  page_types?: Json;
  depth_data?: Json;
  broken_links?: Json;
  duplicate_pages?: Json;
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
