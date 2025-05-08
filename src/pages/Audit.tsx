
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/Layout';
import AuditTimeoutMessage from "@/components/audit/AuditTimeoutMessage";
import AuditLoaderSection from "@/components/audit/AuditLoaderSection";

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

  useEffect(() => {
    console.log("Audit component mounted");
    const timer = setTimeout(() => {
      extractUrlParam();
    }, 300);
    
    return () => {
      console.log("Audit component unmounted");
      clearTimeout(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [extractUrlParam]);

  const handleClearError = () => {
    setError(null);
    setTimeoutOccurred(false);
  };

  const handleUrlsScanned = (urls: string[]) => {
    setScannedUrls(urls);
    if (urls.length > 0) {
      toast({
        title: "Сканирование завершено",
        description: `Обнаружено ${urls.length} URL на сайте`,
      });
      setShowAdvancedTools(true);
    }
  };

  const handleResetErrors = () => {
    extractedUrl.current = false;
    setTimeoutOccurred(false);
    extractUrlParam();
  };

  if (timeoutOccurred) {
    return (
      <Layout>
        <AuditTimeoutMessage 
          url={url}
          onRetry={() => {
            extractedUrl.current = false;
            setTimeoutOccurred(false);
            extractUrlParam();
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
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
    </Layout>
  );
};

export default Audit;
