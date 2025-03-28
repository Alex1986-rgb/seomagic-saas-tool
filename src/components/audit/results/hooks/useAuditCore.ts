
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory } from '@/services/auditService';

export const useAuditCore = (url: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [historyData, setHistoryData] = useState<AuditHistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  const loadAuditData = useCallback(async (refresh = false, deepScan = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setLoadingProgress(0);
    }
    setError(null);
    
    try {
      // Добавляем небольшую задержку чтобы UI успел отрендериться
      if (!refresh) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const [auditResult, recommendationsResult, historyResult] = await Promise.all([
        fetchAuditData(url),
        fetchRecommendations(url),
        fetchAuditHistory(url)
      ]);
      
      // Задержка чтобы предотвратить мгновенный UI скачок
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setAuditData(auditResult);
      setRecommendations(recommendationsResult);
      setHistoryData(historyResult);
      
      if (!refresh) {
        toast({
          title: "Аудит завершен",
          description: `SEO аудит завершен. Проанализировано ${auditResult.pageCount} страниц.`,
        });
      } else {
        toast({
          title: "Аудит обновлен",
          description: "SEO аудит сайта успешно обновлен"
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки данных аудита:', error);
      setError("Не удалось загрузить данные аудита. Пожалуйста, проверьте URL и попробуйте снова.");
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить результаты аудита",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      }, 500);
    }

    return { auditData, recommendations, historyData };
  }, [url, toast]);

  return {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setIsRefreshing,
    loadAuditData,
    setAuditData,
  };
};
