
import { useState, useEffect } from 'react';
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
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);

  const loadAuditData = async (refresh = false, deepScan = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      if (!refresh) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const [auditResult, recommendationsResult, historyResult] = await Promise.all([
        fetchAuditData(url),
        fetchRecommendations(url),
        fetchAuditHistory(url)
      ]);
      
      setAuditData(auditResult);
      setRecommendations(recommendationsResult);
      setHistoryData(historyResult);
      
      toast({
        title: refresh ? "Аудит обновлен" : "Аудит завершен",
        description: refresh 
          ? "SEO аудит сайта успешно обновлен" 
          : `SEO аудит завершен. Проанализировано ${auditResult.pageCount} страниц.`,
      });
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
  };

  useEffect(() => {
    loadAuditData();
  }, [url]);

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
