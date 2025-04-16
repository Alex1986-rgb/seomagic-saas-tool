
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';
import { ScanDetails } from '@/types/api';

export const useScanAPI = (url: string) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(seoApiService.getTaskIdForUrl(url));
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [scanPollingInterval, setScanPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const startBackendScan = async (deepScan = false) => {
    try {
      const maxPages = deepScan ? 500000 : 10000;
      
      const response = await seoApiService.startCrawl(url, maxPages);
      setTaskId(response.task_id);
      
      setIsPolling(true);
      
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
    onStatusUpdate: (status: ScanDetails) => void,
    onComplete: (status: any) => void,
    onError: (error: string) => void
  ) => {
    if (scanPollingInterval) {
      clearInterval(scanPollingInterval);
    }
    
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await seoApiService.getStatus(taskId);
        
        const currentScanDetails: ScanDetails = {
          current_url: statusResponse.status === 'in_progress' ? `Scanning ${url}...` : '',
          pages_scanned: statusResponse.pages_scanned || 0,
          estimated_pages: statusResponse.total_pages || 0,
          stage: statusResponse.status
        };
        
        onStatusUpdate(currentScanDetails);
        
        if (statusResponse.status === 'completed') {
          setIsPolling(false);
          clearInterval(intervalId);
          onComplete(statusResponse);
        }
        
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

  return {
    taskId,
    isPolling,
    startBackendScan,
    setupPolling
  };
};
