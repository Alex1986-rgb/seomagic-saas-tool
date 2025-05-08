
import { useState, useEffect } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { reportingService } from '@/services/reporting/reportingService';

export interface AuditLoaderResult {
  taskId: string | null;
  scanDetails: {
    current_url: string;
    pages_scanned: number;
    estimated_pages: number;
    stage: string;
    progress: number;
  };
  pageStats: {
    total: number;
    html: number;
    images: number;
    other: number;
  } | null;
  sitemap: string | null;
  isLoading: boolean;
  loadingProgress: number;
  auditData: any | null;
  recommendations: any | null;
  historyData: any | null;
  error: string | null;
  isRefreshing: boolean;
  isScanning: boolean;
}

export const useAuditLoader = (url: string) => {
  const {
    auditData,
    recommendations,
    historyData,
    isLoading,
    loadingProgress,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    taskId,
    loadAuditData
  } = useAuditContext();
  
  const { startScan } = useScanContext();
  const [scanResult, setScanResult] = useState<AuditLoaderResult | null>(null);

  // Process scan result safely with null checks
  const processScanResult = (urlParam: string, result: any) => {
    if (!result) return null;
    
    // Safely access properties with null checks
    const taskId = result?.task_id || null;
    if (taskId) {
      localStorage.setItem(`task_id_${urlParam}`, taskId);
    }
    
    // Ensure we have valid data in the scan result
    const scanDetails = {
      current_url: result?.current_url || '',
      pages_scanned: result?.pages_scanned || 0,
      estimated_pages: result?.total_pages || 0,
      stage: result?.status || 'idle',
      progress: result?.progress || 0
    };
    
    // Get page statistics if they exist
    const pageStats = result?.page_stats ? {
      total: result?.page_stats?.total || 0,
      html: result?.page_stats?.html || 0,
      images: result?.page_stats?.images || 0,
      other: result?.page_stats?.other || 0
    } : null;
    
    // Get sitemap if it exists
    const sitemap = result?.sitemap || null;
    
    return {
      taskId,
      scanDetails,
      pageStats,
      sitemap,
      isLoading,
      loadingProgress,
      auditData,
      recommendations,
      historyData,
      error,
      isRefreshing,
      isScanning
    };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Start the scan and get the task ID
        const taskId = await startScan();
        
        // 2. Fetch scan result from local storage
        const storedScanResult = localStorage.getItem(`scanResult_${url}`);
        if (storedScanResult) {
          const parsedScanResult = JSON.parse(storedScanResult);
          const processedResult = processScanResult(url, parsedScanResult);
          if (processedResult) {
            setScanResult(processedResult);
          }
        }
      } catch (err: any) {
        console.error("Error during audit data loading:", err);
      }
    };

    if (url) {
      loadData();
    }
  }, [url, startScan, auditData, recommendations, historyData, error, isLoading, loadingProgress, isRefreshing, isScanning]);

  return { 
    scanResult,
    // Return these directly from context to ensure they're always available
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
    loadAuditData
  };
};
