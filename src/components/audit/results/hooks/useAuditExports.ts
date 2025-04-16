
import { useCallback } from 'react';
import { useDownloadAPI } from './useDownloadAPI';
import { useOptimizationAPI } from './useOptimizationAPI';
import { useScanAPI } from './useScanAPI';

export const useAuditExports = (url: string) => {
  const {
    taskId
  } = useScanAPI(url);
  
  const {
    downloadSitemap: apiDownloadSitemap,
    downloadOptimizedSite: apiDownloadOptimizedSite,
    exportJSONData: apiExportJSONData
  } = useDownloadAPI(url, taskId);

  const {
    optimizeSiteContent: apiOptimizeSiteContent
  } = useOptimizationAPI(taskId);

  const downloadSitemap = useCallback((localDownloadFn: () => void) => {
    if (taskId) {
      apiDownloadSitemap();
    } else {
      // Fall back to local implementation if no taskId
      localDownloadFn();
    }
  }, [taskId, apiDownloadSitemap]);

  const downloadOptimizedSite = useCallback((localDownloadFn: () => void) => {
    if (taskId) {
      apiDownloadOptimizedSite();
    } else {
      // Fall back to local implementation if no taskId
      localDownloadFn();
    }
  }, [taskId, apiDownloadOptimizedSite]);

  const exportJSONData = useCallback((auditData: any) => {
    apiExportJSONData(auditData);
  }, [apiExportJSONData]);

  const optimizeSiteContent = useCallback((contentPrompt: string) => {
    apiOptimizeSiteContent(contentPrompt);
  }, [apiOptimizeSiteContent]);

  return {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent
  };
};
