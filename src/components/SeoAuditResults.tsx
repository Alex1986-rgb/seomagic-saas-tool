
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditResultsContainer from '@/features/audit/components/results/AuditResultsContainer';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const initializeAttempted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Cleanup function to handle unmounting
    return () => {
      console.log("SeoAuditResults unmounted");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, toast]);

  useEffect(() => {
    if (!url) return;

    initializeAttempted.current = true;

    // Небольшая задержка перед показом результатов (StrictMode-safe:
    // каждый проход эффекта планирует и очищает собственные таймеры).
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 200);
    timeoutRef.current = readyTimer;

    // Таймаут на весь процесс аудита (2.5 минуты)
    const auditTimeout = setTimeout(() => {
      console.log("Audit timed out after 2.5 minutes");
      setError("Время аудита истекло. Пожалуйста, попробуйте снова или используйте другой URL.");
      toast({
        title: "Превышено время ожидания",
        description: "Аудит занял слишком много времени. Сайт может быть слишком большим или недоступным.",
        variant: "destructive",
      });
    }, 150000); // 2.5 minutes timeout

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(auditTimeout);
    };
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
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => {
            initializeAttempted.current = false;
            setError(null);
            setIsReady(false);
            // Delay slightly to ensure state updates
            setTimeout(() => {
              setIsReady(true);
            }, 100);
          }}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Попробовать снова
        </button>
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

export default React.memo(SeoAuditResults);
