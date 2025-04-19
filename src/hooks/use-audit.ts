
import { useState, useCallback } from 'react';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory } from '@/services/auditService';
import { useToast } from "./use-toast";

/**
 * Хук для управления данными аудита сайта
 */
export const useAudit = (url: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [historyData, setHistoryData] = useState<AuditHistoryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  /**
   * Обновляет прогресс загрузки аудита
   */
  const startProgressAnimation = useCallback(() => {
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

  /**
   * Загружает данные аудита
   */
  const loadAuditData = useCallback(async (refresh = false, deepScan = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setLoadingProgress(0);
      startProgressAnimation();
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
      
      // Cast the recommendations result to RecommendationData and set it
      const typedRecommendations: RecommendationData = {
        ...recommendationsResult,
        url: url,
        title: `Recommendations for ${url}`,
        description: "Recommended optimizations based on audit results",
        priority: "high",
        category: "SEO",
        affectedAreas: ["SEO", "Performance", "Content"],
        estimatedEffort: "medium",
        potentialImpact: "high",
        status: "pending",
        details: "Detailed analysis of SEO optimizations",
        resources: ["https://example.com/seo-best-practices"],
        critical: recommendationsResult.critical || [],
        important: recommendationsResult.important || [],
        opportunities: recommendationsResult.opportunities || []
      };
      setRecommendations(typedRecommendations);
      
      // Cast the history result to AuditHistoryData and set it
      const typedHistoryData: AuditHistoryData = {
        url: url,
        items: historyResult.items || []
      };
      setHistoryData(typedHistoryData);
      
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
  }, [url, toast, startProgressAnimation]);

  /**
   * Обновляет аудит
   */
  const refreshAudit = useCallback(() => {
    return loadAuditData(true, false);
  }, [loadAuditData]);

  /**
   * Запускает глубокое сканирование
   */
  const startDeepScan = useCallback(() => {
    return loadAuditData(false, true);
  }, [loadAuditData]);

  return {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setAuditData,
    loadAuditData,
    refreshAudit,
    startDeepScan,
    setIsRefreshing,
  };
};
