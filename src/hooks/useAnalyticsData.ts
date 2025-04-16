
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  seoScore: number;
  pagesScanned: number;
  positionsTracked: number;
  activeUsers: number;
  trends: Array<{
    name: string;
    value: number;
  }>;
  distribution: Array<{
    category: string;
    count: number;
  }>;
}

export const useAnalyticsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  const fetchAnalyticsData = useCallback(async (projectId?: string) => {
    try {
      setIsLoading(true);
      const { data: analyticsData, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (analyticsData) {
        setData({
          seoScore: analyticsData.seo_score,
          pagesScanned: analyticsData.pages_scanned,
          positionsTracked: analyticsData.positions_tracked,
          activeUsers: analyticsData.active_users,
          trends: analyticsData.trends || [],
          distribution: analyticsData.distribution || []
        });
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
