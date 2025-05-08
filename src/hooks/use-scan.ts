
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { scanningService } from '@/services/scanning/scanningService';
import { seoApiService } from '@/services/api/seoApiService';
import { validationService } from '@/services/validation/validationService';
import { reportingService } from '@/services/reporting/reportingService';

interface ScanStatusResponse {
  task_id: string;
  current_url: string;
  pages_scanned: number;
  total_pages: number;
  status: string;
  progress: number;
  error?: string;
  url?: string;
}

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
    progress: number;
  }>({
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
        stage: 'Подготовка к сканированию',
        progress: 0
      });

      // Format URL
      const formattedUrl = validationService.formatUrl(url);
      
      // Start crawl and get task ID
      const response = await seoApiService.startCrawl(formattedUrl);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from API');
      }
      
      // Type guard for the response
      if (!('task_id' in response)) {
        throw new Error('No task ID returned');
      }
      
      const crawlTaskId = response.task_id as string;
      if (!crawlTaskId) {
        throw new Error('Empty task ID returned');
      }
      
      setTaskId(crawlTaskId);
      
      // Start progress polling
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await seoApiService.getStatus(crawlTaskId);
          
          if (!statusResponse || typeof statusResponse !== 'object') {
            throw new Error('Invalid status response');
          }
          
          // Type cast with type guard
          const typedResponse = statusResponse as ScanStatusResponse;
          
          const statusCurrent = typedResponse.current_url || url;
          const pagesScanned = typedResponse.pages_scanned || 0;
          const totalPages = typedResponse.total_pages || 500000;
          const status = typedResponse.status || 'in_progress';
          
          const progressValue = typedResponse.progress || 0;
          
          setScanDetails({
            current_url: statusCurrent,
            pages_scanned: pagesScanned,
            estimated_pages: totalPages,
            stage: status === 'completed' 
              ? 'Сканирование завершено' 
              : `Сканирование (${progressValue}%)`,
            progress: progressValue
          });
          
          // Update parent component with page count if callback provided
          if (onPageCountUpdate && pagesScanned) {
            onPageCountUpdate(pagesScanned);
          }
          
          // If scan is complete, clean up and generate sitemap
          if (status === 'completed' || status === 'failed') {
            clearInterval(pollInterval);
            setIsScanning(false);
            
            if (status === 'completed') {
              const pageUrl = typedResponse.url || url;
              const pageUrls = [pageUrl];
              
              const domain = validationService.extractDomain(url);
              const sitemapXml = reportingService.generateSitemapXml(domain, pageUrls);
              setSitemap(sitemapXml);
              
              toast({
                title: "Сканирование завершено",
                description: `Просканировано ${pagesScanned} страниц`,
              });
            } else {
              const errorMessage = typedResponse.error || "Произошла ошибка при сканировании сайта";
              toast({
                title: "Ошибка сканирования",
                description: errorMessage,
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
      
      return crawlTaskId;
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
