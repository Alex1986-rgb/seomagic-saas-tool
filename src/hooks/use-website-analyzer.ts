
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { useScan } from './use-scan';
import { validationService } from '@/services/validation/validationService';
import { fetchIssueSummary } from '@/services/audit/fetchIssueSummary';
import { fetchPageAnalysis } from '@/services/audit/fetchPageAnalysis';

export interface WebsiteAnalyzerResults {
  totalPages: number;
  brokenLinks: number;
  duplicateContent: number;
  missingMetadata: number;
}

/**
 * Hook for website analyzer functionality
 */
export const useWebsiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<WebsiteAnalyzerResults>({
    totalPages: 0,
    brokenLinks: 0,
    duplicateContent: 0,
    missingMetadata: 0
  });
  
  const { toast } = useToast();
  
  // Initialize scan functionality
  // Идентификатор задачи нужен в обработчике завершения: он вызывается позже,
  // когда обход уже закончился, и значение из замыкания было бы устаревшим.
  const taskIdRef = useRef<string | null>(null);

  const {
    isScanning,
    scanDetails,
    taskId,
    startScan,
    cancelScan
  } = useScan(url, async (pagesCount) => {
    setScanResults(prev => ({ ...prev, totalPages: pagesCount }));

    // Обход закончился — забираем настоящие страницы и замечания.
    const finishedTaskId = taskIdRef.current;
    const [pages, summary] = await Promise.all([
      fetchPageAnalysis(finishedTaskId),
      fetchIssueSummary(finishedTaskId),
    ]);

    setScannedUrls(pages.map((page) => page.url));
    setScanResults({
      totalPages: pages.length || pagesCount,
      brokenLinks: summary.brokenLinks,
      duplicateContent: summary.duplicateContent,
      missingMetadata: summary.missingMetadata,
    });
  });

  useEffect(() => {
    taskIdRef.current = taskId ?? null;
  }, [taskId]);
  
  // Handle URL change
  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    setIsError(false);
    setErrorMessage('');
    
    // Validate URL
    if (newUrl && !validationService.validateUrl(newUrl)) {
      setIsError(true);
      setErrorMessage('Введен некорректный URL');
    }
  }, []);

  // Start full site scan
  const startFullScan = useCallback(async () => {
    try {
      if (!url || isError) {
        toast({
          title: "Ошибка",
          description: "Введите корректный URL сайта",
          variant: "destructive",
        });
        return;
      }

      // Раньше здесь создавался список из десяти несуществующих адресов
      // (site.ru/page1 … page9), а «битые ссылки», «дубли» и «нет описания»
      // выбирались случайными числами. Теперь просто запускаем настоящий
      // аудит: результаты подставит обработчик завершения.
      setScannedUrls([]);
      setScanResults({ totalPages: 0, brokenLinks: 0, duplicateContent: 0, missingMetadata: 0 });

      const startedTaskId = await startScan();
      if (startedTaskId) taskIdRef.current = startedTaskId;
    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Ошибка сканирования",
        description: error instanceof Error ? error.message : "Произошла ошибка при сканировании",
        variant: "destructive",
      });
    }
  }, [url, isError, toast, startScan, taskId]);
  
  return {
    url,
    isScanning,
    scanProgress: scanDetails.progress || 0,
    scanStage: scanDetails.stage || 'idle',
    isError,
    errorMessage,
    scanResults,
    scannedUrls,
    handleUrlChange,
    startFullScan,
    taskId
  };
};
