
import { supabase } from '@/integrations/supabase/client';
import type { CrawlTaskData, CrawlResultData, AnalyticsData } from './types/firecrawl';
import { mockDataGenerator } from './utils/mockDataGenerator';

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
    status: 'processing' | 'completed' | 'failed'
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
      created_at: new Date().toISOString()
    };
    
    await supabase.from('crawl_results').insert(crawlResultData);
  },

  async saveAnalytics(projectId: string | undefined, websiteUrl: string, pagesScanned: number): Promise<void> {
    const analyticsData: AnalyticsData = {
      project_id: projectId,
      url: websiteUrl,
      score: Math.floor(Math.random() * 30) + 70,
      pages_scanned: pagesScanned,
      positions_tracked: Math.floor(pagesScanned * 0.8),
      active_users: Math.floor(Math.random() * 1000) + 500,
      trends: mockDataGenerator.generateTrends(),
      distribution: mockDataGenerator.generateDistribution(pagesScanned)
    };
    
    await supabase.from('analytics').insert(analyticsData);
  }
};
