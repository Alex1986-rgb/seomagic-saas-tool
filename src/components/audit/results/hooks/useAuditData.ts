
import { useState, useCallback } from 'react';
import { useAuditCore } from './useAuditCore';
import { useScanningState } from './useScanningState';
import { useOptimization } from './useOptimization';
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';
import { useToast } from "@/hooks/use-toast";
import { OptimizationItem as ApiOptimizationItem } from '@/types/api';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';

export const useAuditData = (url: string) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(seoApiService.getTaskIdForUrl(url));
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [scanPollingInterval, setScanPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
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

  const startBackendScan = async (deepScan = false) => {
    try {
      // Set scanning state
      const isScanning = true;
      const maxPages = deepScan ? 500000 : 10000;
      
      // Start the crawl
      const response = await seoApiService.startCrawl(url, maxPages);
      setTaskId(response.task_id);
      
      // Begin polling for updates
      setIsPolling(true);
      
      // Clear any existing interval
      if (scanPollingInterval) {
        clearInterval(scanPollingInterval);
      }
      
      // Set up polling
      const intervalId = setInterval(async () => {
        try {
          const statusResponse = await seoApiService.getStatus(response.task_id);
          
          // Update scan details
          const currentScanDetails = {
            current_url: statusResponse.status === 'in_progress' ? `Scanning ${url}...` : '',
            pages_scanned: statusResponse.pages_scanned || 0,
            estimated_pages: statusResponse.total_pages || 0,
            stage: statusResponse.status
          };
          
          // If scan is complete
          if (statusResponse.status === 'completed') {
            setIsPolling(false);
            clearInterval(intervalId);
            
            // Load optimization cost data
            try {
              const costData = await seoApiService.getOptimizationCost(response.task_id);
              setOptimizationCost(costData.total);
              
              // Convert API OptimizationItem to component OptimizationItem
              const convertedItems: OptimizationItem[] = costData.items.map((item: ApiOptimizationItem) => ({
                name: item.name,
                count: item.count,
                price: item.price,
                type: item.type || 'service',
                pricePerUnit: item.price / item.count,
                totalPrice: item.price,
                description: item.description || item.name
              }));
              
              setOptimizationItems(convertedItems);
            } catch (error) {
              console.error('Error loading optimization cost:', error);
            }
            
            // Update audit data with new page count
            updateAuditPageCount(statusResponse.pages_scanned || 0);
            
            toast({
              title: "Сканирование завершено",
              description: `Обнаружено ${statusResponse.pages_scanned} страниц на сайте ${url}`,
            });
          }
          
          // Handle failed status
          if (statusResponse.status === 'failed') {
            setIsPolling(false);
            clearInterval(intervalId);
            
            toast({
              title: "Ошибка сканирования",
              description: statusResponse.error || "Произошла ошибка при сканировании сайта",
              variant: "destructive"
            });
          }
          
        } catch (error) {
          console.error('Error polling scan status:', error);
        }
      }, 2000);
      
      setScanPollingInterval(intervalId);
      
      return response.task_id;
    } catch (error) {
      setIsPolling(false);
      
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
