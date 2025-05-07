
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { scanningService } from '@/services/scanning/scanningService';
import { seoApiService } from '@/services/api/seoApiService';
import { validationService } from '@/services/validation/validationService';
import { reportingService } from '@/services/reporting/reportingService';

/**
 * Hook for handling website scanning functionality
 */
export const useScan = (url: string, onPageCountUpdate?: (count: number) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanDetails, setScanDetails] = useState<{
    current_url: string;
    pages_scanned: number;
    estimated_pages: number;
    stage: string;
  }>({
    current_url: '',
    pages_scanned: 0,
    estimated_pages: 0,
    stage: ''
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
  const { toast } = useToast();

  // Start scanning process
  const startScan = useCallback(async (useSitemap: boolean = true) => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "URL не указан",
        variant: "destructive",
      });
      return null;
    }

    if (!validationService.validateUrl(url)) {
      toast({
        title: "Ошибка",
        description: "Неверный формат URL",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsScanning(true);
      setScanDetails({
        current_url: url,
        pages_scanned: 0,
        estimated_pages: 500000,
        stage: 'Подготовка к сканированию'
      });

      // Format URL
      const formattedUrl = validationService.formatUrl(url);
      
      // Start crawl and get task ID
      const crawlResponse = await seoApiService.startCrawl(formattedUrl);
      const newTaskId = crawlResponse.task_id;
      setTaskId(newTaskId);
      
      // Start progress polling
      const pollInterval = setInterval(async () => {
        try {
          const status = await seoApiService.getStatus(newTaskId);
          
          setScanDetails({
            current_url: status.current_url || url,
            pages_scanned: status.pages_scanned || 0,
            estimated_pages: status.total_pages || 500000,
            stage: status.status === 'completed' 
              ? 'Сканирование завершено' 
              : `Сканирование (${status.progress}%)`
          });
          
          // Update parent component with page count if callback provided
          if (onPageCountUpdate && status.pages_scanned) {
            onPageCountUpdate(status.pages_scanned);
          }
          
          // If scan is complete, clean up and generate sitemap
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(pollInterval);
            setIsScanning(false);
            
            if (status.status === 'completed') {
              // Try to get URLs for sitemap
              if (status.urls && status.urls.length > 0) {
                const domain = validationService.extractDomain(url);
                const sitemapXml = reportingService.generateSitemapXml(domain, status.urls);
                setSitemap(sitemapXml);
                
                toast({
                  title: "Сканирование завершено",
                  description: `Просканировано ${status.pages_scanned} страниц`,
                });
              }
            } else {
              toast({
                title: "Ошибка сканирования",
                description: status.error || "Произошла ошибка при сканировании сайта",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error polling scan status:", error);
          clearInterval(pollInterval);
          setIsScanning(false);
          
          toast({
            title: "Ошибка",
            description: "Не удалось получить статус сканирования",
            variant: "destructive",
          });
        }
      }, 2000);
      
      return newTaskId;
    } catch (error) {
      console.error("Error starting scan:", error);
      setIsScanning(false);
      
      toast({
        title: "Ошибка",
        description: "Не удалось запустить сканирование",
        variant: "destructive",
      });
      
      return null;
    }
  }, [url, toast, onPageCountUpdate]);

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
      await seoApiService.cancelScan(taskId);
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
    startScan,
    cancelScan,
    downloadSitemap
  };
};
