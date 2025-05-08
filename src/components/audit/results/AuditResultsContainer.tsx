
import React, { useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuditData } from './hooks/useAuditData';
import { useAuditInitialization } from './hooks/useAuditInitialization';
import { usePromptToggle } from './hooks/usePromptToggle';
import AuditStateHandler from './components/AuditStateHandler';
import AuditContent from './components/AuditContent';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  // Get audit data and actions from our custom hook
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
  
  // Content prompt state management
  const { showPrompt, togglePrompt } = usePromptToggle();
  
  // Initialization and timeout handling
  const {
    isLoading,
    hadError,
    timeout,
    handleRetry,
    setIsLoading
  } = useAuditInitialization(url, loadAuditData);

  // Sync loading state from audit data hook
  React.useEffect(() => {
    setIsLoading(isAuditLoading);
  }, [isAuditLoading, setIsLoading]);

  // Handler for selecting historical audit
  const handleSelectHistoricalAudit = useCallback((auditId: string) => {
    console.log("Selected historical audit:", auditId);
  }, []);

  // Ensure historyData has the correct type - memoize transformation
  const typedHistoryData = useMemo(() => 
    historyData && typeof historyData === 'object' ? 
    { 
      url: url, 
      items: Array.isArray(historyData.items) ? historyData.items : [] 
    } : 
    { url: url, items: [] }, 
  [historyData, url]);

  return (
    <AnimatePresence mode="sync">
      <AuditStateHandler
        isLoading={isLoading}
        hadError={hadError}
        timeout={timeout}
        onRetry={handleRetry}
        url={url} // Pass the URL here
      >
        <AuditContent
          url={url}
          isLoading={isAuditLoading}
          loadingProgress={loadingProgress}
          isScanning={isScanning}
          isRefreshing={isRefreshing}
          auditError={auditError}
          scanDetails={scanDetails}
          auditData={auditData}
          recommendations={recommendations}
          historyData={typedHistoryData}
          optimizationCost={optimizationCost}
          optimizationItems={optimizationItems}
          isOptimized={isOptimized}
          contentPrompt={contentPrompt}
          taskId={taskId}
          showPrompt={showPrompt}
          onTogglePrompt={togglePrompt}
          onRetry={() => loadAuditData(false)}
          onDownloadSitemap={sitemap ? downloadSitemap : undefined}
          loadAuditData={loadAuditData}
          handleSelectHistoricalAudit={handleSelectHistoricalAudit}
          downloadSitemap={sitemap ? downloadSitemap : undefined}
          exportJSONData={exportJSONData}
          generatePdfReportFile={generatePdfReportFile}
          downloadOptimizedSite={downloadOptimizedSite}
          optimizeSiteContent={optimizeSiteContent}
          setContentOptimizationPrompt={setContentOptimizationPrompt}
        />
      </AuditStateHandler>
    </AnimatePresence>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default React.memo(AuditResultsContainer);
