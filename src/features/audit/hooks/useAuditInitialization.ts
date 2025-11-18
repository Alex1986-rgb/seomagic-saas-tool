
import { useState, useEffect, useRef } from 'react';
import { useScanContext } from '@/contexts/ScanContext';

/**
 * Hook for audit initialization with auto-start
 */
export const useAuditInitialization = (url: string, loadAuditData: (refresh?: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeout] = useState(false);
  const { taskId, isScanning, startScan } = useScanContext();
  const autoStartRef = useRef(false);

  // Auto-start audit if no taskId exists
  useEffect(() => {
    if (!autoStartRef.current && url && !taskId && !isScanning) {
      console.log('🚀 Auto-starting Quick Audit for:', url);
      autoStartRef.current = true;
      
      startScan(false).then((newTaskId) => {
        if (newTaskId) {
          console.log('✅ Audit auto-started with task ID:', newTaskId);
        }
      }).catch((err) => {
        console.error('❌ Error auto-starting audit:', err);
        setHadError(true);
        autoStartRef.current = false;
      });
    }
  }, [url, taskId, isScanning, startScan]);

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
