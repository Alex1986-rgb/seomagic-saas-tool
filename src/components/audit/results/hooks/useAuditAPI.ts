
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';
import { ApiOptimizationItem } from '@/types/api';

export const useAuditAPI = (url: string) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(seoApiService.getTaskIdForUrl(url));
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [scanPollingInterval, setScanPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const startBackendScan = async (deepScan = false) => {
    try {
      // Set scanning state
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

  const setupPolling = (
    taskId: string, 
    onStatusUpdate: (status: any) => void,
    onComplete: (status: any) => void,
    onError: (error: string) => void
  ) => {
    // Clear any existing interval
    if (scanPollingInterval) {
      clearInterval(scanPollingInterval);
    }
    
    // Set up polling
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await seoApiService.getStatus(taskId);
        
        // Update scan details
        const currentScanDetails = {
          current_url: statusResponse.status === 'in_progress' ? `Scanning ${url}...` : '',
          pages_scanned: statusResponse.pages_scanned || 0,
          estimated_pages: statusResponse.total_pages || 0,
          stage: statusResponse.status
        };
        
        onStatusUpdate(currentScanDetails);
        
        // If scan is complete
        if (statusResponse.status === 'completed') {
          setIsPolling(false);
          clearInterval(intervalId);
          onComplete(statusResponse);
        }
        
        // Handle failed status
        if (statusResponse.status === 'failed') {
          setIsPolling(false);
          clearInterval(intervalId);
          
          onError(statusResponse.error || "Произошла ошибка при сканировании сайта");
        }
        
      } catch (error) {
        console.error('Error polling scan status:', error);
      }
    }, 2000);
    
    setScanPollingInterval(intervalId);
    return intervalId;
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
    }
  }, [taskId, toast]);

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
    }
  }, [taskId, toast]);

  const exportJSONData = useCallback(async (auditData: any) => {
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
  }, [taskId, toast]);

  const optimizeSiteContent = useCallback(async (contentPrompt: string) => {
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
  }, [taskId, toast]);
  
  const loadOptimizationCost = async (taskId: string, setOptimizationCost: (cost: number) => void, setOptimizationItems: (items: OptimizationItem[]) => void) => {
    try {
      const costData = await seoApiService.getOptimizationCost(taskId);
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
      return true;
    } catch (error) {
      console.error('Error loading optimization cost:', error);
      return false;
    }
  };

  return {
    taskId,
    isPolling,
    startBackendScan,
    setupPolling,
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent,
    loadOptimizationCost
  };
};
