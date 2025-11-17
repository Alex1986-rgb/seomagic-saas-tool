import { useState, useCallback } from 'react';
import { auditService } from '../services/auditService';
import type { StartAuditOptions } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useAudit = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);

  const startAudit = useCallback(async (url: string, options: StartAuditOptions = {}) => {
    setIsLoading(true);
    try {
      const result = await auditService.startAudit(url, options);
      
      if (result.success && result.task_id) {
        setTaskId(result.task_id);
        toast({
          title: "Аудит запущен",
          description: "Начинается сканирование сайта",
        });
        return result.task_id;
      } else {
        throw new Error(result.message || 'Failed to start audit');
      }
    } catch (error) {
      console.error('Error starting audit:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось запустить аудит",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const cancelAudit = useCallback(async (taskId: string) => {
    try {
      await auditService.cancelAudit(taskId);
      toast({
        title: "Аудит отменен",
        description: "Процесс сканирования остановлен",
      });
    } catch (error) {
      console.error('Error cancelling audit:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отменить аудит",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    isLoading,
    taskId,
    startAudit,
    cancelAudit
  };
};
