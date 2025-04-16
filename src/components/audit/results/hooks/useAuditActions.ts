
import { useAuditExports } from './useAuditExports';
import { AuditData } from '@/types/audit';

export const useAuditActions = (
  url: string,
  contentPrompt: string,
  auditData: AuditData | null,
  downloadSitemapLocal: () => void,
  localDownloadOptimizedSite: () => void
) => {
  const {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent
  } = useAuditExports(url);

  const handleDownloadSitemap = () => {
    downloadSitemap(downloadSitemapLocal);
  };

  const handleDownloadOptimizedSite = () => {
    downloadOptimizedSite(localDownloadOptimizedSite);
  };

  const handleExportJSONData = () => {
    exportJSONData(auditData);
  };

  const handleOptimizeSiteContent = () => {
    optimizeSiteContent(contentPrompt);
  };

  return {
    downloadSitemap: handleDownloadSitemap,
    downloadOptimizedSite: handleDownloadOptimizedSite,
    exportJSONData: handleExportJSONData,
    optimizeSiteContent: handleOptimizeSiteContent
  };
};

export default useAuditActions;
