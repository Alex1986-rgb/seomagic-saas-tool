
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';

export const useAuditData = (url: string) => {
  const {
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    isRefreshing,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    setContentOptimizationPrompt,
    loadAuditData,
    generatePdfReportFile
  } = useAuditContext();
  
  const {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    downloadSitemap: downloadSitemapLocal
  } = useScanContext();

  // Import locally to avoid circular dependency
  const { useAuditActions } = require('./useAuditActions');

  // Use actions from audit actions hook
  const {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent
  } = useAuditActions(
    url,
    contentPrompt,
    auditData,
    downloadSitemapLocal
  );

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
    setIsRefreshing: (value: boolean) => {}, // This would be implemented in the context
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt
  };
};
