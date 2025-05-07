
import { useState, useCallback } from 'react';
import { useAuditCore } from './useAuditCore';
import { useScanningState } from './useScanningState';
import { useScanManager } from './useScanManager';
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
  
  // Обновление количества страниц в данных аудита
  const updateAuditPageCount = (pageCount: number) => {
    if (auditData) {
      setAuditData({
        ...auditData,
        pageCount: pageCount
      } as AuditData);
    }
  };
  
  // Основной хук для работы с данными аудита
  const { 
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    loadAuditData: loadAuditDataCore,
    setAuditData
  } = useAuditCore(url);
  
  // Хук для управления состоянием сканирования на стороне фронтенда
  const { 
    isScanning,
    scanDetails: frontendScanDetails,
    pageStats,
    sitemap,
    handleScanWebsite,
    downloadSitemap: downloadSitemapLocal,
  } = useScanningState(url, updateAuditPageCount);
  
  // Хук для управления сканированием через API бэкенда
  const {
    taskId,
    scanDetails: backendScanDetails,
    startScan
  } = useScanManager(url, updateAuditPageCount, setOptimizationCost, setOptimizationItems);

  /**
   * Загрузка данных аудита с опциями обновления и глубокого сканирования
   */
  const handleLoadAuditData = async (refresh = false, deepScan = false) => {
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
        const scanResult = await handleScanWebsite();
        
        if (scanResult) {
          if (scanResult && typeof scanResult === 'object') {
            if (scanResult.optimizationCost !== undefined) {
              setOptimizationCost(Number(scanResult.optimizationCost));
              
              if (scanResult.optimizationItems && Array.isArray(scanResult.optimizationItems)) {
                setOptimizationItems(scanResult.optimizationItems);
              }
            }
            
            if (scanResult.pagesContent && Array.isArray(scanResult.pagesContent)) {
              setPagesContent(scanResult.pagesContent);
            }
          }
        }
      }
      
      return result;
    }
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
    scanDetails: isScanning ? frontendScanDetails : backendScanDetails,
    pageStats,
    sitemap,
    taskId,
    setIsRefreshing,
    loadAuditData: handleLoadAuditData,
    downloadSitemapLocal
  };
};
