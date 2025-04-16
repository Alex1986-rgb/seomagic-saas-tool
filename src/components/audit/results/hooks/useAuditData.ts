
import { useAuditDataProvider } from './useAuditDataProvider';
import { useAuditActions } from './useAuditActions';

export const useAuditData = (url: string) => {
  const {
    contentPrompt,
    setContentPrompt,
    optimizationCost,
    optimizationItems,
    isOptimized,
    generatePdfReportFile,
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
    taskId,
    setIsRefreshing,
    loadAuditData,
    downloadSitemapLocal,
    localDownloadOptimizedSite
  } = useAuditDataProvider(url);

  const {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent
  } = useAuditActions(
    url,
    contentPrompt,
    auditData,
    downloadSitemapLocal,
    localDownloadOptimizedSite
  );

  const setContentOptimizationPrompt = (prompt: string) => {
    setContentPrompt(prompt);
  };

  return {
    // State
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
    
    // Actions
    loadAuditData,
    setIsRefreshing,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt
  };
};
