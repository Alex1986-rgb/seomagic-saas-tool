
import { useState, useEffect, useRef } from 'react';
import { useScanContext } from '@/contexts/ScanContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for audit initialization with auto-start
 * CRITICAL: Auto-start must happen BEFORE any data loading
 */
export const useAuditInitialization = (url: string, loadAuditData: (refresh?: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeout] = useState(false);
  const { taskId, isScanning, startScan } = useScanContext();
  const autoStartRef = useRef(false);
  const { toast } = useToast();

  console.log('🔧 useAuditInitialization:', { url, taskId, isScanning, autoStarted: autoStartRef.current });

  // STEP 1: Auto-start audit if no taskId exists (HIGHEST PRIORITY)
  useEffect(() => {
    console.log('🔍 useAuditInitialization check:', { 
      url, 
      hasUrl: !!url,
      taskId, 
      isScanning, 
      autoStarted: autoStartRef.current 
    });
    
    if (!autoStartRef.current && url && !taskId && !isScanning) {
      console.log('🚀 Auto-starting Quick Audit for:', url);
      autoStartRef.current = true;
      
      const autoStartAudit = async () => {
        try {
          console.log('📡 Calling startScan(false) for quick audit...');
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
          autoStartRef.current = false; // Allow retry
        }
      };
      
      autoStartAudit();
    }
  }, [url, taskId, isScanning, startScan, toast]);

  // STEP 2: Load audit data when url changes and taskId exists
  useEffect(() => {
    if (url && taskId) {
      console.log('📊 Loading audit data for taskId:', taskId);
      loadAuditData(false);
    }
  }, [url, taskId, loadAuditData]);

  const handleRetry = () => {
    console.log('🔄 Retrying audit...');
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

