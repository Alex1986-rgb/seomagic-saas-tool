
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditSummary from './AuditSummary';
import AuditLoading from './audit/AuditLoading';
import AuditTabs from './audit/AuditTabs';
import AuditRecommendations from './audit/AuditRecommendations';
import AuditShareResults from './audit/AuditShareResults';
import { fetchAuditData, fetchRecommendations } from '@/services/auditService';
import { AuditData, RecommendationData } from '@/types/audit';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Симуляция прогресса загрузки
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

  // Загрузка данных аудита
  useEffect(() => {
    const loadAuditData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Добавляем небольшую задержку для загрузочного состояния
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const [auditResult, recommendationsResult] = await Promise.all([
          fetchAuditData(url),
          fetchRecommendations()
        ]);
        
        setAuditData(auditResult);
        setRecommendations(recommendationsResult);
        
        toast({
          title: "Аудит завершен",
          description: "SEO аудит сайта успешно завершен",
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
        // Небольшая задержка, чтобы показать полный прогресс
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    loadAuditData();
  }, [url, toast]);

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
        <p className="text-muted-foreground">
          Пожалуйста, проверьте URL и попробуйте снова. Если проблема повторяется, обратитесь в службу поддержки.
        </p>
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
      >
        <AuditSummary 
          url={url} 
          score={auditData.score}
          date={auditData.date}
          issues={auditData.issues}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AuditTabs details={auditData.details} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AuditRecommendations recommendations={recommendations} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AuditShareResults auditId={auditData.id} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeoAuditResults;
