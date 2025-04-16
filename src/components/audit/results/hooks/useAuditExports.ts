
import { useCallback } from 'react';
import { useAuditAPI } from './useAuditAPI';

export const useAuditExports = (url: string) => {
  const {
    taskId,
    downloadSitemap: apiDownloadSitemap,
    downloadOptimizedSite: apiDownloadOptimizedSite,
    exportJSONData: apiExportJSONData,
    optimizeSiteContent: apiOptimizeSiteContent
  } = useAuditAPI(url);

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
