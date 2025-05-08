
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useAuditInitialization(url: string, loadAuditData: (refresh?: boolean) => Promise<void>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeoutStatus] = useState(false);
  const { toast } = useToast();
  
  const initRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup timeout for the audit process
  useEffect(() => {
    if (url && !timeout && isInitialized) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // 3-minute timeout for loading data
      timeoutRef.current = setTimeout(() => {
        console.log("Audit data loading timeout triggered after 3 minutes");
        setTimeoutStatus(true);
        setIsLoading(false);
        setHadError(true);
        
        toast({
          title: "Превышено время ожидания",
          description: "Загрузка данных аудита заняла слишком много времени. Пожалуйста, попробуйте снова или используйте другой URL.",
          variant: "destructive",
        });
      }, 180000) as unknown as NodeJS.Timeout;
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, timeout, isInitialized, toast]);

  // Initialize audit function
  const initializeAudit = useCallback(() => {
    if (initRef.current) return;
    
    console.log("Initializing audit for URL:", url);
    try {
      initRef.current = true;
      setIsLoading(true);
      
      loadAuditData(false).then(() => {
        setIsLoading(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }).catch(err => {
        console.error("Error loading audit data:", err);
        setHadError(true);
        setIsLoading(false);
        toast({
          title: "Ошибка загрузки аудита",
          description: "Произошла ошибка при загрузке данных аудита",
          variant: "destructive"
        });
      });
    } catch (err) {
      console.error("Exception during audit initialization:", err);
      setHadError(true);
      setIsLoading(false);
    }
    setIsInitialized(true);
  }, [url, loadAuditData, toast]);

  // Trigger initialization when component mounts
  useEffect(() => {
    if (!isInitialized && url) {
      initializeAudit();
    }
    
    return () => {
      console.log("Audit initialization cleanup");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, isInitialized, initializeAudit]);

  // Retry handler
  const handleRetry = useCallback(() => {
    console.log("Retrying audit...");
    initRef.current = false;
    setIsInitialized(false);
    setHadError(false);
    setTimeoutStatus(false);
    setTimeout(() => {
      initializeAudit();
    }, 100);
  }, [initializeAudit]);

  return {
    isInitialized,
    isLoading,
    hadError,
    timeout,
    handleRetry,
    setIsLoading
  };
}
