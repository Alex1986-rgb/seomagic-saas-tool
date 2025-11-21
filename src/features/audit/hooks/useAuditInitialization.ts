
import { useState, useEffect, useRef } from 'react';
import { useScanContext } from '@/contexts/ScanContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for audit initialization with auto-start
 */
export const useAuditInitialization = (url: string, loadAuditData: (refresh?: boolean) => void) => {
  console.log('🎯 useAuditInitialization HOOK CALLED with url:', url);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeout] = useState(false);
  const { taskId, isScanning, startScan } = useScanContext();
  const autoStartRef = useRef(false);
  const { toast } = useToast();

  console.log('🔧 useAuditInitialization state:', { 
    url, 
    taskId, 
    isScanning, 
    autoStarted: autoStartRef.current,
    isLoading,
    hadError,
    timeout
  });

  // Auto-start audit if no taskId exists with timeout fallback
  useEffect(() => {
    console.log('🔍 useAuditInitialization effect triggered');
    console.log('  ├─ url:', url, '(has url:', !!url, ')');
    console.log('  ├─ taskId:', taskId, '(no taskId:', !taskId, ')');
    console.log('  ├─ isScanning:', isScanning, '(not scanning:', !isScanning, ')');
    console.log('  ├─ autoStartRef.current:', autoStartRef.current, '(not started:', !autoStartRef.current, ')');
    console.log('  └─ All conditions met:', !autoStartRef.current && url && !taskId && !isScanning);
    
    if (!autoStartRef.current && url && !taskId && !isScanning) {
      console.log('✅ All conditions met! Auto-starting Quick Audit for:', url);
      autoStartRef.current = true;
      
      const autoStartAudit = async () => {
        try {
          console.log('📡 Calling startScan(false) for quick audit...');
          const newTaskId = await startScan(false);
          if (newTaskId) {
            console.log('✅ Audit auto-started with task ID:', newTaskId);
            toast({
              title: "Аудит запущен",
              description: "Начинаем сканирование сайта...",
            });
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
      
      // Set a timeout fallback in case autostart doesn't work
      const timeoutId = window.setTimeout(() => {
        if (!taskId && !hadError) {
          console.warn('⚠️ Auto-start timeout reached (10s) - audit may have failed to start');
          setTimeout(true);
          setHadError(false); // Don't set error, just timeout
        }
      }, 10000);
      
      autoStartAudit();
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('❌ Conditions not met, skipping auto-start');
    }
  }, [url, taskId, isScanning, startScan, toast, hadError]);

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
