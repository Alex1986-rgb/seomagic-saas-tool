
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditData } from './hooks/useAuditData';
import { usePageAnalysis } from '@/hooks/use-page-analysis';
import AuditHeader from './components/AuditHeader';
import AuditStatus from './components/AuditStatus';
import AuditMain from './components/AuditMain';
import AuditPageInfo from './components/AuditPageInfo';
import AuditOptimization from './components/AuditOptimization';
import PageAnalysisTable from './components/PageAnalysisTable';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeoutStatus] = useState(false);
  const { toast } = useToast();
  const initRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    isLoading: isAuditLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error: auditError,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    loadAuditData,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt
  } = useAuditData(url);

  useEffect(() => {
    if (url && !timeout && isInitialized) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        console.log("Audit data loading timeout triggered after 3 minutes");
        setTimeoutStatus(true);
        setIsLoading(false);
        setHadError(true);
        
        toast({
          title: "Превышено время ожидания",
          description: "Загрузка данных аудита заняла слишком много времени. Пожалуйста, попробуйте снова или используйте другой URL.",
          variant: "destructive",
        });
      }, 180000) as unknown as NodeJS.Timeout;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, timeout, isInitialized, toast]);

  useEffect(() => {
    setIsLoading(isAuditLoading);
  }, [isAuditLoading]);

  const initializeAudit = useCallback(() => {
    if (initRef.current) return;
    
    console.log("Initializing audit for URL:", url);
    try {
      initRef.current = true;
      setIsLoading(true);
      
      loadAuditData(false).then(() => {
        setIsLoading(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }).catch(err => {
        console.error("Error loading audit data:", err);
        setHadError(true);
        setIsLoading(false);
        toast({
          title: "Ошибка загрузки аудита",
          description: "Произошла ошибка при загрузке данных аудита",
          variant: "destructive"
        });
      });
    } catch (err) {
      console.error("Exception during audit initialization:", err);
      setHadError(true);
      setIsLoading(false);
    }
    setIsInitialized(true);
  }, [url, loadAuditData, toast]);

  useEffect(() => {
    if (!isInitialized && url) {
      initializeAudit();
    }
    
    return () => {
      console.log("AuditResultsContainer unmounted");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, isInitialized, initializeAudit]);

  const handleUpdatePageCount = (pageCount: number) => {
    if (auditData) {
      auditData.pageCount = pageCount;
    }
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    console.log("Selected historical audit:", auditId);
  };

  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  const { data: pageAnalysisData, isLoading: isLoadingAnalysis } = usePageAnalysis(
    auditData?.id
  );
  
  const handleRetry = () => {
    initRef.current = false;
    setIsInitialized(false);
    setHadError(false);
    setTimeoutStatus(false);
  };

  if (hadError || timeout) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500 mb-4">
          {timeout 
            ? "Время ожидания истекло. Возможно, сайт слишком большой или недоступен." 
            : "Произошла ошибка при загрузке аудита"
          }
        </p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <AuditStatus 
          isLoading={isAuditLoading}
          loadingProgress={loadingProgress}
          isScanning={isScanning}
          isRefreshing={isRefreshing}
          error={auditError}
          scanDetails={scanDetails}
          url={url}
          onRetry={() => loadAuditData(false)}
          onDownloadSitemap={sitemap ? downloadSitemap : undefined}
        />
        
        {!isAuditLoading && !isScanning && !auditError && auditData && recommendations && (
          <>
            <AuditHeader 
              onRefresh={() => loadAuditData(true)}
              onDeepScan={() => loadAuditData(false)}
              isRefreshing={isRefreshing}
              onDownloadSitemap={sitemap ? downloadSitemap : undefined}
              onTogglePrompt={() => setShowPrompt(!showPrompt)}
              onExportJSON={exportJSONData}
              showPrompt={showPrompt}
            />
            
            <div className="space-y-6">
              <AuditMain 
                url={url}
                auditData={auditData}
                recommendations={recommendations}
                historyData={historyData}
                taskId={taskId || ""}
                onSelectAudit={handleSelectHistoricalAudit}
              />
              
              <div className="neo-card p-6">
                <h2 className="text-xl font-semibold mb-4">Анализ страниц</h2>
                <PageAnalysisTable 
                  data={pageAnalysisData}
                  isLoading={isLoadingAnalysis}
                />
              </div>
              
              <AuditOptimization 
                optimizationCost={optimizationCost}
                optimizationItems={optimizationItems}
                isOptimized={isOptimized}
                contentPrompt={contentPrompt}
                url={url}
                pageCount={auditData.pageCount || 0}
                showPrompt={showPrompt}
                onTogglePrompt={toggleContentPrompt}
                onOptimize={optimizeSiteContent}
                onDownloadOptimizedSite={downloadOptimizedSite}
                onGeneratePdfReport={generatePdfReportFile}
                setContentOptimizationPrompt={setContentOptimizationPrompt}
              />
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
