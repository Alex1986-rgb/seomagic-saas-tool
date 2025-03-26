import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditSummary from './AuditSummary';
import AuditLoading from './audit/AuditLoading';
import AuditTabs from './audit/AuditTabs';
import AuditRecommendations from './audit/AuditRecommendations';
import AuditShareResults from './audit/AuditShareResults';
import AuditHistory from './audit/AuditHistory';
import AuditDataVisualizer from './audit/data-visualization/AuditDataVisualizer';
import AuditComparison from './audit/comparison/AuditComparison';
import AuditComments from './audit/comments/AuditComments';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory } from '@/services/auditService';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
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
        description: refresh ? "SEO аудит сайта успешно обновлен" : "SEO аудит сайта успешно завершен",
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
    return (
      <motion.div 
        className="p-6 text-center neo-card"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <p className="text-muted-foreground mb-6">
          Пожалуйста, проверьте URL и попробуйте снова. Если проблема повторяется, обратитесь в службу поддержки.
        </p>
        <Button onClick={() => loadAuditData()}>Попробовать снова</Button>
      </motion.div>
    );
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
        
        <AuditSummary 
          url={url} 
          score={auditData.score}
          date={auditData.date}
          issues={auditData.issues}
          previousScore={auditData.previousScore}
        />
        
        {historyData && historyData.items.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AuditHistory 
              historyItems={historyData.items} 
              onSelectAudit={handleSelectHistoricalAudit}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <AuditDataVisualizer auditData={auditData.details} />
        </motion.div>
        
        {historyData && historyData.items.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AuditComparison 
              currentAudit={auditData} 
              historyItems={historyData.items} 
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <AuditTabs details={auditData.details} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AuditRecommendations recommendations={recommendations} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <AuditComments auditId={auditData.id} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AuditShareResults 
            auditId={auditData.id} 
            auditData={auditData}
            url={url}
            historyItems={historyData?.items}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeoAuditResults;
