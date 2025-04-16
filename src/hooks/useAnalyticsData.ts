
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analyzerService, type AnalyticsData } from '@/services/analyzerService';

export const useAnalyticsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  const fetchAnalyticsData = useCallback(async (projectId?: string) => {
    if (!projectId) {
      setData(null);
      return;
    }

    try {
      setIsLoading(true);
      
      // Try to fetch existing analytics first
      const { data: existingAnalytics, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingAnalytics) {
        // Convert the JSON data to the expected types
        const parsedTrends = Array.isArray(existingAnalytics.trends) 
          ? existingAnalytics.trends.map((item: any) => ({
              name: String(item.name || ''),
              value: Number(item.value || 0)
            }))
          : [];
          
        const parsedDistribution = Array.isArray(existingAnalytics.distribution)
          ? existingAnalytics.distribution.map((item: any) => ({
              category: String(item.category || ''),
              count: Number(item.count || 0)
            }))
          : [];

        setData({
          score: existingAnalytics.score,
          pagesScanned: existingAnalytics.pages_scanned,
          positionsTracked: existingAnalytics.positions_tracked,
          activeUsers: existingAnalytics.active_users,
          trends: parsedTrends,
          distribution: parsedDistribution
        });
      } else {
        // If no analytics exist, fetch the project URL and run analysis
        const { data: project } = await supabase
          .from('projects')
          .select('url')
          .eq('id', projectId)
          .single();
          
        if (project) {
          const analyticsData = await analyzerService.analyzeWebsite(projectId, project.url);
          setData(analyticsData);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить аналитические данные",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    data,
    fetchAnalyticsData
  };
};
