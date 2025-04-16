import { useState, useCallback } from 'react';
import { useAuditCore } from './useAuditCore';
import { useScanningState } from './useScanningState';
import { useOptimization } from './useOptimization';
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';
import { useToast } from "@/hooks/use-toast";
import { OptimizationItem as ApiOptimizationItem } from '@/types/api';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';
import { useAuditPolling } from '@/hooks/useAuditPolling';

export const useAuditData = (url: string) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(seoApiService.getTaskIdForUrl(url));

  const { 
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    setIsRefreshing,
    loadAuditData: loadAuditDataCore,
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
    downloadSitemap: downloadSitemapLocal,
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
    downloadOptimizedSite: downloadOptimizedSiteLocal,
    setContentOptimizationPrompt,
    generatePdfReportFile
  } = useOptimization(url);

  const polling = useAuditPolling(url, (statusResponse) => {
    if (statusResponse.pages_scanned) {
      updateAuditPageCount(statusResponse.pages_scanned);
    }
  });

  const startBackendScan = async (deepScan = false) => {
    try {
      const maxPages = deepScan ? 500000 : 10000;
      const response = await seoApiService.startCrawl(url, maxPages);
      setTaskId(response.task_id);
      await polling.startPolling(response.task_id);
      return response.task_id;
    } catch (error) {
      toast({
        title: "Ошибка запуска сканирования",
        description: "Не удалось запустить сканирование сайта",
        variant: "destructive"
      });
      console.error('Error starting scan:', error);
      return null;
    }
  };

  const handleLoadAuditData = async (refresh = false, deepScan = false) => {
    if (deepScan) {
      // Use backend scanning
      await startBackendScan(deepScan);
      // Load core audit data
      return loadAuditDataCore(refresh);
    } else {
      // Use frontend scanning (original implementation)
      const result = await loadAuditDataCore(refresh);
      
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
    }
  };

  const downloadSitemap = useCallback(async () => {
    if (taskId) {
      try {
        await seoApiService.downloadSitemap(taskId);
        toast({
          title: "Sitemap скачан",
          description: "Файл sitemap.xml успешно скачан",
        });
      } catch (error) {
        toast({
          title: "Ошибка скачивания",
          description: "Не удалось скачать sitemap.xml",
          variant: "destructive"
        });
        console.error('Error downloading sitemap:', error);
      }
    } else {
      // Fall back to local implementation if no taskId
      downloadSitemapLocal();
    }
  }, [taskId, downloadSitemapLocal, toast]);

  const downloadOptimizedSite = useCallback(async () => {
    if (taskId) {
      try {
        await seoApiService.downloadOptimizedSite(taskId);
        toast({
          title: "Оптимизированный сайт скачан",
          description: "Архив с оптимизированной версией сайта успешно скачан",
        });
      } catch (error) {
        toast({
          title: "Ошибка скачивания",
          description: "Не удалось скачать оптимизированную версию сайта",
          variant: "destructive"
        });
        console.error('Error downloading optimized site:', error);
      }
    } else {
      // Fall back to local implementation if no taskId
      downloadOptimizedSiteLocal();
    }
  }, [taskId, downloadOptimizedSiteLocal, toast]);

  const exportJSONData = useCallback(async () => {
    if (taskId) {
      try {
        await seoApiService.exportJSON(taskId);
        toast({
          title: "JSON экспортирован",
          description: "Данные в формате JSON успешно скачаны",
        });
      } catch (error) {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось экспортировать данные в JSON",
          variant: "destructive"
        });
        console.error('Error exporting JSON:', error);
      }
    } else if (auditData) {
      // Fall back to frontend implementation
      const dataStr = JSON.stringify(auditData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportName = `audit_${auditData.id || new Date().getTime()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast({
        title: "JSON экспортирован",
        description: "Данные в формате JSON успешно сохранены",
      });
    }
  }, [taskId, auditData, toast]);

  const optimizeSiteContent = useCallback(async () => {
    if (taskId) {
      try {
        await seoApiService.optimizeSite(taskId, contentPrompt);
        toast({
          title: "Оптимизация запущена",
          description: "Процесс оптимизации сайта успешно запущен",
        });
      } catch (error) {
        toast({
          title: "Ошибка оптимизации",
          description: "Не удалось запустить оптимизацию сайта",
          variant: "destructive"
        });
        console.error('Error optimizing site:', error);
      }
    }
  }, [taskId, contentPrompt, toast]);

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
    taskId,
    loadAuditData: handleLoadAuditData,
    setIsRefreshing,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt
  };
};
