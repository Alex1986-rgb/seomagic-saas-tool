
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
   * Load optimization cost calculation with retry logic
   */
  const loadOptimizationCost = async (
    taskId: string,
    setOptimizationCost: (cost: number) => void,
    setOptimizationItems: (items: OptimizationItem[]) => void,
    onStatusUpdate?: (status: string, attempt?: number) => void
  ) => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ID задачи для расчета стоимости оптимизации",
        variant: "destructive"
      });
      return;
    }
    
    const maxRetries = 5;
    const baseDelay = 2000; // 2 seconds
    
    setIsLoadingCost(true);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        onStatusUpdate?.(`Расчет стоимости оптимизации... (попытка ${attempt}/${maxRetries})`, attempt);
        
        // Get optimization cost calculation
        const costData = await optimizationService.getOptimizationCost(taskId);
        
        setOptimizationCost(costData.totalCost);
        setOptimizationItems(costData.items);
        
        onStatusUpdate?.('Расчет завершен успешно');
        
        toast({
          title: "Данные оптимизации загружены",
          description: `Расчетная стоимость оптимизации: ${new Intl.NumberFormat('ru-RU').format(costData.totalCost)} ₽`,
        });
        
        setIsLoadingCost(false);
        return; // Success - exit retry loop
        
      } catch (error: any) {
        console.error(`Error loading optimization cost (attempt ${attempt}/${maxRetries}):`, error);
        
        // Check if it's a "not found" error that we should retry
        const isNotFoundError = error?.message?.includes('not found') || 
                               error?.message?.includes('404') ||
                               error?.error?.includes('not found');
        
        if (isNotFoundError && attempt < maxRetries) {
          // Calculate exponential backoff delay
          const delay = baseDelay * Math.pow(1.5, attempt - 1);
          
          onStatusUpdate?.(
            `Результаты аудита еще готовятся... Повтор через ${Math.round(delay / 1000)} сек.`,
            attempt
          );
          
          // Wait before next retry
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If it's the last attempt or a different error, show fallback
        onStatusUpdate?.('Используем примерную оценку');
        
        toast({
          title: "Внимание",
          description: attempt === maxRetries 
            ? "Результаты аудита еще готовятся. Используем примерную стоимость оптимизации."
            : "Используем примерную стоимость оптимизации из-за ошибки расчета",
          variant: "default"
        });
        
        break;
      }
    }
    
    setIsLoadingCost(false);
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
