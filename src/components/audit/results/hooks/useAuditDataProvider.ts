
import { useState } from 'react';
import { useAuditLoader } from './useAuditLoader';
import { useAuditExports } from './useAuditExports';
import { useOptimization } from './useOptimization';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';

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
    downloadSitemapLocal
  } = useAuditLoader(url, setOptimizationCost, setOptimizationItems, setPagesContent);
  
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
