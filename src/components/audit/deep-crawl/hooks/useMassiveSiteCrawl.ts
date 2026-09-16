import { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { firecrawlService } from '@/services/api/firecrawl';
import type { CrawlTask } from '@/services/api/firecrawl/types';
import { saveAs } from 'file-saver';

interface MassiveCrawlProgress {
  pagesScanned: number;
  totalEstimated: number;
  currentUrl: string;
  processingStage: 'initializing' | 'crawling' | 'analyzing' | 'optimizing' | 'completed' | 'failed';
  percentage: number;
  batchNumber: number;
  totalBatches: number;
}

/**
 * Итог обхода. Здесь только то, что обход действительно увидел.
 *
 * Раньше сюда добавлялся «анализ»: оценка SEO считалась как случайное число в
 * зависимости от количества страниц, «проблемные зоны» выбирались случайной
 * перетасовкой заранее написанного списка, а срок оптимизации брался из
 * таблички «столько-то страниц — столько-то недель». Ни одна из этих цифр не
 * имела отношения к сайту, поэтому их больше нет.
 */
interface CrawlResult {
  urls: string[];
  sitemapXml: string;
  pageCount: number;
}

const BATCH_SIZE = 10000;

export const useMassiveSiteCrawl = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  // Отмену держим в ref: опрос статуса читал устаревшее значение состояния и
  // продолжал крутиться после нажатия «Отменить».
  const cancelledRef = useRef(false);
  const [crawlProgress, setCrawlProgress] = useState<MassiveCrawlProgress>({
    pagesScanned: 0,
    totalEstimated: 0,
    currentUrl: '',
    processingStage: 'initializing',
    percentage: 0,
    batchNumber: 0,
    totalBatches: 0
  });
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const startCrawl = useCallback(async (url: string, maxPages: number = 15000000) => {
    if (!url) {
      setError('URL не указан');
      return null;
    }
    
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      setIsScanning(true);
      cancelledRef.current = false;
      setError(null);
      setCrawlProgress({
        pagesScanned: 0,
        totalEstimated: 0,
        currentUrl: normalizedUrl,
        processingStage: 'initializing',
        percentage: 0,
        batchNumber: 0,
        totalBatches: Math.ceil(maxPages / BATCH_SIZE)
      });
      
      console.log(`Starting massive crawl for: ${normalizedUrl} with max pages: ${maxPages}`);
      
      try {
        await fetch(normalizedUrl, { method: 'HEAD' });
      } catch (error) {
        throw new Error('Сайт недоступен. Проверьте URL и попробуйте снова.');
      }
      
      const crawlTask = await firecrawlService.startCrawl(normalizedUrl);
      setTaskId(crawlTask.id);
      
      const pollingInterval = setInterval(async () => {
        if (cancelledRef.current) {
          clearInterval(pollingInterval);
          return;
        }
        
        try {
          const taskStatus = await firecrawlService.getStatus(crawlTask.id);
          
          setCrawlProgress({
            pagesScanned: taskStatus.pages_scanned || 0,
            totalEstimated: taskStatus.estimated_total_pages || 0,
            currentUrl: taskStatus.current_url || normalizedUrl,
            processingStage: mapStatusToStage(taskStatus.status),
            percentage: calculateProgress(taskStatus),
            batchNumber: Math.ceil((taskStatus.pages_scanned || 0) / BATCH_SIZE),
            totalBatches: Math.ceil((taskStatus.estimated_total_pages || maxPages) / BATCH_SIZE)
          });
          
          if (taskStatus.status === 'completed') {
            clearInterval(pollingInterval);
            
            const urls = taskStatus.urls || (taskStatus.results ? taskStatus.results.urls : []);

            console.log(`Generating sitemap for ${urls.length} URLs`);
            const sitemapXml = generateSitemapXml(urls, new URL(normalizedUrl).hostname);

            // Этапы «анализ 75 %» и «оптимизация 90 %» проскакивали за одну
            // строку и ничего не делали — осталось только фактическое завершение.
            setCrawlProgress(prev => ({
              ...prev,
              pagesScanned: urls.length,
              processingStage: 'completed',
              percentage: 100
            }));

            setResult({
              urls,
              sitemapXml,
              pageCount: urls.length
            });
            
            setIsScanning(false);
            
            toast({
              title: "Сканирование завершено",
              description: `Обработано ${urls.length.toLocaleString('ru-RU')} страниц на сайте ${normalizedUrl}`,
            });
            
            return {
              success: true,
              urls,
              pageCount: urls.length
            };
          }
          
          if (taskStatus.status === 'failed') {
            clearInterval(pollingInterval);
            setError(taskStatus.error || 'Произошла ошибка при сканировании сайта');
            setCrawlProgress(prev => ({
              ...prev,
              processingStage: 'failed',
              percentage: 0
            }));
            setIsScanning(false);
            return null;
          }
        } catch (error) {
          console.error('Error checking task status:', error);
        }
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Error starting crawl:', error);
      setError(error instanceof Error ? error.message : 'Не удалось запустить сканирование сайта');
      setIsScanning(false);
      return null;
    }
  }, [toast]);
  
  const cancelCrawl = useCallback(() => {
    cancelledRef.current = true;
    setIsScanning(false);
    toast({
      title: "Сканирование отменено",
      description: "Процесс сканирования был прерван пользователем"
    });
  }, [toast]);
  
  const downloadSitemap = useCallback(() => {
    if (!result?.sitemapXml) {
      toast({
        title: "Ошибка",
        description: "Нет данных для создания карты сайта",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([result.sitemapXml], { type: 'application/xml' });
    saveAs(blob, `sitemap-${new Date().toISOString().slice(0, 10)}.xml`);
    
    toast({
      title: "Файл скачан",
      description: "Карта сайта успешно скачана"
    });
  }, [result, toast]);
  
  const downloadReport = useCallback(() => {
    if (!result) {
      toast({
        title: "Ошибка",
        description: "Нет данных для создания отчета",
        variant: "destructive"
      });
      return;
    }
    
    const reportData = {
      scanDate: new Date().toISOString(),
      domain: new URL(result.urls[0]).hostname,
      pageCount: result.pageCount,
      sampleUrls: result.urls.slice(0, 100)
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    saveAs(blob, `site-audit-report-${new Date().toISOString().slice(0, 10)}.json`);
    
    toast({
      title: "Отчет скачан",
      description: "Аудит сайта успешно скачан"
    });
  }, [result, toast]);
  
  return {
    isScanning,
    crawlProgress,
    result,
    error,
    taskId,
    startCrawl,
    cancelCrawl,
    downloadSitemap,
    downloadReport
  };
};

function mapStatusToStage(status: string): MassiveCrawlProgress['processingStage'] {
  switch (status) {
    case 'pending':
      return 'initializing';
    case 'in_progress':
      return 'crawling';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'crawling';
  }
}

function calculateProgress(taskStatus: CrawlTask): number {
  if (taskStatus.status === 'completed') return 100;
  if (taskStatus.status === 'failed') return 0;
  
  // Пока не известно ни сколько обойдено, ни сколько всего — показываем ноль,
  // а не «для вида» отрисованные 5 %.
  const { pages_scanned, estimated_total_pages } = taskStatus;
  if (!pages_scanned || !estimated_total_pages) return 0;
  
  return Math.min(95, Math.floor((pages_scanned / estimated_total_pages) * 100));
}

function generateSitemapXml(urls: string[], hostname: string): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  const footer = `</urlset>`;
  
  const urlEntries = urls.map(url => {
    return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');
  
  return `${header}\n${urlEntries}\n${footer}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

