
import { useScanAPI } from '@/components/audit/results/hooks/useScanAPI';
import { useDownloadAPI } from '@/hooks/use-download-api';
import { useOptimizationAPI } from '@/hooks/use-optimization-api';

/**
 * Unified hook for all audit-related API operations
 */
export const useAuditAPI = (url: string) => {
  // Use the scan API hook
  const {
    taskId,
    isPolling,
    startScan,
    setupPolling,
    cancelScan
  } = useScanAPI(url);

  // Use the download API hook
  const {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    generatePdfReport
  } = useDownloadAPI(url, taskId);

  // Use the optimization API hook
  const {
    isLoadingCost,
    loadOptimizationCost,
    optimizeSiteContent,
    startOptimization
  } = useOptimizationAPI(taskId);

  return {
    // Scan API
    taskId,
    isPolling,
    startScan,
    setupPolling,
    cancelScan,
    
    // Download API
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    generatePdfReport,
    
    // Optimization API
    isLoadingCost,
    loadOptimizationCost,
    optimizeSiteContent,
    startOptimization
  };
};
