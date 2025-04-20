
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';
import { OptimizationItem } from '@/services/audit/optimization/types';

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
      // Здесь мы симулируем запрос к API за данными оптимизации
      // В реальном сценарии здесь был бы вызов к бэкенду
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Создаем примерные данные для демонстрации
      const cost = Math.floor(Math.random() * 500) + 100;
      const items: OptimizationItem[] = [
        {
          name: "Базовая оптимизация",
          description: "Базовая оптимизация для всех страниц",
          count: Math.floor(Math.random() * 100) + 50,
          price: 0.05,
          totalPrice: Math.floor(Math.random() * 100) + 50
        },
        {
          name: "Создание META-описаний",
          description: "Генерация отсутствующих мета-описаний",
          count: Math.floor(Math.random() * 50) + 10,
          price: 0.5,
          totalPrice: Math.floor(Math.random() * 50) + 10
        },
        {
          name: "Оптимизация текстов",
          description: "Оптимизация текстового содержимого страниц",
          count: Math.floor(Math.random() * 30) + 5,
          price: 1.5,
          totalPrice: Math.floor(Math.random() * 100) + 50
        }
      ];
      
      setOptimizationCost(cost);
      setOptimizationItems(items);
      
      toast({
        title: "Данные оптимизации загружены",
        description: `Расчетная стоимость оптимизации: $${cost}`,
      });
      
    } catch (error) {
      console.error('Error loading optimization cost:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось рассчитать стоимость оптимизации",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCost(false);
    }
  };

  return {
    isLoadingCost,
    loadOptimizationCost
  };
};
