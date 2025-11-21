import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { auditService } from '@/api/services/auditService';
import { reportService } from '@/api/services/reportService';
import { supabase } from '@/integrations/supabase/client';

export const useWebsiteScan = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any>(null);
  const [hasAuditResults, setHasAuditResults] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (isError) {
      setIsError(false);
    }
  };

  const handleUrlsScanned = (urls: string[]) => {
    setScannedUrls(urls);
    toast({
      title: "Сканирование завершено",
      description: `Обнаружено ${urls.length} URL на сайте`,
    });
  };

  const startFullScan = async () => {
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

      // Start audit via real API
      const response = await auditService.startAudit(url, {
        type: 'deep',
        maxPages: 100
      });

      if (!response.success || !response.task_id) {
        throw new Error(response.message || 'Failed to start audit');
      }

      const auditTaskId = response.task_id;
      setTaskId(auditTaskId);

      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await auditService.getAuditStatus(auditTaskId);
          
          const pagesScanned = statusResponse.pages_scanned;
          const totalPages = statusResponse.total_pages;
          const status = statusResponse.status;
          const currentStage = statusResponse.stage || '';
          const progressValue = statusResponse.progress;

          setScanProgress(progressValue);
          setScanStage(currentStage || status);
          
          // Update scanned URLs list
          if (pagesScanned > 0) {
            setScannedUrls(prev => {
              const newUrls = Array(pagesScanned).fill(statusResponse.url);
              return newUrls;
            });
          }

          if (status === 'completed') {
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;

            // Fetch audit results from database
            const { data: auditResults } = await supabase
              .from('audit_results')
              .select('*')
              .eq('task_id', auditTaskId)
              .single();

            if (auditResults) {
              setAuditData(auditResults);
              setHasAuditResults(true);
            }

            setScanProgress(100);
            setScanStage('Сканирование завершено');
            
            toast({
              title: "Сканирование завершено",
              description: `Просканировано ${pagesScanned} страниц`,
            });

            setTimeout(() => setIsScanning(false), 2000);
          } else if (status === 'failed') {
            clearInterval(pollInterval);
            pollingIntervalRef.current = null;
            setIsScanning(false);
            setIsError(true);
            
            toast({
              title: "Ошибка сканирования",
              description: "Произошла ошибка при сканировании сайта",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error polling scan status:", error);
          clearInterval(pollInterval);
          pollingIntervalRef.current = null;
          setIsScanning(false);
          setIsError(true);
        }
      }, 2000);

      pollingIntervalRef.current = pollInterval;

    } catch (error) {
      console.error("Scan error:", error);
      setIsError(true);
      setIsScanning(false);
      toast({
        title: "Ошибка сканирования",
        description: "Произошла ошибка при запуске сканирования",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPdfReport = async () => {
    if (!taskId) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Создание PDF",
      description: "Подготовка отчета...",
    });
    
    try {
      // Generate PDF report via edge function
      const reportResponse = await reportService.generateReport(taskId, 'pdf');
      
      if (!reportResponse.success || !reportResponse.storage_path) {
        throw new Error(reportResponse.message || "Не удалось создать PDF");
      }

      // Download the report from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pdf-reports')
        .download(reportResponse.storage_path);

      if (downloadError || !fileData) {
        throw new Error("Не удалось скачать PDF");
      }

      // Create download link
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `audit-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Готово",
        description: "PDF-отчет успешно скачан",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать PDF-отчет",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadErrorReport = async () => {
    if (!taskId) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Создание отчета об ошибках",
      description: "Подготовка отчета...",
    });
    
    try {
      // Generate JSON report with errors via edge function
      const reportResponse = await reportService.generateReport(taskId, 'json');
      
      if (!reportResponse.success || !reportResponse.storage_path) {
        throw new Error(reportResponse.message || "Не удалось создать отчет");
      }

      // Download the report from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pdf-reports')
        .download(reportResponse.storage_path);

      if (downloadError || !fileData) {
        throw new Error("Не удалось скачать отчет");
      }

      // Create download link
      const blob = new Blob([fileData], { type: 'application/json' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Готово",
        description: "Отчет об ошибках успешно скачан",
      });
    } catch (error) {
      console.error("Error report generation error:", error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать отчет об ошибках",
        variant: "destructive",
      });
    }
  };

  return {
    url,
    isScanning,
    isError,
    scanProgress,
    scanStage,
    scannedUrls,
    auditData,
    hasAuditResults,
    setUrl,
    handleUrlChange,
    handleUrlsScanned,
    startFullScan,
    handleDownloadPdfReport,
    handleDownloadErrorReport
  };
};
