
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

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

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      // In the future, this will fetch real data from Supabase
      // For now, we'll use mock data
      const mockData: AnalyticsData = {
        seoScore: 82,
        pagesScanned: 1284,
        positionsTracked: 348,
        activeUsers: 2842,
        trends: [
          { name: '1 Апр', value: 65 },
          { name: '8 Апр', value: 72 },
          { name: '15 Апр', value: 68 },
          { name: '22 Апр', value: 78 },
          { name: '29 Апр', value: 82 },
          { name: '6 Мая', value: 85 },
          { name: '13 Мая', value: 89 },
        ],
        distribution: [
          { category: '90-100', count: 25 },
          { category: '80-89', count: 42 },
          { category: '70-79', count: 30 },
          { category: '60-69', count: 15 },
          { category: '0-59', count: 8 },
        ]
      };
      
      setData(mockData);
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
  };

  return {
    isLoading,
    data,
    fetchAnalyticsData
  };
};
