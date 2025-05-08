import { useState, useEffect } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { reportingService } from '@/services/reporting/reportingService';

interface AuditLoaderResult {
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
}

export const useAuditLoader = (url: string) => {
  const {
    setAuditData,
    setRecommendations,
    setHistoryData,
    setError,
    setIsLoading,
    setLoadingProgress,
    setIsRefreshing,
    setOptimizationCost,
    setOptimizationItems,
    setIsOptimized,
    setContentOptimizationPrompt,
    setTaskId,
    setIsScanning,
    setScanDetails,
    setPageStats,
    setSitemap
  } = useAuditContext();
  
  const { startScan } = useScanContext();
  const [scanResult, setScanResult] = useState<AuditLoaderResult | null>(null);

  // Add null checks for scanResult
  const processScanResult = (url: string, scanResult: any) => {
    if (!scanResult) return null;
    
    // Safely access properties with null checks
    const taskId = scanResult?.task_id || null;
    if (taskId) {
      localStorage.setItem(`task_id_${url}`, taskId);
    }
    
    // Ensure we have valid data in the scan result
    const scanDetails = {
      current_url: scanResult?.current_url || '',
      pages_scanned: scanResult?.pages_scanned || 0,
      estimated_pages: scanResult?.total_pages || 0,
      stage: scanResult?.status || 'idle',
      progress: scanResult?.progress || 0
    };
    
    // Get page statistics if they exist
    const pageStats = scanResult?.page_stats ? {
      total: scanResult?.page_stats?.total || 0,
      html: scanResult?.page_stats?.html || 0,
      images: scanResult?.page_stats?.images || 0,
      other: scanResult?.page_stats?.other || 0
    } : null;
    
    // Get sitemap if it exists
    const sitemap = scanResult?.sitemap || null;
    
    return {
      taskId,
      scanDetails,
      pageStats,
      sitemap
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      setError(null);
      setIsRefreshing(false);
      
      try {
        // 1. Start the scan and get the task ID
        const taskId = await startScan();
        setTaskId(taskId);
        
        // 2. Fetch scan result from local storage
        const storedScanResult = localStorage.getItem(`scanResult_${url}`);
        if (storedScanResult) {
          const parsedScanResult = JSON.parse(storedScanResult);
          setScanResult(processScanResult(url, parsedScanResult));
        }
        
        // 3. Fetch audit data from local storage
        const storedAuditData = localStorage.getItem(`auditData_${url}`);
        if (storedAuditData) {
          setAuditData(JSON.parse(storedAuditData));
        }
        
        // 4. Fetch recommendations from local storage
        const storedRecommendations = localStorage.getItem(`recommendations_${url}`);
        if (storedRecommendations) {
          setRecommendations(JSON.parse(storedRecommendations));
        }
        
        // 5. Fetch history data from local storage
        const storedHistoryData = localStorage.getItem(`historyData_${url}`);
        if (storedHistoryData) {
          setHistoryData(JSON.parse(storedHistoryData));
        }
        
        // 6. Fetch optimization data from local storage
        const storedOptimizationCost = localStorage.getItem(`optimizationCost_${url}`);
        if (storedOptimizationCost) {
          setOptimizationCost(JSON.parse(storedOptimizationCost));
        }
        const storedOptimizationItems = localStorage.getItem(`optimizationItems_${url}`);
        if (storedOptimizationItems) {
          setOptimizationItems(JSON.parse(storedOptimizationItems));
        }
        
        // 7. Fetch content optimization prompt from local storage
        const storedContentOptimizationPrompt = localStorage.getItem(`contentOptimizationPrompt_${url}`);
        if (storedContentOptimizationPrompt) {
          setContentOptimizationPrompt(storedContentOptimizationPrompt);
        }
        
        // 8. Set isOptimized from local storage
        const storedIsOptimized = localStorage.getItem(`isOptimized_${url}`);
        if (storedIsOptimized) {
          setIsOptimized(JSON.parse(storedIsOptimized));
        }
      } catch (err: any) {
        console.error("Error during audit data loading:", err);
        setError(err.message || "Failed to load audit data");
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      loadData();
    }
  }, [url, startScan, setAuditData, setRecommendations, setHistoryData, setError, setIsLoading, setLoadingProgress, setIsRefreshing, setOptimizationCost, setOptimizationItems, setContentOptimizationPrompt, setIsOptimized, setTaskId, setScanDetails, setPageStats, setSitemap]);

  return { scanResult };
};
