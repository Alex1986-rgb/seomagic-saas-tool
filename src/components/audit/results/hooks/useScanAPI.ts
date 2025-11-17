
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { auditService } from '@/modules/audit';
import { ScanDetails } from '@/types/api';

export const useScanAPI = (url: string) => {
  const { toast } = useToast();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [scanPollingInterval, setScanPollingInterval] = useState<NodeJS.Timeout | null>(null);

  /**
   * Start a website scan using new audit module
   */
  const startBackendScan = async (deepScan = false) => {
    try {
      const maxPages = deepScan ? 500000 : 10000;
      const type = deepScan ? 'deep' : 'quick';
      
      const response = await auditService.startAudit(url, { maxPages, type });
      
      if (response.success && response.task_id) {
        setTaskId(response.task_id);
        setIsPolling(true);
        
        if (scanPollingInterval) {
          clearInterval(scanPollingInterval);
        }
        
        return response.task_id;
      } else {
        throw new Error(response.message || 'Failed to start audit');
      }
    } catch (error) {
      setIsPolling(false);
      
      toast({
        title: "Ошибка запуска сканирования",
        description: error instanceof Error ? error.message : "Не удалось запустить сканирование сайта",
        variant: "destructive"
      });
      
      console.error('Error starting scan:', error);
      return null;
    }
  };

  /**
   * Set up polling for scan status using new audit module
   */
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
        const statusResponse = await auditService.getAuditStatus(taskId);
        
        const currentScanDetails: ScanDetails = {
          current_url: statusResponse.current_url || (statusResponse.status === 'scanning' ? `Scanning ${url}...` : ''),
          pages_scanned: statusResponse.pages_scanned || 0,
          estimated_pages: statusResponse.total_pages || 0,
          stage: statusResponse.stage || statusResponse.status,
          progress: statusResponse.progress || 0,
          status: statusResponse.status,
          audit_data: (statusResponse as any).audit_data
        };
        
        onStatusUpdate(currentScanDetails);
        
        if (statusResponse.status === 'completed') {
          setIsPolling(false);
          clearInterval(intervalId);
          onComplete(statusResponse);
        }
        
        if (statusResponse.status === 'failed' || statusResponse.error) {
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

  /**
   * Cancel current scan using new audit module
   */
  const cancelScan = async () => {
    if (!taskId) return { success: false };
    
    try {
      await auditService.cancelAudit(taskId);
      
      if (scanPollingInterval) {
        clearInterval(scanPollingInterval);
        setScanPollingInterval(null);
      }
      
      setIsPolling(false);
      
      toast({
        title: "Сканирование отменено",
        description: "Процесс сканирования сайта был отменен"
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error cancelling scan:', error);
      
      toast({
        title: "Ошибка отмены",
        description: "Не удалось отменить сканирование сайта",
        variant: "destructive"
      });
      
      return { success: false };
    }
  };

  return {
    taskId,
    isPolling,
    startBackendScan,
    setupPolling,
    cancelScan
  };
};

export default useScanAPI;
