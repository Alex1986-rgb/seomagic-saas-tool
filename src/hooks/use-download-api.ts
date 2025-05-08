
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/services/seoApiService';
import { auditDataService } from '@/api/services/auditDataService';

/**
 * Hook for handling download operations
 */
export const useDownloadAPI = (url: string, taskId: string | null) => {
  const { toast } = useToast();

  /**
   * Download sitemap
   */
  const downloadSitemap = useCallback(async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Необходимо сначала выполнить сканирование",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await seoApiService.downloadSitemap(taskId);
      toast({
        title: "Sitemap скачан",
        description: "Файл sitemap.xml успешно скачан",
      });
    } catch (error) {
      toast({
        title: "Ошибка скачивания",
        description: "Не удалось скачать sitemap.xml",
        variant: "destructive"
      });
      console.error('Error downloading sitemap:', error);
    }
  }, [taskId, toast]);

  /**
   * Download optimized site
   */
  const downloadOptimizedSite = useCallback(async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Необходимо сначала выполнить сканирование и оптимизацию",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const blob = await seoApiService.downloadOptimizedSite(taskId);
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `optimized-site-${url.replace(/[^a-zA-Z0-9]/g, '-')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Оптимизированный сайт скачан",
        description: "Архив с оптимизированной версией сайта успешно скачан",
      });
    } catch (error) {
      toast({
        title: "Ошибка скачивания",
        description: "Не удалось скачать оптимизированную версию сайта",
        variant: "destructive"
      });
      console.error('Error downloading optimized site:', error);
    }
  }, [taskId, url, toast]);

  /**
   * Export JSON data
   */
  const exportJSONData = useCallback(async (auditData: any) => {
    if (taskId) {
      try {
        const blob = await seoApiService.exportJSON(taskId);
        
        // Create download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `audit-data-${url.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "JSON экспортирован",
          description: "Данные в формате JSON успешно скачаны",
        });
      } catch (error) {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось экспортировать данные в JSON",
          variant: "destructive"
        });
        console.error('Error exporting JSON:', error);
      }
    } else if (auditData) {
      // If we don't have a taskId but we do have auditData, export that directly
      try {
        const dataStr = JSON.stringify(auditData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportName = `audit_${auditData.id || new Date().getTime()}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', exportName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "JSON экспортирован",
          description: "Данные в формате JSON успешно сохранены",
        });
      } catch (error) {
        toast({
          title: "Ошибка экспорта",
          description: "Не удалось экспортировать данные в JSON",
          variant: "destructive"
        });
        console.error('Error exporting JSON:', error);
      }
    }
  }, [taskId, url, toast]);

  /**
   * Generate PDF report
   */
  const generatePdfReport = useCallback(async (auditData: any) => {
    try {
      const blob = await auditDataService.generatePdfReport(auditData);
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-report-${url.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Отчет создан",
        description: "PDF отчет успешно сгенерирован и скачан",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Ошибка создания отчета",
        description: "Не удалось сгенерировать PDF отчет",
        variant: "destructive"
      });
      console.error('Error generating PDF report:', error);
      return false;
    }
  }, [url, toast]);

  return {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    generatePdfReport
  };
};
