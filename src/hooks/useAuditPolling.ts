
import { useState, useEffect } from 'react';
import { seoApiService } from '@/api/seoApiService';
import { useToast } from '@/hooks/use-toast';

export function useAuditPolling(url: string, onComplete: (data: any) => void) {
  const [isPolling, setIsPolling] = useState(false);
  const [scanPollingInterval, setScanPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startPolling = async (taskId: string) => {
    if (isPolling) return;
    
    setIsPolling(true);
    
    if (scanPollingInterval) {
      clearInterval(scanPollingInterval);
    }
    
    const intervalId = setInterval(async () => {
      try {
        const statusResponse = await seoApiService.getStatus(taskId);
        
        if (statusResponse.status === 'completed') {
          setIsPolling(false);
          clearInterval(intervalId);
          onComplete(statusResponse);
          
          toast({
            title: "Сканирование завершено",
            description: `Обнаружено ${statusResponse.pages_scanned} страниц на сайте ${url}`,
          });
        }
        
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
  };

  useEffect(() => {
    return () => {
      if (scanPollingInterval) {
        clearInterval(scanPollingInterval);
      }
    };
  }, [scanPollingInterval]);

  return {
    isPolling,
    startPolling,
    stopPolling: () => {
      setIsPolling(false);
      if (scanPollingInterval) {
        clearInterval(scanPollingInterval);
      }
    }
  };
}
