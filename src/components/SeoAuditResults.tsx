
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditResultsContainer from './audit/results/AuditResultsContainer';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!url) {
      toast({
        title: "URL не указан",
        description: "Пожалуйста, укажите URL сайта для анализа",
        variant: "destructive",
      });
      return;
    }

    // Небольшая задержка для обеспечения корректной инициализации
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [url, toast]);

  if (!url) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">URL сайта не указан</p>
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

  return <AuditResultsContainer url={url} />;
};

export default SeoAuditResults;
