
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuditSummary from '@/components/AuditSummary';
import AuditLoading from '../AuditLoading';
import AuditError from './AuditError';
import AuditContent from './AuditContent';
import PageCountDisplay from '../page-count';
import { useAuditData } from './hooks/useAuditData';
import AuditHeader from './components/AuditHeader';
import AuditScanning from './components/AuditScanning';
import AuditRefreshing from './components/AuditRefreshing';
import { OptimizationCost } from './components/optimization';
import { DeepCrawlButton } from '../deep-crawl';
import ContentOptimizationPrompt from './components/ContentOptimizationPrompt';

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
      loadAuditData();
      setIsInitialized(true);
    }
  }, [url, isInitialized, loadAuditData]);

  const handleRefreshAudit = () => {
    loadAuditData(true);
  };

  const handleDeepScan = () => {
    loadAuditData(false, true);
  };

  const handleUpdatePageCount = (pageCount: number) => {
    if (auditData) {
      auditData.pageCount = pageCount;
    }
  };

  const handleSelectHistoricalAudit = (auditId: string) => {
    // This can be moved to a separate function or context in a future refactoring
  };

  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  const handleOptimize = () => {
    optimizeSiteContent();
  };

  // Handler for PDF report generation
  const handleGeneratePdfReport = () => {
    generatePdfReportFile();
  };

  if (isLoading) {
    return <AuditLoading progress={loadingProgress} />;
  }

  if (isScanning) {
    return <AuditScanning 
      url={url} 
      scanDetails={{
        pagesScanned: scanDetails.pages_scanned,
        totalPages: scanDetails.estimated_pages,
        currentUrl: scanDetails.current_url
      }} 
      onDownloadSitemap={downloadSitemap} 
    />;
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
        {isRefreshing && <AuditRefreshing />}
        
        <AuditHeader 
          onRefresh={handleRefreshAudit}
          onDeepScan={handleDeepScan}
          isRefreshing={isRefreshing}
          onDownloadSitemap={sitemap ? downloadSitemap : undefined}
          onTogglePrompt={toggleContentPrompt}
          onExportJSON={exportJSONData}
          showPrompt={showPrompt}
        />
        
        {showPrompt && (
          <ContentOptimizationPrompt 
            prompt={contentPrompt} 
            setPrompt={setContentOptimizationPrompt}
            onOptimize={handleOptimize}
            className="mb-4"
          />
        )}
        
        {auditData.pageCount && (
          <div className="relative">
            <PageCountDisplay 
              pageCount={auditData.pageCount} 
              isScanning={false}
              pageStats={pageStats}
              onDownloadSitemap={sitemap ? downloadSitemap : undefined}
            />
            
            <div className="absolute top-4 right-4">
              <DeepCrawlButton 
                url={url} 
                onCrawlComplete={handleUpdatePageCount} 
              />
            </div>
          </div>
        )}
        
        {optimizationCost && (
          <OptimizationCost 
            optimizationCost={optimizationCost}
            pageCount={auditData.pageCount || 0}
            url={url}
            onDownloadOptimized={downloadOptimizedSite}
            isOptimized={isOptimized}
            optimizationItems={optimizationItems}
            onGeneratePdfReport={handleGeneratePdfReport}
            className="mb-4"
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
          taskId={taskId}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
