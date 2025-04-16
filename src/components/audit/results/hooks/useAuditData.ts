
import { useState } from 'react';
import { useAuditLoader } from './useAuditLoader';
import { useAuditExports } from './useAuditExports';
import { useOptimization } from './useOptimization';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';

export const useAuditData = (url: string) => {
  const [contentPrompt, setContentPrompt] = useState<string>('');
  
  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    optimizationScoresData,
    demoPage,
    pagesContent,
    setOptimizationCost,
    setOptimizationItems,
    setPagesContent,
    downloadOptimizedSite: localDownloadOptimizedSite,
    generatePdfReportFile
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

  const setContentOptimizationPrompt = (prompt: string) => {
    setContentPrompt(prompt);
  };

  return {
    // State
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
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    
    // Actions
    loadAuditData,
    setIsRefreshing,
    downloadSitemap: handleDownloadSitemap,
    downloadOptimizedSite: handleDownloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData: handleExportJSONData,
    optimizeSiteContent: handleOptimizeSiteContent,
    setContentOptimizationPrompt
  };
};
