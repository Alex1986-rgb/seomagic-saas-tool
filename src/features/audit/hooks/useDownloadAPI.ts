
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { seoApiService } from '@/api/seoApiService';

export const useDownloadAPI = (url: string, taskId: string | null) => {
  const { toast } = useToast();

  const downloadSitemap = useCallback(async () => {
    if (taskId) {
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
    }
  }, [taskId, toast]);

  const downloadOptimizedSite = useCallback(async () => {
    if (taskId) {
      try {
        await seoApiService.downloadOptimizedSite(taskId);
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
    }
  }, [taskId, toast]);

  const exportJSONData = useCallback(async (auditData: any) => {
    if (taskId) {
      try {
        await seoApiService.exportJSON(taskId);
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
      const dataStr = JSON.stringify(auditData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportName = `audit_${auditData.id || new Date().getTime()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      toast({
        title: "JSON экспортирован",
        description: "Данные в формате JSON успешно сохранены",
      });
    }
  }, [taskId, toast]);

  return {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData
  };
};
