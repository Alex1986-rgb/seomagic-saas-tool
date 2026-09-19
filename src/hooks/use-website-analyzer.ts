
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from './use-toast';
import { useScan } from './use-scan';
import { validationService } from '@/services/validation/validationService';
import { fetchIssueSummary, type IssueSummary } from '@/services/audit/fetchIssueSummary';
import { fetchPageAnalysis } from '@/services/audit/fetchPageAnalysis';

/** Замечания дописывает классификатор после завершения обхода — ждём их немного. */
const ISSUES_REREAD_DELAY_MS = 4000;
const ISSUES_REREAD_ATTEMPTS = 5;

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
  
  const {
    isScanning,
    scanDetails,
    taskId,
    startScan,
    cancelScan
  } = useScan(url, (pagesCount) => {
    // На каждом тике опроса — только счётчик страниц. Итоги обхода грузятся
    // один раз, когда он закончится (эффект ниже).
    setScanResults(prev => ({ ...prev, totalPages: pagesCount }));
  });

  /**
   * Итоги обхода забираем один раз — на переходе «идёт → завершён».
   *
   * Раньше загрузка висела на счётчике страниц, а useScan вызывает его на каждом
   * тике опроса: каждые 2 секунды уходило по два запроса (до 200 строк страниц и
   * все замечания), ответы могли прийти не по порядку, а последний срабатывал
   * раньше, чем классификатор допишет замечания, — и сводка оставалась нулевой.
   * Замечания поэтому перечитываем ещё несколько раз, пока они не появятся.
   */
  const wasScanningRef = useRef(false);
  useEffect(() => {
    const justFinished = wasScanningRef.current && !isScanning;
    wasScanningRef.current = isScanning;
    if (!justFinished || scanDetails.status !== 'completed' || !taskId) return;

    const finishedTaskId = taskId;
    let cancelled = false;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const applyIssues = (summary: IssueSummary) => {
      setScanResults(prev => ({
        ...prev,
        brokenLinks: summary.brokenLinks,
        duplicateContent: summary.duplicateContent,
        missingMetadata: summary.missingMetadata,
      }));
    };

    const scheduleIssuesReread = () => {
      if (attempts >= ISSUES_REREAD_ATTEMPTS) return;
      retryTimer = setTimeout(async () => {
        attempts += 1;
        const summary = await fetchIssueSummary(finishedTaskId);
        if (cancelled) return;
        applyIssues(summary);
        if (summary.total === 0) scheduleIssuesReread();
      }, ISSUES_REREAD_DELAY_MS);
    };

    (async () => {
      const [pages, summary] = await Promise.all([
        fetchPageAnalysis(finishedTaskId),
        fetchIssueSummary(finishedTaskId),
      ]);
      if (cancelled) return;

      setScannedUrls(pages.map((page) => page.url));
      setScanResults(prev => ({ ...prev, totalPages: pages.length || prev.totalPages }));
      applyIssues(summary);
      if (summary.total === 0) scheduleIssuesReread();
    })();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [isScanning, scanDetails.status, taskId]);
  
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

      await startScan();
    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Ошибка сканирования",
        description: error instanceof Error ? error.message : "Произошла ошибка при сканировании",
        variant: "destructive",
      });
    }
  }, [url, isError, toast, startScan]);
  
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
