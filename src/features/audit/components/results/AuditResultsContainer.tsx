
import React, { useCallback, useMemo } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useAuditDataContext } from '@/contexts/AuditDataContext';
import { useScanContext } from '@/contexts/ScanContext';
import { useOptimizationContext } from '@/contexts/OptimizationContext';
import { useAuditInitialization } from '../../hooks/useAuditInitialization';
import { usePromptToggle } from '../../hooks/usePromptToggle';
import AuditStateHandler from './components/AuditStateHandler';
import AuditContent from './AuditContent';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  // Get data from our contexts
  const { updateUrl } = useAuditContext();
  
  const {
    auditData,
    recommendations,
    historyData,
    error: auditError,
    isLoading: isAuditLoading,
    loadingProgress,
    isRefreshing,
    loadAuditData,
    generatePdfReportFile,
    exportJSONData
  } = useAuditDataContext();
  
  const {
    isScanning,
    scanDetails,
    taskId,
    sitemap,
    pageStats,
    downloadSitemap
  } = useScanContext();
  
  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    setContentOptimizationPrompt,
    optimizeSiteContent,
    downloadOptimizedSite
  } = useOptimizationContext();
  
  // Make sure URL is up to date
  React.useEffect(() => {
    if (url) {
      updateUrl(url);
    }
  }, [url, updateUrl]);
  
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

  // Sync loading state from audit data context
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
    <AuditStateHandler
      isLoading={isLoading}
      hadError={hadError}
      timeout={timeout}
      onRetry={handleRetry}
      url={url}
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
        optimizeSiteContent={() => optimizeSiteContent(taskId || '', contentPrompt)}
        setContentOptimizationPrompt={setContentOptimizationPrompt}
      />
    </AuditStateHandler>
  );
};

export default React.memo(AuditResultsContainer);
