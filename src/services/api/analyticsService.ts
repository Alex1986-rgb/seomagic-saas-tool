
import { supabase } from '@/integrations/supabase/client';
import type { AnalyticsData } from './types/firecrawl';
import { mockDataGenerator } from './utils/mockDataGenerator';

export const analyticsService = {
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
