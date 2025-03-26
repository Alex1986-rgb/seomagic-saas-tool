import { useState, useEffect } from 'react';
import { useAuditCore } from './useAuditCore';
import { useScanningState } from './useScanningState';
import { useOptimization } from './useOptimization';
import { usePdfReport } from './usePdfReport';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '../components/optimization';

export const useAuditData = (url: string) => {
  const { 
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setIsRefreshing,
    loadAuditData,
    setAuditData
  } = useAuditCore(url);

  const updateAuditPageCount = (pageCount: number) => {
    if (auditData) {
      setAuditData({
        ...auditData,
        pageCount: pageCount
      } as AuditData);
    }
  };

  const { 
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    handleScanWebsite,
    downloadSitemap
  } = useScanningState(url, updateAuditPageCount);

  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    optimizationScoresData,
    demoPage,
    contentPrompt,
    pagesContent,
    setOptimizationCost,
    setOptimizationItems,
    setPagesContent,
    downloadOptimizedSite,
    setContentOptimizationPrompt
  } = useOptimization(url);

  const { generatePdfReportFile } = usePdfReport();

  const handleLoadAuditData = async (refresh = false, deepScan = false) => {
    const result = await loadAuditData(refresh, deepScan);
    
    if (deepScan) {
      const scanResult = await handleScanWebsite();
      
      if (scanResult) {
        if (scanResult.optimizationCost) {
          setOptimizationCost(scanResult.optimizationCost);
          
          if (scanResult.optimizationItems) {
            setOptimizationItems(scanResult.optimizationItems);
          }
        }
        
        if (scanResult.pagesContent) {
          setPagesContent(scanResult.pagesContent);
        }
      }
    }
    
    return result;
  };

  const handleGeneratePdfReport = async () => {
    return generatePdfReportFile({
      auditData,
      url,
      recommendations,
      pageStats,
      optimizationCost,
      optimizationItems
    });
  };

  return {
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
    loadAuditData: handleLoadAuditData,
    setIsRefreshing,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile: handleGeneratePdfReport,
    setContentOptimizationPrompt
  };
};
