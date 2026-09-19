
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
   * Расчёт сметы с повторами, пока результаты аудита ещё готовятся.
   *
   * Возвращает `true`, если смета получена. Раньше при ошибке показывался тост
   * «Используем примерную стоимость оптимизации», хотя никакой примерной сметы
   * не подставлялось: сервис бросает ошибку, а не возвращает ноль. Теперь
   * человек видит настоящую причину, а вызывающий может дать повторить расчёт.
   */
  const loadOptimizationCost = async (
    taskId: string,
    setOptimizationCost: (cost: number) => void,
    setOptimizationItems: (items: OptimizationItem[]) => void,
    onStatusUpdate?: (status: string, attempt?: number) => void
  ): Promise<boolean> => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить ID задачи для расчета стоимости оптимизации",
        variant: "destructive"
      });
      return false;
    }
    
    const maxRetries = 5;
    const baseDelay = 2000; // 2 seconds
    
    setIsLoadingCost(true);
    
    try {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          onStatusUpdate?.(`Расчет стоимости оптимизации... (попытка ${attempt}/${maxRetries})`, attempt);
          
          const costData = await optimizationService.getOptimizationCost(taskId);
          
          setOptimizationCost(costData.totalCost);
          setOptimizationItems(costData.items);
          
          onStatusUpdate?.('Расчет завершен успешно');
          
          toast({
            title: "Данные оптимизации загружены",
            description: `Расчетная стоимость оптимизации: ${new Intl.NumberFormat('ru-RU').format(costData.totalCost)} ₽`,
          });
          
          return true;
        } catch (error: any) {
          console.error(`Error loading optimization cost (attempt ${attempt}/${maxRetries}):`, error);

          const message: string = error?.message || 'неизвестная ошибка';

          // Повторяем только «результаты/смета ещё не готовы» (функция отвечает
          // 404, пока аудит и классификация замечаний не закончились). Отказ в
          // доступе (403) и прочие ошибки повторами не лечатся.
          const isNotReadyYet = message.includes('not found') || message.includes('404');

          if (isNotReadyYet && attempt < maxRetries) {
            const delay = baseDelay * Math.pow(1.5, attempt - 1);
            
            onStatusUpdate?.(
              `Результаты аудита еще готовятся... Повтор через ${Math.round(delay / 1000)} сек.`,
              attempt
            );
            
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          onStatusUpdate?.('Смета не рассчитана');
          
          toast({
            title: "Смета не рассчитана",
            description: isNotReadyYet
              ? "Результаты аудита еще не готовы. Попробуйте рассчитать смету чуть позже."
              : `Не удалось рассчитать стоимость: ${message}`,
            variant: "destructive"
          });
          
          return false;
        }
      }

      return false;
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
