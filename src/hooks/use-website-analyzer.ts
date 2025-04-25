
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateAuditData } from '@/services/audit/generators';

export const useWebsiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [hasAuditResults, setHasAuditResults] = useState(false);
  const { toast } = useToast();

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (isError) {
      setIsError(false);
    }
  }, [isError]);

  const startFullScan = useCallback(async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setIsError(false);
      setScanProgress(0);
      setScanStage('Подготовка к сканированию...');

      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setScanProgress(i * 10);
        
        switch (i) {
          case 2:
            setScanStage('Анализ структуры сайта...');
            break;
          case 4:
            setScanStage('Сканирование страниц...');
            break;
          case 6:
            setScanStage('Проверка метаданных...');
            break;
          case 8:
            setScanStage('Генерация отчета...');
            break;
          case 10:
            setScanStage('Сканирование завершено');
            const generatedData = generateAuditData(url);
            setAuditData(generatedData);
            setHasAuditResults(true);
            break;
        }
      }

      toast({
        title: "Сканирование завершено",
        description: "Сайт успешно просканирован",
      });
    } catch (error) {
      console.error("Scan error:", error);
      setIsError(true);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при сканировании сайта",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [url, toast]);

  return {
    url,
    isScanning,
    scanProgress,
    scanStage,
    isError,
    scannedUrls,
    auditData,
    hasAuditResults,
    handleUrlChange,
    startFullScan,
    setScannedUrls,
  };
};
