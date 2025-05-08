
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { useAuditActions } from './useAuditActions';

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
    downloadOptimizedSite
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
