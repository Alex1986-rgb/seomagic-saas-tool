
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Files } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuditSummary from '@/components/AuditSummary';
import AuditLoading from '../AuditLoading';
import AuditError from './AuditError';
import AuditContent from './AuditContent';
import PageCountDisplay from '../PageCountDisplay';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory } from '@/services/auditService';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
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

  const loadAuditData = async (refresh = false) => {
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
        fetchRecommendations(),
        fetchAuditHistory(url)
      ]);
      
      setAuditData(auditResult);
      setRecommendations(recommendationsResult);
      setHistoryData(historyResult);
      
      toast({
        title: refresh ? "Аудит обновлен" : "Аудит завершен",
        description: refresh ? "SEO аудит сайта успешно обновлен" : `SEO аудит завершен. Проанализировано ${auditResult.pageCount} страниц.`,
      });
    } catch (error) {
      console.error('Error loading audit data:', error);
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
  };

  useEffect(() => {
    loadAuditData();
  }, [url, toast]);

  const handleRefreshAudit = () => {
    loadAuditData(true);
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    toast({
      title: "Исторический аудит",
      description: `Запрос данных аудита ID: ${auditId}`,
    });
  };

  if (isLoading) {
    return <AuditLoading progress={loadingProgress} />;
  }

  if (error) {
    return <AuditError error={error} onRetry={() => loadAuditData()} />;
  }

  if (!auditData || !recommendations) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">Не удалось загрузить данные аудита</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {isRefreshing && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <RefreshCw className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium">Обновление аудита...</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Результаты SEO аудита</h2>
          <Button 
            onClick={handleRefreshAudit} 
            disabled={isRefreshing}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Обновить аудит
          </Button>
        </div>
        
        {auditData.pageCount && (
          <PageCountDisplay 
            pageCount={auditData.pageCount} 
            isScanning={false}
          />
        )}
        
        <AuditSummary 
          url={url} 
          score={auditData.score}
          date={auditData.date}
          issues={auditData.issues}
          previousScore={auditData.previousScore}
        />
        
        <AuditContent 
          auditData={auditData}
          recommendations={recommendations}
          historyData={historyData}
          url={url}
          onSelectAudit={handleSelectHistoricalAudit}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
