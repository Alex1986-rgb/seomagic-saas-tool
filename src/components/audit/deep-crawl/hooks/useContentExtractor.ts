
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { contentExtractor } from '@/services/audit/contentExtractor/contentExtractor';
import { ExtractedSite, ExtractionOptions } from '@/services/audit/contentExtractor/types';

export const useContentExtractor = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedSite, setExtractedSite] = useState<ExtractedSite | null>(null);
  const { toast } = useToast();

  const extractContent = async (urls: string[], domain: string, options: ExtractionOptions = {}) => {
    setIsExtracting(true);
    
    try {
      const pages = [];
      let completedPages = 0;
      
      for (const url of urls) {
        try {
          const page = await contentExtractor.extractPageContent(url, options);
          pages.push(page);
          completedPages++;
          
          // Update progress
          const progress = Math.round((completedPages / urls.length) * 100);
          toast({
            title: "Извлечение контента",
            description: `Обработано ${completedPages} из ${urls.length} страниц (${progress}%)`,
          });
        } catch (error) {
          console.error(`Error extracting content from ${url}:`, error);
        }
      }

      const site: ExtractedSite = {
        domain,
        extractedAt: new Date().toISOString(),
        pageCount: pages.length,
        pages
      };

      setExtractedSite(site);
      
      toast({
        title: "Извлечение завершено",
        description: `Успешно обработано ${pages.length} страниц`,
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
    }
  };

  const exportContent = async (format: 'json' | 'html' | 'markdown' | 'all') => {
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
          await contentExtractor.exportToJson(extractedSite);
          break;
        case 'html':
          await contentExtractor.exportToHtml(extractedSite);
          break;
        case 'markdown':
          await contentExtractor.exportToMarkdown(extractedSite);
          break;
        case 'all':
          await contentExtractor.exportAll(extractedSite);
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
    extractContent,
    exportContent
  };
};
