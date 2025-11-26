
import { useState, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import { validationService } from '@/services/validation/validationService';
import { reportingService } from '@/services/reporting/reportingService';
import { auditService } from '@/modules/audit/services/auditService';
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

/**
 * Hook for handling website scanning functionality
 */
export const useScan = (url: string, onPageCountUpdate?: (count: number) => void) => {
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
  const [taskId, setTaskId] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<ScanLogEntry[]>([]);
  const { toast } = useToast();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef<number>(0);
  const MAX_POLLING_ERRORS = 3;

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

  // Start scanning process
  const startScan = useCallback(async (useSitemap: boolean = true) => {
    // Clear previous logs
    clearLogs();
    addLog('info', 'starting', `Запуск сканирования для ${url}`, `Режим: ${useSitemap ? 'с sitemap' : 'без sitemap'}`);
    
    console.log('🔧 useScan.startScan called for URL:', url, 'with sitemap:', useSitemap);
    
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
      console.log('🚀 Starting scan process...');
      setIsScanning(true);
      setScanDetails({
        current_url: url,
        pages_scanned: 0,
        estimated_pages: 500000,
        stage: 'Подготовка к сканированию',
        progress: 0
      });

      // Format URL
      const formattedUrl = validationService.formatUrl(url);
      console.log('📝 Formatted URL:', formattedUrl);
      addLog('info', 'initialization', 'URL отформатирован', formattedUrl);
      
      // Start audit via edge function
      console.log('📡 Calling audit-start edge function with:', { 
        url: formattedUrl, 
        type: 'quick', 
        maxPages: 100 
      });
      addLog('info', 'api', 'Отправка запроса на сервер...', 'Вызов edge function audit-start');
      
      const response = await auditService.startAudit(formattedUrl, {
        type: 'quick',
        maxPages: 100
      });
      
      console.log('📥 audit-start response received:', response);
      
      const crawlTaskId = response.task_id;
      if (!crawlTaskId) {
        console.error('❌ No task_id in response:', response);
        addLog('error', 'api', 'Пустой task_id в ответе сервера', JSON.stringify(response));
        throw new Error('Empty task ID returned');
      }
      
      console.log('✅ Audit started successfully with task ID:', crawlTaskId);
      addLog('info', 'api', 'Аудит запущен успешно', `Task ID: ${crawlTaskId}`);
      setTaskId(crawlTaskId);
      
      // Track polling start time and stage changes
      const pollingStartTime = Date.now();
      const CRAWLING_TIMEOUT = 2 * 60 * 1000; // 2 minutes for crawling
      const ANALYSIS_TIMEOUT = 5 * 60 * 1000; // 5 minutes for analysis/generating
      let lastUpdateTime = Date.now();
      let lastPagesScanned = 0;
      let lastStage = '';
      
      // Start progress polling
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await auditService.getAuditStatus(crawlTaskId);
          
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
            has_audit_data: !!(statusResponse as any).audit_data
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
          
          // Log polling status for debugging
          console.log('🔄 Polling status:', {
            stage: currentStage,
            progress: progressValue,
            pagesScanned,
            timeSinceLastUpdate: Math.floor(timeSinceLastUpdate / 1000) + 's',
            timeoutThreshold: Math.floor(timeoutThreshold / 1000) + 's'
          });
          
          // If stuck for more than threshold
          if (timeSinceLastUpdate > timeoutThreshold) {
            console.error('⏱️ Scan timeout:', { stage: currentStage, timeSinceLastUpdate });
            addLog('error', 'timeout', `Сканирование застряло на этапе "${currentStage}"`, `Нет прогресса более ${Math.floor(timeoutThreshold / 1000)} секунд`);
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;
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
            audit_data: (statusResponse as any).audit_data
          });
          
          // Update parent component with page count if callback provided
          if (onPageCountUpdate && pagesScanned) {
            onPageCountUpdate(pagesScanned);
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
              audit_data: (statusResponse as any).audit_data
            });
            
            console.log('📊 Final state set:', {
              hasAuditData: !!(statusResponse as any).audit_data,
              pagesScanned,
              status: 'completed'
            });
            
            // THEN stop polling
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;
            
            toast({
              title: "Сканирование завершено",
              description: `Просканировано ${pagesScanned} страниц`,
            });
            
            // Set isScanning to false immediately so tab can switch
            setIsScanning(false);
          } else if (status === 'failed') {
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;
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
          console.error("Error polling scan status:", error);
          errorCountRef.current += 1;
          
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          
          // Only stop after multiple consecutive errors
          if (errorCountRef.current >= MAX_POLLING_ERRORS) {
            console.error('❌ Max polling errors reached, stopping scan');
            addLog('error', 'polling', `Достигнут лимит ошибок (${MAX_POLLING_ERRORS})`, `Сканирование остановлено. Последняя ошибка: ${errorMessage}`);
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;
            setIsScanning(false);
            errorCountRef.current = 0;
            
            toast({
              title: "Ошибка",
              description: "Не удалось получить статус сканирования",
              variant: "destructive",
            });
          } else {
            addLog('warning', 'polling', `Ошибка сети (попытка ${errorCountRef.current}/${MAX_POLLING_ERRORS})`, `${errorMessage}. Повторная попытка...`);
            console.log(`⚠️ Polling error ${errorCountRef.current}/${MAX_POLLING_ERRORS}, retrying...`);
          }
        }
      }, 2000);
      
      // Store interval reference for cleanup
      pollingIntervalRef.current = pollInterval;
      
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
  }, [url, toast, onPageCountUpdate, addLog, clearLogs]);

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
  }, [taskId, isScanning, toast]);

  return {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    scanLogs,
    startScan,
    cancelScan,
    downloadSitemap,
    clearLogs
  };
};
