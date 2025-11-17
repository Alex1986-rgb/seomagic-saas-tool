import { useState, useCallback } from 'react';
import { optimizationService } from '../services/optimizationService';
import type { OptimizationOptions } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useOptimization = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationId, setOptimizationId] = useState<string | null>(null);

  const startOptimization = useCallback(async (taskId: string, options: OptimizationOptions = {}) => {
    setIsLoading(true);
    try {
      const result = await optimizationService.startOptimization(taskId, options);
      
      if (result.success && result.optimization_id) {
        setOptimizationId(result.optimization_id);
        toast({
          title: "Оптимизация запущена",
          description: "Начинается процесс оптимизации контента",
        });
        return result.optimization_id;
      } else {
        throw new Error(result.message || 'Failed to start optimization');
      }
    } catch (error) {
      console.error('Error starting optimization:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось запустить оптимизацию",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    optimizationId,
    startOptimization
  };
};
