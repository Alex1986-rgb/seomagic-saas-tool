
import { useAuditBase } from './useAuditBase';
import { useAuditActions } from './useAuditActions';
import { useAuditExports } from './useAuditExports';
import { useOptimization } from './useOptimization';

/**
 * Main hook for audit data and actions
 */
export const useAuditData = (url: string) => {
  // Get base audit data from context
  const baseData = useAuditBase(url);
  
  // Get export APIs
  const {
    downloadSitemap: apiDownloadSitemap,
    downloadOptimizedSite: apiDownloadOptimizedSite,
    exportJSONData: apiExportJSONData,
    optimizeSiteContent: apiOptimizeSiteContent
  } = useAuditExports(url);
  
  // Get optimization functionality
  const { 
    downloadOptimizedSite: localDownloadOptimizedSite
  } = useOptimization(url);
  
  // Create actions using our exported APIs
  const actions = useAuditActions(
    url,
    baseData.contentPrompt,
    baseData.auditData,
    baseData.downloadSitemapLocal,
    localDownloadOptimizedSite,
    apiExportJSONData,
    apiOptimizeSiteContent
  );

  // Return combined data and actions
  return {
    ...baseData,
    ...actions,
    downloadSitemap: actions.downloadSitemap,
    downloadOptimizedSite: actions.downloadOptimizedSite,
    exportJSONData: actions.exportJSONData,
    optimizeSiteContent: actions.optimizeSiteContent
  };
};
