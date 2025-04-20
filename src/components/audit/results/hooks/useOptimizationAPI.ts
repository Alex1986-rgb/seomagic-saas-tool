
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';
import { OptimizationItem } from '@/services/audit/optimization/types';
import { calculateOptimizationCost } from '@/services/audit/optimization/pricingConfig';

export const useOptimizationAPI = (taskId: string | null) => {
  const { toast } = useToast();
  const [isLoadingCost, setIsLoadingCost] = useState<boolean>(false);

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
      // Получаем данные о количестве страниц
      const auditInfo = await seoApiService.getAuditInfo(taskId);
      
      // Рассчитываем стоимость оптимизации на основе количества страниц
      const pageCount = auditInfo?.pageCount || 0;
      
      if (pageCount === 0) {
        toast({
          title: "Предупреждение",
          description: "Не удалось определить количество страниц сайта. Используем примерную оценку.",
          variant: "warning"
        });
      }
      
      // Используем функцию расчета из конфигурации цен
      const optimizationData = calculateOptimizationCost(pageCount || 100);
      
      setOptimizationCost(optimizationData.totalCost);
      setOptimizationItems(optimizationData.items);
      
      toast({
        title: "Данные оптимизации загружены",
        description: `Расчетная стоимость оптимизации: ${new Intl.NumberFormat('ru-RU').format(optimizationData.totalCost)} ₽`,
      });
      
    } catch (error) {
      console.error('Error loading optimization cost:', error);
      
      // В случае ошибки используем резервный расчет
      const fallbackPageCount = 100;
      const fallbackData = calculateOptimizationCost(fallbackPageCount);
      
      setOptimizationCost(fallbackData.totalCost);
      setOptimizationItems(fallbackData.items);
      
      toast({
        title: "Внимание",
        description: "Используем примерную стоимость оптимизации из-за ошибки расчета",
        variant: "warning"
      });
    } finally {
      setIsLoadingCost(false);
    }
  };

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

      // В реальной версии здесь будет вызов API для оптимизации с OpenAI
      const result = await seoApiService.optimizeSiteContent(taskId, contentPrompt);
      
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

  return {
    isLoadingCost,
    loadOptimizationCost,
    optimizeSiteContent
  };
};
