
import { AuditData } from '@/types/audit';

/**
 * Hook for audit actions like downloading sitemap, optimizing site, etc.
 */
export const useAuditActions = (
  url: string,
  contentPrompt: string,
  auditData: AuditData | null,
  downloadSitemapLocal: () => void,
  localDownloadOptimizedSite: () => Promise<void>,
  apiExportHandler: any,
  apiOptimizeSiteContent: any
) => {
  const handleDownloadSitemap = () => {
    downloadSitemapLocal();
  };

  const handleDownloadOptimizedSite = async (): Promise<void> => {
    return localDownloadOptimizedSite();
  };

  const handleExportJSONData = () => {
    if (apiExportHandler) {
      apiExportHandler(auditData);
    }
  };

  const handleOptimizeSiteContent = async (): Promise<void> => {
    if (apiOptimizeSiteContent) {
      return apiOptimizeSiteContent(contentPrompt);
    }
    return Promise.resolve();
  };

  return {
    downloadSitemap: handleDownloadSitemap,
    downloadOptimizedSite: handleDownloadOptimizedSite,
    exportJSONData: handleExportJSONData,
    optimizeSiteContent: handleOptimizeSiteContent
  };
};
