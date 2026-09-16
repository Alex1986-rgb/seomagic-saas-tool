
import { useState, useCallback, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';
import { validationService } from '@/services/validation/validationService';
import { reportingService } from '@/services/reporting/reportingService';
import { auditService } from '@/modules/audit/services/auditService';
import type { AuditTaskSnapshot } from '@/modules/audit/types';
import { ScanLogEntry } from '@/types/scan-logs';
import { v4 as uuidv4 } from 'uuid';

// Define ScanDetails type
export interface ScanDetails {
  current_url: string;
  pages_scanned: number;
  estimated_pages: number;
  stage: string;
  progress: number;
  status?: string;
  audit_data?: any;
}

export interface UseScanOptions {
  /**
   * Задача, которую нужно открыть (обычно `?task_id=` из адреса страницы).
   * Используется в первую очередь — раньше любого поиска по сайту.
   */
  taskId?: string | null;
  /**
   * Если задача не указана — подхватить последнюю завершённую проверку этого
   * сайта. Нужно странице аудита; служебным экранам, где адрес набирают по
   * букве, лишние запросы на каждое нажатие ни к чему.
   */
  restoreLatest?: boolean;
}

/** Статусы, после которых задача больше не меняется сама по себе. */
const FINISHED_STATUSES = ['completed', 'failed', 'cancelled', 'error'];

/** Пауза перед поиском последней проверки: адрес может ещё меняться. */
const RESTORE_LATEST_DELAY_MS = 300;

/**
 * Hook for handling website scanning functionality
 */
export const useScan = (
  url: string,
  onPageCountUpdate?: (count: number) => void,
  options: UseScanOptions = {},
) => {
  const { taskId: requestedTaskId = null, restoreLatest = false } = options;

  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<ScanDetails>({
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: 'idle',
    progress: 0
  });
  const [pageStats, setPageStats] = useState<{
    total: number;
    html: number;
    images: number;
    other: number;
  }>({
    total: 0,
    html: 0,
    images: 0,
    other: 0
  });
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [taskId, setTaskIdState] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLogEntry[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef<number>(0);
  const MAX_POLLING_ERRORS = 3;

  /**
   * Текущая задача без ожидания перерисовки: эффекты ниже сравнивают с ней
   * раньше, чем React применит setState.
   */
  const taskIdRef = useRef<string | null>(null);
  /**
   * Номер последнего «выбора задачи». Ответ на устаревший запрос (пользователь
   * успел открыть другую проверку или запустить новую) не должен её перебить.
   */
  const selectionRef = useRef(0);
  /**
   * Колбэк храним в ref: его часто передают стрелкой прямо в вызове хука, и без
   * этого опрос пересоздавался бы на каждой перерисовке.
   */
  const onPageCountUpdateRef = useRef(onPageCountUpdate);
  useEffect(() => {
    onPageCountUpdateRef.current = onPageCountUpdate;
  }, [onPageCountUpdate]);

  const setTaskId = useCallback((id: string | null) => {
    taskIdRef.current = id;
    setTaskIdState(id);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Уход со страницы: опрос не должен продолжаться в фоне.
  useEffect(() => stopPolling, [stopPolling]);

  // Add log entry
  const addLog = useCallback((
    level: ScanLogEntry['level'],
    stage: string,
    message: string,
    details?: string,
    logUrl?: string
  ) => {
    const entry: ScanLogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      level,
      stage,
      message,
      details,
      url: logUrl
    };
    setScanLogs(prev => [...prev, entry]);

    // Also log to console for debugging
    const logFn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
    logFn(`[${level.toUpperCase()}] [${stage}] ${message}`, details || '');
  }, []);

  // Clear logs
  const clearLogs = useCallback(() => {
    setScanLogs([]);
  }, []);

  /**
   * Опрос хода задачи. Общий для только что запущенной проверки и для уже
   * идущей, открытой по ссылке.
   */
  const pollTask = useCallback((crawlTaskId: string) => {
    stopPolling();
    errorCountRef.current = 0;

    // Track polling start time and stage changes
    const CRAWLING_TIMEOUT = 2 * 60 * 1000; // 2 minutes for crawling
    const ANALYSIS_TIMEOUT = 5 * 60 * 1000; // 5 minutes for analysis/generating
    let lastUpdateTime = Date.now();
    let lastPagesScanned = 0;
    let lastStage = '';

    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await auditService.getAuditStatus(crawlTaskId);

        // Пока ждали ответ, опрос могли остановить или переключить на другую задачу.
        if (pollingIntervalRef.current !== pollInterval) return;

        // Reset error counter on successful response
        errorCountRef.current = 0;

        const statusCurrent = statusResponse.url;
        const pagesScanned = statusResponse.pages_scanned;
        const totalPages = statusResponse.total_pages;
        const status = statusResponse.status;
        const currentStage = statusResponse.stage || '';

        const progressValue = statusResponse.progress;

        // Log status response for debugging
        console.log('📊 Status response:', {
          stage: currentStage,
          status: status,
          progress: progressValue,
          pages: pagesScanned,
          has_audit_data: !!statusResponse.audit_data
        });

        // Check for timeout - if no progress for configured time
        const currentTime = Date.now();

        // Update lastUpdateTime if pages changed OR stage changed
        if (pagesScanned !== lastPagesScanned || currentStage !== lastStage) {
          lastUpdateTime = currentTime;
          lastPagesScanned = pagesScanned;
          lastStage = currentStage;
        }

        const timeSinceLastUpdate = currentTime - lastUpdateTime;

        // Don't apply timeout during analysis/generating/completed stages
        const isAnalysisStage = ['analysis', 'generating', 'completed', 'complete'].includes(currentStage);
        const timeoutThreshold = isAnalysisStage ? ANALYSIS_TIMEOUT : CRAWLING_TIMEOUT;

        // If stuck for more than threshold
        if (timeSinceLastUpdate > timeoutThreshold) {
          console.error('⏱️ Scan timeout:', { stage: currentStage, timeSinceLastUpdate });
          addLog('error', 'timeout', `Сканирование застряло на этапе "${currentStage}"`, `Нет прогресса более ${Math.floor(timeoutThreshold / 1000)} секунд`);
          stopPolling();
          setIsScanning(false);

          toast({
            title: "Ошибка сканирования",
            description: "Сканирование застряло. Попробуйте запустить заново.",
            variant: "destructive",
          });
          return;
        }

        setScanDetails({
          current_url: statusCurrent,
          pages_scanned: pagesScanned,
          estimated_pages: totalPages,
          stage: currentStage || status,
          progress: progressValue,
          status: status,
          audit_data: statusResponse.audit_data
        });

        // Update parent component with page count if callback provided
        if (onPageCountUpdateRef.current && pagesScanned) {
          onPageCountUpdateRef.current(pagesScanned);
        }

        // If scan is complete, clean up and generate sitemap
        if (status === 'completed') {
          console.log('✅ Scan completed, finalizing state...');
          addLog('info', 'completed', 'Сканирование завершено успешно', `Просканировано ${pagesScanned} страниц`);
          // Get URLs from the status response or use the current URL
          const pageUrls = [statusResponse.url]; // In a real implementation, you would get all discovered URLs

          const domain = validationService.extractDomain(url);

          // Generate sitemap using the reportingService
          const sitemapXml = reportingService.generateSitemapXml(domain, pageUrls);
          setSitemap(sitemapXml);

          // Set final state BEFORE stopping polling
          setScanDetails({
            current_url: statusCurrent,
            pages_scanned: pagesScanned,
            estimated_pages: totalPages,
            stage: 'Анализ завершен',
            progress: 100,
            status: 'completed',
            audit_data: statusResponse.audit_data
          });

          // THEN stop polling
          stopPolling();

          /**
           * Часть данных дописывается уже после того, как обход объявлен
           * завершённым: замечания складывает классификатор, метрики —
           * обработчик. Экраны успевают прочитать пустоту и запоминают её,
           * поэтому после завершения просим перечитать всё, что относится
           * к этой задаче.
           */
          queryClient.invalidateQueries({ queryKey: ['auditResults'] });
          queryClient.invalidateQueries({ queryKey: ['auditIssues'] });
          queryClient.invalidateQueries({ queryKey: ['auditRecommendations'] });
          queryClient.invalidateQueries({ queryKey: ['taskMetrics'] });
          queryClient.invalidateQueries({ queryKey: ['pageAnalysis'] });
          queryClient.invalidateQueries({ queryKey: ['auditHistory'] });

          toast({
            title: "Сканирование завершено",
            description: `Просканировано ${pagesScanned} страниц`,
          });

          // Set isScanning to false immediately so tab can switch
          setIsScanning(false);
        } else if (status === 'failed' || status === 'cancelled') {
          stopPolling();
          setIsScanning(false);

          const errorMessage = statusResponse.error || "Произошла ошибка при сканировании сайта";
          addLog('error', 'failed', 'Аудит прерван', `${errorMessage}. Просканировано ${pagesScanned} из ${totalPages} страниц`);
          toast({
            title: "Аудит прерван - доступны частичные данные",
            description: `Просканировано ${pagesScanned} из ${totalPages} страниц`,
            variant: "default",
          });
        }
      } catch (error) {
        if (pollingIntervalRef.current !== pollInterval) return;

        console.error("Error polling scan status:", error);
        errorCountRef.current += 1;

        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';

        // Only stop after multiple consecutive errors
        if (errorCountRef.current >= MAX_POLLING_ERRORS) {
          console.error('❌ Max polling errors reached, stopping scan');
          addLog('error', 'polling', `Достигнут лимит ошибок (${MAX_POLLING_ERRORS})`, `Сканирование остановлено. Последняя ошибка: ${errorMessage}`);
          stopPolling();
          setIsScanning(false);
          errorCountRef.current = 0;

          toast({
            title: "Ошибка",
            description: "Не удалось получить статус сканирования",
            variant: "destructive",
          });
        } else {
          addLog('warning', 'polling', `Ошибка сети (попытка ${errorCountRef.current}/${MAX_POLLING_ERRORS})`, `${errorMessage}. Повторная попытка...`);
        }
      }
    }, 2000);

    // Store interval reference for cleanup
    pollingIntervalRef.current = pollInterval;
  }, [url, toast, addLog, queryClient, stopPolling]);

  /**
   * Открыть уже существующую задачу — по ссылке «Просмотр» из истории, из
   * письма, после «Возобновить» или найденную как последнюю проверку сайта.
   *
   * Раньше task_id из адреса страницы сюда не доходил: страница подбирала
   * последнюю проверку по подстроке домена, её состояние не заполняла (вкладка
   * «Результаты» оставалась выключенной) и за незавершённой задачей не следила.
   * Теперь читаем состояние выбранной задачи: завершённую сразу показываем,
   * идущую — продолжаем опрашивать.
   */
  const attachTask = useCallback(async (id: string, selection: number) => {
    let task: AuditTaskSnapshot | null = null;
    try {
      task = await auditService.getTaskSnapshot(id);
    } catch (error) {
      console.error('Не удалось прочитать задачу аудита:', error);
    }

    if (selection !== selectionRef.current) return;

    if (!task) {
      toast({
        title: "Аудит не найден",
        description: "Ссылка устарела или эта проверка недоступна вашему аккаунту. Аудит можно запустить заново.",
      });
      return;
    }

    stopPolling();
    setTaskId(task.id);

    const status = task.status;
    const baseDetails = {
      current_url: task.current_url || task.url,
      pages_scanned: task.pages_scanned ?? 0,
      estimated_pages: task.estimated_pages ?? 0,
    };

    if (status === 'completed') {
      setIsScanning(false);
      setScanDetails({ ...baseDetails, stage: 'Анализ завершен', progress: 100, status: 'completed' });
      return;
    }

    setScanDetails({
      ...baseDetails,
      stage: task.stage || status,
      progress: task.progress ?? 0,
      status,
    });

    if (FINISHED_STATUSES.includes(status)) {
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    pollTask(task.id);
  }, [toast, stopPolling, setTaskId, pollTask]);

  /** Открыть задачу по id вручную (например, сразу после «Возобновить»). */
  const openTask = useCallback(async (id: string) => {
    selectionRef.current += 1;
    await attachTask(id, selectionRef.current);
  }, [attachTask]);

  /**
   * Какую проверку показывать при открытии страницы.
   *
   * 1. Задача из адреса — всегда в первую очередь.
   * 2. Иначе (если попросили) — последняя завершённая проверка этого же сайта:
   *    по точному хосту и только своя (гостю — только запущенная из этого
   *    браузера, её номер лежит в localStorage). Раньше здесь был поиск по
   *    подстроке среди всех видимых задач, и shop.ru показывал результаты
   *    myshop.ru или гостевую проверку, запущенную другим посетителем.
   */
  useEffect(() => {
    if (requestedTaskId) {
      if (requestedTaskId === taskIdRef.current) return;
      selectionRef.current += 1;
      void attachTask(requestedTaskId, selectionRef.current);
      return;
    }

    if (!restoreLatest || !url || taskIdRef.current) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      selectionRef.current += 1;
      const selection = selectionRef.current;
      const latestTaskId = await auditService.findLatestCompletedTaskId(url);
      if (cancelled || !latestTaskId || taskIdRef.current || selection !== selectionRef.current) return;
      await attachTask(latestTaskId, selection);
    }, RESTORE_LATEST_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [url, requestedTaskId, restoreLatest, attachTask]);

  // Start scanning process
  /**
   * Запуск сканирования. `maxPages` ограничивает обход: на большом сайте это
   * разница между парой минут и получасом, а на платных проверках — между
   * копейками и заметной суммой.
   */
  const startScan = useCallback(async (useSitemap: boolean = true, maxPages: number = 20) => {
    // Новая проверка важнее любого ещё не пришедшего ответа об открытии старой.
    selectionRef.current += 1;
    stopPolling();

    // Clear previous logs
    clearLogs();
    addLog('info', 'starting', `Запуск сканирования для ${url}`, `Режим: ${useSitemap ? 'с sitemap' : 'без sitemap'}`);

    if (!url) {
      console.error('❌ Cannot start scan: URL is empty');
      addLog('error', 'validation', 'URL не указан', 'Необходимо указать URL для сканирования');
      toast({
        title: "Ошибка",
        description: "URL не указан",
        variant: "destructive",
      });
      return null;
    }

    if (!validationService.validateUrl(url)) {
      console.error('❌ URL validation failed:', url);
      addLog('error', 'validation', 'Неверный формат URL', `Проверьте корректность URL: ${url}`);
      toast({
        title: "Ошибка",
        description: "Неверный формат URL",
        variant: "destructive",
      });
      return null;
    }

    try {
      addLog('info', 'initialization', 'Инициализация сканирования...', 'Подготовка к отправке запроса на сервер');
      setIsScanning(true);
      setScanDetails({
        current_url: url,
        pages_scanned: 0,
        estimated_pages: maxPages,
        stage: 'Подготовка к сканированию',
        progress: 0
      });

      // Format URL
      const formattedUrl = validationService.formatUrl(url);
      addLog('info', 'initialization', 'URL отформатирован', formattedUrl);

      // Start audit via edge function
      addLog('info', 'api', 'Отправка запроса на сервер...', 'Вызов edge function audit-start');

      const response = await auditService.startAudit(formattedUrl, {
        type: 'quick',
        maxPages,
      });

      const crawlTaskId = response.task_id;
      if (!crawlTaskId) {
        console.error('❌ No task_id in response:', response);
        addLog('error', 'api', 'Пустой task_id в ответе сервера', JSON.stringify(response));
        throw new Error('Empty task ID returned');
      }

      addLog('info', 'api', 'Аудит запущен успешно', `Task ID: ${crawlTaskId}`);
      setTaskId(crawlTaskId);

      // Start progress polling
      pollTask(crawlTaskId);

      return crawlTaskId;
    } catch (error) {
      console.error("Error starting scan:", error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      addLog('error', 'starting', 'Не удалось запустить сканирование', errorMessage);
      setIsScanning(false);

      toast({
        title: "Ошибка",
        description: "Не удалось запустить сканирование",
        variant: "destructive",
      });

      return null;
    }
  }, [url, toast, addLog, clearLogs, pollTask, setTaskId, stopPolling]);

  // Handle download sitemap
  const downloadSitemap = useCallback(() => {
    if (!sitemap) {
      toast({
        title: "Ошибка",
        description: "Sitemap не сгенерирован",
        variant: "destructive",
      });
      return;
    }

    try {
      const domain = validationService.extractDomain(url);
      // Use the exportSitemapXml method with the sitemap string
      reportingService.exportSitemapXml(sitemap, domain);

      toast({
        title: "Готово",
        description: "Sitemap.xml успешно скачан",
      });
    } catch (error) {
      console.error("Error downloading sitemap:", error);

      toast({
        title: "Ошибка",
        description: "Не удалось скачать sitemap",
        variant: "destructive",
      });
    }
  }, [sitemap, url, toast]);

  // Cancel ongoing scan
  const cancelScan = useCallback(async () => {
    if (!taskId || !isScanning) {
      return;
    }

    try {
      await auditService.cancelAudit(taskId);
      // Отменённую задачу больше не опрашиваем — раньше опрос продолжался впустую.
      stopPolling();
      setIsScanning(false);

      toast({
        title: "Сканирование отменено",
        description: "Процесс сканирования был отменен пользователем",
      });
    } catch (error) {
      console.error("Error cancelling scan:", error);

      toast({
        title: "Ошибка",
        description: "Не удалось отменить сканирование",
        variant: "destructive",
      });
    }
  }, [taskId, isScanning, toast, stopPolling]);

  return {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    scanLogs,
    startScan,
    openTask,
    cancelScan,
    downloadSitemap,
    clearLogs
  };
};
