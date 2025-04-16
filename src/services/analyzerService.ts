
import { supabase } from '@/integrations/supabase/client';
import { DeepCrawlerCore } from './audit/crawler/deepCrawlerCore';

export interface AnalyticsData {
  score: number;
  pagesScanned: number;
  positionsTracked: number;
  activeUsers: number;
  trends: Array<{ name: string; value: number }>;
  distribution: Array<{ category: string; count: number }>;
}

export const analyzerService = {
  async analyzeWebsite(projectId: string, url: string): Promise<AnalyticsData> {
    try {
      // Initialize crawler
      const crawler = new DeepCrawlerCore(url, {
        maxPages: 1000,
        maxDepth: 10
      });

      // Start crawling
      const result = await crawler.startCrawling();
      const pageData = crawler.getPageData();
      
      // Calculate SEO score based on various factors
      const score = Math.floor(Math.random() * 30) + 70; // Placeholder for actual scoring logic
      const pagesScanned = pageData.size;
      
      // Generate analytics data
      const analyticsData: AnalyticsData = {
        score,
        pagesScanned,
        positionsTracked: Math.floor(pagesScanned * 1.5),
        activeUsers: Math.floor(Math.random() * 100) + 50,
        trends: generateTrends(score),
        distribution: generateDistribution(score, pagesScanned)
      };

      // Store analytics results
      await supabase
        .from('analytics')
        .insert({
          project_id: projectId,
          url,
          score: analyticsData.score,
          pages_scanned: analyticsData.pagesScanned,
          positions_tracked: analyticsData.positionsTracked,
          active_users: analyticsData.activeUsers,
          trends: analyticsData.trends,
          distribution: analyticsData.distribution
        });

      return analyticsData;
    } catch (error) {
      console.error('Error analyzing website:', error);
      throw error;
    }
  }
};

// Helper functions for generating analytics data
function generateTrends(baseScore: number): Array<{ name: string; value: number }> {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
  let currentValue = baseScore - 15;
  
  return months.map(month => {
    const change = Math.floor(Math.random() * 7) - 2;
    currentValue = Math.min(Math.max(currentValue + change, 30), 100);
    
    return {
      name: month,
      value: currentValue
    };
  });
}

function generateDistribution(score: number, totalPages: number): Array<{ category: string; count: number }> {
  return [
    { category: 'Отлично', count: Math.floor(totalPages * 0.4) },
    { category: 'Хорошо', count: Math.floor(totalPages * 0.3) },
    { category: 'Средне', count: Math.floor(totalPages * 0.2) },
    { category: 'Плохо', count: Math.floor(totalPages * 0.1) }
  ];
}
