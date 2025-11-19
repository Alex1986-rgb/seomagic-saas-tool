
import { useEffect } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Base hook that provides shared audit data for other hooks
 */
export const useAuditBase = (url: string) => {
  const {
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    isRefreshing,
    auditResults,
    taskMetrics,
    pageAnalysis,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    setContentOptimizationPrompt,
    loadAuditData,
    generatePdfReportFile
  } = useAuditContext();
  
  const {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    downloadSitemap: downloadSitemapLocal
  } = useScanContext();

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
    auditResults,
    taskMetrics,
    pageAnalysis,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    
    // Actions
    loadAuditData,
    setIsRefreshing: (value: boolean) => {}, // This would be implemented in the context
    downloadSitemapLocal,
    generatePdfReportFile,
    setContentOptimizationPrompt
  };
};
