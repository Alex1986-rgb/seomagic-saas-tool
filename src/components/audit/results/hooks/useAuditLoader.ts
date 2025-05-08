
import { useState, useCallback } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { AuditData } from '@/types/audit';
import { useToast } from "@/hooks/use-toast";

/**
 * Хук для загрузки данных аудита и управления их состоянием
 */
export const useAuditLoader = (
  url: string,
  setOptimizationCost: (cost: number) => void,
  setOptimizationItems: (items: any[]) => void,
  setPagesContent: (content: any[]) => void
) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Use contexts
  const {
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    loadAuditData: loadAuditDataCore
  } = useAuditContext();
  
  const {
    isScanning,
    scanDetails: frontendScanDetails,
    pageStats,
    sitemap,
    taskId,
    startScan,
    downloadSitemap: downloadSitemapLocal
  } = useScanContext();
  
  // Обновление количества страниц в данных аудита
  const updateAuditPageCount = useCallback((pageCount: number) => {
    if (auditData) {
      // Instead of directly modifying auditData, we would use a state setter
      console.log("Updating audit page count to:", pageCount);
      // In a real implementation, we would update the context
    }
  }, [auditData]);
  
  /**
   * Загрузка данных аудита с опциями обновления и глубокого сканирования
   */
  const handleLoadAuditData = useCallback(async (refresh = false, deepScan = false) => {
    if (deepScan) {
      // Use backend scanning
      const scanStarted = await startScan(deepScan);
      if (!scanStarted) return null;
      
      // Load core audit data
      return loadAuditDataCore(refresh);
    } else {
      // Use frontend scanning (original implementation)
      const result = await loadAuditDataCore(refresh);
      
      if (deepScan) {
        // Execute scan
        const scanResult = await startScan(true);
        
        // Safe handling of scan result
        if (scanResult && typeof scanResult === 'object') {
          // If scanResult is a proper JSON object with optimization data
          if ('optimizationCost' in scanResult && scanResult.optimizationCost !== null) {
            const cost = Number(scanResult.optimizationCost);
            if (!isNaN(cost)) {
              setOptimizationCost(cost);
            }
          }
          
          if ('optimizationItems' in scanResult && 
              Array.isArray(scanResult.optimizationItems)) {
            setOptimizationItems(scanResult.optimizationItems);
          }
          
          if ('pagesContent' in scanResult && 
              Array.isArray(scanResult.pagesContent)) {
            setPagesContent(scanResult.pagesContent);
          }
        }
      }
      
      return result;
    }
  }, [startScan, loadAuditDataCore, setOptimizationCost, setOptimizationItems, setPagesContent]);

  return {
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails: isScanning ? frontendScanDetails : { 
      current_url: '',
      pages_scanned: 0,
      estimated_pages: 0,
      stage: 'idle'
    },
    pageStats,
    sitemap,
    taskId,
    setIsRefreshing,
    loadAuditData: handleLoadAuditData,
    downloadSitemapLocal
  };
};
