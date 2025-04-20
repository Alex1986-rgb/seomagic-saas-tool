
import React, { useState, useEffect, useCallback } from 'react';
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

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hadError, setHadError] = useState(false);
  const { toast } = useToast();
  
  const {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
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

  const initializeAudit = useCallback(() => {
    console.log("Initializing audit for URL:", url);
    try {
      loadAuditData(false, false).catch(err => {
        console.error("Error loading audit data:", err);
        setHadError(true);
        toast({
          title: "Ошибка загрузки аудита",
          description: "Произошла ошибка при загрузке данных аудита",
          variant: "destructive"
        });
      });
    } catch (err) {
      console.error("Exception during audit initialization:", err);
      setHadError(true);
    }
    setIsInitialized(true);
  }, [url, loadAuditData, toast]);

  useEffect(() => {
    if (!isInitialized && url) {
      initializeAudit();
    }
    
    return () => {
      console.log("AuditResultsContainer unmounted");
    };
  }, [url, isInitialized, initializeAudit]);

  const handleUpdatePageCount = (pageCount: number) => {
    if (auditData) {
      auditData.pageCount = pageCount;
    }
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    // Implementation can be added later
    console.log("Selected historical audit:", auditId);
  };

  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  const { data: pageAnalysisData, isLoading: isLoadingAnalysis } = usePageAnalysis(
    auditData?.id
  );
  
  // If we had an error loading, but the component is still mounted,
  // let's give the user a way to retry
  const handleRetry = () => {
    setIsInitialized(false);
    setHadError(false);
    // This will trigger the useEffect to run again
  };

  if (hadError) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500 mb-4">Произошла ошибка при загрузке аудита</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Попробовать снова
        </button>
      </div>
    );
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
          isLoading={isLoading}
          loadingProgress={loadingProgress}
          isScanning={isScanning}
          isRefreshing={isRefreshing}
          error={error}
          scanDetails={scanDetails}
          url={url}
          onRetry={() => loadAuditData(false, false)}
          onDownloadSitemap={sitemap ? downloadSitemap : undefined}
        />
        
        {!isLoading && !isScanning && !error && auditData && recommendations && (
          <>
            <AuditHeader 
              onRefresh={() => loadAuditData(true)}
              onDeepScan={() => loadAuditData(false, true)}
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
                onTogglePrompt={() => setShowPrompt(!showPrompt)}
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
