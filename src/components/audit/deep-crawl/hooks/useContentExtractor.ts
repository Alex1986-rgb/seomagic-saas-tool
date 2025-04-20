
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ContentExtractor, contentExtractorService } from '@/services/audit/contentExtractor/contentExtractor';
import { ExtractedSite, ExtractionOptions, ContentExtractionProgress } from '@/services/audit/contentExtractor/types';

export const useContentExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSite, setExtractedSite] = useState<ExtractedSite | null>(null);
  const [progress, setProgress] = useState<ContentExtractionProgress>({
    completed: 0,
    total: 0,
    isComplete: false
  });
  const { toast } = useToast();

  const extractContent = async (urls: string[], domain: string, options: ExtractionOptions = {}) => {
    setIsExtracting(true);
    setProgress({
      completed: 0,
      total: urls.length,
      isComplete: false
    });
    
    try {
      // Set default options if not specified
      const extractionOptions: ExtractionOptions = {
        includeHtml: true,
        includeText: true,
        includeMetaTags: true,
        includeHeadings: true,
        includeLinks: true,
        includeImages: true,
        ...options,
        onProgress: (completed, total) => {
          setProgress({
            completed,
            total,
            currentUrl: urls[completed - 1], // The URL we just completed
            isComplete: completed === total
          });
          
          // Update progress in toast
          const progressPercent = Math.round((completed / total) * 100);
          toast({
            title: "Извлечение контента",
            description: `Обработано ${completed} из ${total} страниц (${progressPercent}%)`,
            duration: 3000,
          });
          
          // Also call the user-provided onProgress if it exists
          if (options.onProgress) {
            options.onProgress(completed, total);
          }
        }
      };

      // Extract content from all pages
      const site = await contentExtractorService.extractSiteContent(urls, domain, extractionOptions);
      setExtractedSite(site);
      
      toast({
        title: "Извлечение завершено",
        description: `Успешно обработано ${site.pages.length} страниц`,
      });

      return site;
    } catch (error) {
      console.error('Error during content extraction:', error);
      toast({
        title: "Ошибка извлечения",
        description: "Произошла ошибка при извлечении контента",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsExtracting(false);
      setProgress(prev => ({ ...prev, isComplete: true }));
    }
  };

  const exportContent = async (format: 'json' | 'html' | 'markdown' | 'sitemap' | 'all') => {
    if (!extractedSite) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive"
      });
      return;
    }

    try {
      switch (format) {
        case 'json':
          await contentExtractorService.exportToJson(extractedSite);
          break;
        case 'html':
          await contentExtractorService.exportToHtml(extractedSite);
          break;
        case 'markdown':
          await contentExtractorService.exportToMarkdown(extractedSite);
          break;
        case 'sitemap':
          await contentExtractorService.exportSitemapXml(extractedSite);
          break;
        case 'all':
          await contentExtractorService.exportAll(extractedSite);
          break;
      }

      toast({
        title: "Экспорт завершен",
        description: `Контент успешно экспортирован в формат ${format}`,
      });
    } catch (error) {
      console.error('Error during export:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте контента",
        variant: "destructive"
      });
    }
  };

  return {
    isExtracting,
    extractedSite,
    progress,
    extractContent,
    exportContent
  };
};
