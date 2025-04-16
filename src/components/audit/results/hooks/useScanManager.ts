
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AuditData } from '@/types/audit';
import { OptimizationItem } from '../components/optimization/CostDetailsTable';
import { useScanAPI } from './useScanAPI';
import { useOptimizationAPI } from './useOptimizationAPI';

export const useScanManager = (
  url: string, 
  updateAuditPageCount: (count: number) => void,
  setOptimizationCost: (cost: number) => void,
  setOptimizationItems: (items: OptimizationItem[]) => void
) => {
  const { toast } = useToast();
  const [scanDetails, setScanDetails] = useState({
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle'
  });
  
  const { 
    taskId,
    startBackendScan,
    setupPolling
  } = useScanAPI(url);

  const {
    loadOptimizationCost
  } = useOptimizationAPI(taskId);

  const startScan = async (deepScan: boolean) => {
    const newTaskId = await startBackendScan(deepScan);
    
    if (!newTaskId) return false;
    
    const intervalId = setupPolling(
      newTaskId,
      // On status update
      (status) => {
        setScanDetails({
          current_url: status.current_url,
          pages_scanned: status.pages_scanned,
          estimated_pages: status.estimated_pages,
          stage: status.stage
        });
      },
      // On complete
      async (statusResponse) => {
        // Update audit data with new page count
        updateAuditPageCount(statusResponse.pages_scanned || 0);
        
        // Load optimization cost data
        await loadOptimizationCost(newTaskId, setOptimizationCost, setOptimizationItems);
        
        toast({
          title: "Сканирование завершено",
          description: `Обнаружено ${statusResponse.pages_scanned} страниц на сайте ${url}`,
        });
      },
      // On error
      (errorMsg) => {
        toast({
          title: "Ошибка сканирования",
          description: errorMsg,
          variant: "destructive"
        });
      }
    );
    
    return true;
  };

  return {
    taskId,
    scanDetails,
    startScan
  };
};
