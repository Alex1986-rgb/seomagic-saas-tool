
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
    startBackendScan,
    setupPolling,
    cancelScan: cancelScanInternal
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

  // Create renamed functions for compatibility
  const startScan = async (deepScan?: boolean): Promise<string> => {
    return await startBackendScan(deepScan);
  };
  
  // Forward the cancel scan method
  const cancelScan = async () => {
    return await cancelScanInternal();
  };

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
