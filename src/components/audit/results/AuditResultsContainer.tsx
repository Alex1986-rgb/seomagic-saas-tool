
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditData } from './hooks/useAuditData';
import { usePageAnalysis } from '@/hooks/use-page-analysis';
import AuditHeader from './components/AuditHeader';
import AuditStatus from './components/AuditStatus';
import AuditMain from './components/AuditMain';
import AuditPageInfo from './components/AuditPageInfo';
import AuditOptimization from './components/AuditOptimization';
import PageAnalysisTable from './components/PageAnalysisTable';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
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

  useEffect(() => {
    if (!isInitialized && url) {
      loadAuditData(false, false);
      setIsInitialized(true);
    }
  }, [url, isInitialized, loadAuditData]);

  const handleUpdatePageCount = (pageCount: number) => {
    if (auditData) {
      auditData.pageCount = pageCount;
    }
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    // Implementation can be added later
  };

  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  const { data: pageAnalysisData, isLoading: isLoadingAnalysis } = usePageAnalysis(
    auditData?.id
  );

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
