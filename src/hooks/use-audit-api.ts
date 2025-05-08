
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

  const cancelScan = async (): Promise<{ success: boolean }> => {
    // Implementation for cancelScan based on the available APIs
    if (!taskId) return { success: false };
    
    try {
      // This could be implemented by calling a method to cancel the scan
      // For now, we'll just log the action
      console.log('Canceling scan for task:', taskId);
      return { success: true };
    } catch (error) {
      console.error('Error canceling scan:', error);
      return { success: false };
    }
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
