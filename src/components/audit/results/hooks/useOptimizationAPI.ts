
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';
import { OptimizationItem as ApiOptimizationItem } from '@/types/api';

export const useOptimizationAPI = (taskId: string | null) => {
  const { toast } = useToast();

  const optimizeSiteContent = useCallback(async (contentPrompt: string) => {
    if (taskId) {
      try {
        await seoApiService.optimizeSite(taskId, contentPrompt);
        toast({
          title: "Оптимизация запущена",
          description: "Процесс оптимизации сайта успешно запущен",
        });
      } catch (error) {
        toast({
          title: "Ошибка оптимизации",
          description: "Не удалось запустить оптимизацию сайта",
          variant: "destructive"
        });
        console.error('Error optimizing site:', error);
      }
    }
  }, [taskId, toast]);
  
  const loadOptimizationCost = async (
    taskId: string, 
    setOptimizationCost: (cost: number) => void, 
    setOptimizationItems: (items: OptimizationItem[]) => void
  ) => {
    try {
      const costData = await seoApiService.getOptimizationCost(taskId);
      setOptimizationCost(costData.total);
      
      const convertedItems: OptimizationItem[] = costData.items.map((item: ApiOptimizationItem) => ({
        name: item.name,
        count: item.count,
        price: item.price,
        type: item.type || 'service',
        pricePerUnit: item.price / item.count,
        totalPrice: item.price,
        description: item.description || item.name
      }));
      
      setOptimizationItems(convertedItems);
      return true;
    } catch (error) {
      console.error('Error loading optimization cost:', error);
      return false;
    }
  };

  return {
    optimizeSiteContent,
    loadOptimizationCost
  };
};
