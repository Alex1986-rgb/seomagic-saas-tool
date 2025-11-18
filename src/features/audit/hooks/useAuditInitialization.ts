
import { useState, useEffect, useRef } from 'react';
import { useScanContext } from '@/contexts/ScanContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for audit initialization with auto-start
 */
export const useAuditInitialization = (url: string, loadAuditData: (refresh?: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeout] = useState(false);
  const { taskId, isScanning, startScan } = useScanContext();
  const autoStartRef = useRef(false);
  const { toast } = useToast();

  // Auto-start audit if no taskId exists
  useEffect(() => {
    if (!autoStartRef.current && url && !taskId && !isScanning) {
      console.log('🚀 Auto-starting Quick Audit for:', url);
      autoStartRef.current = true;
      
      const autoStartAudit = async () => {
        try {
          const newTaskId = await startScan(false);
          if (newTaskId) {
            console.log('✅ Audit auto-started with task ID:', newTaskId);
          } else {
            throw new Error('No task ID returned from audit start');
          }
        } catch (err) {
          console.error('❌ Error auto-starting audit:', err);
          toast({
            title: "Ошибка запуска аудита",
            description: err instanceof Error ? err.message : 'Не удалось запустить аудит',
            variant: "destructive",
          });
          setHadError(true);
          autoStartRef.current = false;
        }
      };
      
      autoStartAudit();
    }
  }, [url, taskId, isScanning, startScan, toast]);

  // Load audit data when url changes and taskId exists
  useEffect(() => {
    if (url && taskId) {
      loadAuditData(false);
    }
  }, [url, taskId, loadAuditData]);

  const handleRetry = () => {
    setHadError(false);
    setTimeout(false);
    autoStartRef.current = false;
    loadAuditData(true);
  };

  return {
    isLoading,
    hadError,
    timeout,
    handleRetry,
    setIsLoading
  };
};
