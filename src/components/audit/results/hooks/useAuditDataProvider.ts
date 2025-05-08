
import { useState } from 'react';
import { useAuditLoader } from './useAuditLoader';
import { useAuditExports } from './useAuditExports';
import { useOptimization } from './useOptimization';

export const useAuditDataProvider = (url: string) => {
  const [contentPrompt, setContentPrompt] = useState<string>('');
  
  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    generatePdfReportFile,
    downloadOptimizedSite: localDownloadOptimizedSite,
    setOptimizationCost,
    setOptimizationItems,
    setPagesContent
  } = useOptimization(url);
  
  const {
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    isRefreshing,
    isScanning,
    scanDetails,
    taskId,
    loadAuditData,
    scanResult
  } = useAuditLoader(url);
  
  // Extract the sitemap and pageStats from scanResult
  const sitemap = scanResult?.sitemap || null;
  const pageStats = scanResult?.pageStats || null;
  
  // Use the downloadSitemapLocal from another hook or define it here
  const { downloadSitemap: downloadSitemapLocal } = useAuditExports(url);
  
  // Define setIsRefreshing as a dummy function since it's not used
  const setIsRefreshing = () => {
    console.log("setIsRefreshing is not implemented");
  };

  return {
    // State
    contentPrompt,
    setContentPrompt,
    // Optimization hooks
    optimizationCost,
    optimizationItems,
    isOptimized,
    generatePdfReportFile,
    // Loader hooks
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    setIsRefreshing,
    loadAuditData,
    // Local functions
    downloadSitemapLocal,
    localDownloadOptimizedSite
  };
};

export default useAuditDataProvider;
