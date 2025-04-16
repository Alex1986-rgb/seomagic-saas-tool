
import { useScanAPI } from './useScanAPI';
import { useDownloadAPI } from './useDownloadAPI';
import { useOptimizationAPI } from './useOptimizationAPI';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';

export const useAuditAPI = (url: string) => {
  // Use the scan API hook
  const {
    taskId,
    isPolling,
    startBackendScan,
    setupPolling
  } = useScanAPI(url);

  // Use the download API hook
  const {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData
  } = useDownloadAPI(url, taskId);

  // Use the optimization API hook
  const {
    optimizeSiteContent,
    loadOptimizationCost
  } = useOptimizationAPI(taskId);

  return {
    taskId,
    isPolling,
    startBackendScan,
    setupPolling,
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent,
    loadOptimizationCost
  };
};
