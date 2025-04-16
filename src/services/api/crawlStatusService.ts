
import { supabase } from '@/integrations/supabase/client';
import type { CrawlResultData, Json } from './types/firecrawl';

export const crawlStatusService = {
  async getUrlFromTaskId(taskId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('crawl_tasks')
        .select('url')
        .eq('task_id', taskId)
        .single();
        
      if (error || !data) {
        return null;
      }
      
      return data.url;
    } catch (error) {
      console.error('Error getting URL from taskId:', error);
      return null;
    }
  },

  async updateTaskProgress(
    taskId: string,
    progress: number,
    pagesScanned: number,
    status: 'pending' | 'processing' | 'completed' | 'failed'
  ): Promise<void> {
    const taskUpdateData = {
      status,
      progress: Math.floor(progress),
      pages_scanned: pagesScanned,
      estimated_total_pages: Math.floor(pagesScanned * 1.5),
      updated_at: new Date().toISOString()
    };
    
    await supabase.from('crawl_tasks').update(taskUpdateData).eq('task_id', taskId);
  },

  async saveCrawlResults(taskId: string, projectId: string | undefined, urls: string[], pagesScanned: number): Promise<void> {
    const crawlResultData: CrawlResultData = {
      task_id: taskId,
      project_id: projectId,
      urls,
      page_count: pagesScanned,
      created_at: new Date().toISOString(),
      page_types: {} as Json,
      depth_data: {} as Json,
      broken_links: [] as Json,
      duplicate_pages: [] as Json
    };
    
    await supabase.from('crawl_results').insert(crawlResultData);
  }
};
