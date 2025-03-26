
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Files, FileSearch, BarChart4 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuditSummary from '@/components/AuditSummary';
import AuditLoading from '../AuditLoading';
import AuditError from './AuditError';
import AuditContent from './AuditContent';
import PageCountDisplay from '../PageCountDisplay';
import { fetchAuditData, fetchRecommendations, fetchAuditHistory, scanWebsite } from '@/services/auditService';
import { AuditData, RecommendationData, AuditHistoryData, ScanOptions } from '@/types/audit';

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
  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<{
    pagesScanned: number;
    totalPages: number;
    currentUrl: string;
  }>({
    pagesScanned: 0,
    totalPages: 0,
    currentUrl: ''
  });
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
      
      // If deep scan is requested, perform website crawling first
      if (deepScan) {
        setIsScanning(true);
        
        const scanOptions: ScanOptions = {
          maxPages: 200,
          maxDepth: 3,
          followExternalLinks: false,
          checkMobile: true,
          analyzeSEO: true,
          analyzePerformance: true,
          onProgress: (pagesScanned, totalPages, currentUrl) => {
            setScanDetails({
              pagesScanned,
              totalPages,
              currentUrl
            });
          }
        };
        
        await scanWebsite(url, scanOptions);
        setIsScanning(false);
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

  const handleDeepScan = () => {
    loadAuditData(false, true);
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

  if (isScanning) {
    return (
      <div className="neo-card p-6">
        <div className="text-center mb-6">
          <FileSearch className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Глубокое сканирование сайта</h3>
          <p className="text-muted-foreground mb-4">Анализируем страницы сайта {url}</p>
          
          <div className="flex justify-between items-center mb-2 text-sm">
            <span>Прогресс сканирования:</span>
            <span>{scanDetails.pagesScanned} / {scanDetails.totalPages || '?'} страниц</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ 
                width: scanDetails.totalPages ? 
                  `${(scanDetails.pagesScanned / scanDetails.totalPages) * 100}%` : 
                  `${Math.min(scanDetails.pagesScanned, 100)}%` 
              }}
            ></div>
          </div>
          
          {scanDetails.currentUrl && (
            <p className="text-xs text-muted-foreground truncate mb-4">
              Сканирование: {scanDetails.currentUrl}
            </p>
          )}
        </div>
      </div>
    );
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
          <div className="flex gap-2">
            <Button 
              onClick={handleDeepScan}
              variant="outline"
              size="sm"
            >
              <FileSearch className="h-4 w-4 mr-2" />
              Глубокий анализ
            </Button>
            <Button 
              onClick={handleRefreshAudit} 
              disabled={isRefreshing}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Обновить аудит
            </Button>
          </div>
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
          auditData={auditData}
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
