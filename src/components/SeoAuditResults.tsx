
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditResultsContainer from './audit/results/AuditResultsContainer';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const initializeAttempted = useRef(false);

  useEffect(() => {
    console.log("SeoAuditResults mounted with URL:", url);
    
    if (!url) {
      setError("URL не указан");
      toast({
        title: "URL не указан",
        description: "Пожалуйста, укажите URL сайта для анализа",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple initialization attempts
    if (!initializeAttempted.current) {
      initializeAttempted.current = true;
      
      // Небольшая задержка для обеспечения корректной инициализации
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      return () => {
        console.log("SeoAuditResults unmounted");
        clearTimeout(timer);
      };
    }
  }, [url, toast]);

  if (!url) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">URL сайта не указан</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <AuditResultsContainer url={url} />
    </div>
  );
};

export default SeoAuditResults;
