
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { optimizationService } from '@/api/services/optimizationService';
import { OptimizationItem } from '@/services/audit/optimization/types';

/**
 * Hook for handling optimization API calls
 */
export const useOptimizationAPI = (taskId: string | null) => {
  const { toast } = useToast();
  const [isLoadingCost, setIsLoadingCost] = useState<boolean>(false);

  /**
   * Load optimization cost calculation
   */
  const loadOptimizationCost = async (
    taskId: string,
    setOptimizationCost: (cost: number) => void,
    setOptimizationItems: (items: OptimizationItem[]) => void
  ) => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ID задачи для расчета стоимости оптимизации",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingCost(true);
    
    try {
      // Get optimization cost calculation
      const costData = await optimizationService.getOptimizationCost(taskId);
      
      setOptimizationCost(costData.totalCost);
      setOptimizationItems(costData.items);
      
      toast({
        title: "Данные оптимизации загружены",
        description: `Расчетная стоимость оптимизации: ${new Intl.NumberFormat('ru-RU').format(costData.totalCost)} ₽`,
      });
    } catch (error) {
      console.error('Error loading optimization cost:', error);
      
      toast({
        title: "Внимание",
        description: "Используем примерную стоимость оптимизации из-за ошибки расчета",
        variant: "default"
      });
    } finally {
      setIsLoadingCost(false);
    }
  };

  /**
   * Optimize site content
   */
  const optimizeSiteContent = async (contentPrompt: string) => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ID задачи для оптимизации контента",
        variant: "destructive"
      });
      return false;
    }

    try {
      toast({
        title: "Оптимизация контента",
        description: "Начат процесс оптимизации контента",
      });

      const result = await optimizationService.optimizeContent(taskId, contentPrompt);
      
      if (result.success) {
        toast({
          title: "Успех",
          description: "Контент успешно оптимизирован с помощью ИИ",
        });
        return true;
      } else {
        throw new Error(result.message || "Неизвестная ошибка при оптимизации");
      }
    } catch (error) {
      console.error('Error optimizing content:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось оптимизировать контент сайта",
        variant: "destructive"
      });
      
      return false;
    }
  };

  /**
   * Start full site optimization
   */
  const startOptimization = async (options: {
    fixMeta: boolean;
    fixHeadings: boolean;
    fixImages: boolean;
    generateSitemap: boolean;
    optimizeContentSeo: boolean;
  }) => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ID задачи для оптимизации",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      toast({
        title: "Запуск оптимизации",
        description: "Процесс оптимизации сайта начат",
      });
      
      const result = await optimizationService.startOptimization(taskId, options);
      
      if (result.success) {
        toast({
          title: "Успех",
          description: "Оптимизация сайта запущена успешно",
        });
        return true;
      } else {
        throw new Error("Ошибка при запуске оптимизации");
      }
    } catch (error) {
      console.error('Error starting optimization:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось запустить оптимизацию сайта",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    isLoadingCost,
    loadOptimizationCost,
    optimizeSiteContent,
    startOptimization
  };
};
