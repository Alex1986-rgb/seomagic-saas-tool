
import { AuditData } from '@/types/audit';

/**
 * Hook for audit actions like downloading sitemap, optimizing site, etc.
 */
export const useAuditActions = (
  url: string,
  contentPrompt: string,
  auditData: AuditData | null,
  downloadSitemapLocal: () => void,
  localDownloadOptimizedSite: () => void,
  apiExportHandler: any,
  apiOptimizeSiteContent: any
) => {
  const handleDownloadSitemap = () => {
    downloadSitemapLocal();
  };

  const handleDownloadOptimizedSite = () => {
    localDownloadOptimizedSite();
  };

  const handleExportJSONData = () => {
    if (apiExportHandler) {
      apiExportHandler(auditData);
    }
  };

  const handleOptimizeSiteContent = () => {
    if (apiOptimizeSiteContent) {
      apiOptimizeSiteContent(contentPrompt);
    }
  };

  return {
    downloadSitemap: handleDownloadSitemap,
    downloadOptimizedSite: handleDownloadOptimizedSite,
    exportJSONData: handleExportJSONData,
    optimizeSiteContent: handleOptimizeSiteContent
  };
};
