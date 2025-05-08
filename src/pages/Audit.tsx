
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import AuditTimeoutMessage from "@/components/audit/AuditTimeoutMessage";
import AuditLoaderSection from "@/components/audit/AuditLoaderSection";
import { AuditProvider } from '@/contexts/AuditContext';
import { withMemo } from '@/components/shared/performance';

const Audit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const { toast } = useToast();
  const extractedUrl = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wrapped in useCallback to prevent unnecessary re-renders when passed to child components
  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  const handleUrlsScanned = useCallback((urls: string[]) => {
    setScannedUrls(urls);
    if (urls.length > 0) {
      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${urls.length} URL на сайте`,
      });
      setShowAdvancedTools(true);
    }
  }, [toast]);

  const handleResetErrors = useCallback(() => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
  }, []);

  // Extracted URL parameter logic into a separate function for better code organization
  const extractUrlParam = useCallback(() => {
    if (extractedUrl.current) return;
    
    setIsLoading(true);
    setTimeoutOccurred(false);
    const urlParam = searchParams.get('url');
    
    if (urlParam) {
      try {
        if (!urlParam.includes('.')) {
          throw new Error("Invalid URL format");
        }
        
        const formattedUrl = urlParam.startsWith('http') ? urlParam : `https://${urlParam}`;
        try {
          new URL(formattedUrl);
        } catch (e) {
          throw new Error("Invalid URL format");
        }
        
        setUrl(urlParam);
        setError(null);
        extractedUrl.current = true;
      } catch (err) {
        console.error("URL validation error:", err);
        setError("Предоставленный URL некорректен. Пожалуйста, попробуйте снова.");
        toast({
          title: "Некорректный URL",
          description: "Предоставленный URL некорректен. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
        setUrl('');
      }
    } else {
      setUrl('');
    }
    
    setIsLoading(false);
  }, [searchParams, toast]);

  // Set up timeout effect
  useEffect(() => {
    if (url && !timeoutOccurred) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        console.log("Global audit timeout triggered after 3 minutes");
        setTimeoutOccurred(true);
        setIsLoading(false);
        setError("Время ожидания истекло. Возможно, сайт слишком большой или возникли проблемы с соединением. Пожалуйста, попробуйте снова или используйте другой URL.");
        
        toast({
          title: "Превышено время ожидания",
          description: "Аудит занял слишком много времени. Пожалуйста, попробуйте снова или используйте другой URL.",
          variant: "destructive",
        });
        
        extractedUrl.current = false;
      }, 180000);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [url, timeoutOccurred, toast]);

  // Initial setup
  useEffect(() => {
    console.log("Audit component mounted");
    // Use requestIdleCallback if available for better performance
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => extractUrlParam());
    } else {
      // Fallback to setTimeout for browsers that don't support requestIdleCallback
      const timer = setTimeout(() => {
        extractUrlParam();
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      console.log("Audit component unmounted");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [extractUrlParam]);

  const handleRetry = useCallback(() => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  }, [extractUrlParam]);

  // Memoize the main content render for better performance
  const renderContent = useCallback(() => {
    if (timeoutOccurred) {
      return (
        <Layout>
          <AuditTimeoutMessage 
            url={url}
            onRetry={handleRetry}
          />
        </Layout>
      );
    }

    return (
      <Layout>
        {url ? (
          <AuditProvider initialUrl={url}>
            <AuditLoaderSection
              url={url}
              error={error}
              isLoading={isLoading}
              showAdvancedTools={showAdvancedTools}
              scannedUrls={scannedUrls}
              handleClearError={handleClearError}
              handleUrlsScanned={handleUrlsScanned}
              setShowAdvancedTools={setShowAdvancedTools}
              extractedUrl={extractedUrl}
              setTimeoutOccurred={setTimeoutOccurred}
              extractUrlParam={extractUrlParam}
            />
          </AuditProvider>
        ) : (
          <AuditLoaderSection
            url={url}
            error={error}
            isLoading={isLoading}
            showAdvancedTools={showAdvancedTools}
            scannedUrls={scannedUrls}
            handleClearError={handleClearError}
            handleUrlsScanned={handleUrlsScanned}
            setShowAdvancedTools={setShowAdvancedTools}
            extractedUrl={extractedUrl}
            setTimeoutOccurred={setTimeoutOccurred}
            extractUrlParam={extractUrlParam}
          />
        )}
      </Layout>
    );
  }, [
    timeoutOccurred, 
    url, 
    error, 
    isLoading, 
    showAdvancedTools, 
    scannedUrls, 
    handleClearError, 
    handleUrlsScanned, 
    extractedUrl, 
    extractUrlParam, 
    handleRetry
  ]);

  return renderContent();
};

// Apply memoization to the entire Audit component for better performance
export default withMemo(Audit);
