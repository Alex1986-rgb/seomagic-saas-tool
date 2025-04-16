
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import generateCrawlReportPdf from '@/utils/pdf/crawlReportPdf';
import { firecrawlService } from '@/services/api/firecrawlService';

export const useCrawlReportExport = (
  domain: string,
  pageCount: number,
  urls: string[],
  pageTypes?: Record<string, number>,
  depthData?: { level: number; count: number }[],
  brokenLinks?: { url: string; statusCode: number }[],
  duplicatePages?: { url: string; similarUrls: string[] }[]
) => {
  const { toast } = useToast();

  const downloadSitemap = useCallback(async () => {
    try {
      // Use the firecrawlService to export the data
      const blob = await firecrawlService.exportCrawlResults('task_placeholder', 'sitemap');
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap-${domain.replace(/[^a-z0-9]/gi, '-')}.xml`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Успешно",
        description: "Карта сайта успешно скачана",
      });
    } catch (error) {
      console.error('Ошибка при скачивании карты сайта:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать карту сайта",
        variant: "destructive",
      });
    }
  }, [domain, toast]);

  const downloadReport = useCallback(() => {
    try {
      // Generate PDF with crawl report data
      const doc = generateCrawlReportPdf({
        domain,
        pageCount,
        urls,
        pageTypes,
        depthData,
        brokenLinks,
        duplicatePages,
        scanDate: new Date()
      });
      
      // Save the PDF
      doc.save(`crawl-report-${domain.replace(/[^a-z0-9]/gi, '-')}.pdf`);
      
      toast({
        title: "Успешно",
        description: "Отчет успешно скачан",
      });
    } catch (error) {
      console.error('Ошибка при скачивании отчета:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать отчет",
        variant: "destructive",
      });
    }
  }, [domain, pageCount, urls, pageTypes, depthData, brokenLinks, duplicatePages, toast]);

  const downloadAllData = useCallback(async () => {
    try {
      // Use the firecrawlService to export all data
      const blob = await firecrawlService.exportCrawlResults('task_placeholder', 'json');
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `crawl-data-${domain.replace(/[^a-z0-9]/gi, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Успешно",
        description: "Данные успешно скачаны",
      });
    } catch (error) {
      console.error('Ошибка при скачивании данных:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось скачать данные",
        variant: "destructive",
      });
    }
  }, [domain, toast]);

  return {
    downloadSitemap,
    downloadReport,
    downloadAllData
  };
};

export default useCrawlReportExport;
