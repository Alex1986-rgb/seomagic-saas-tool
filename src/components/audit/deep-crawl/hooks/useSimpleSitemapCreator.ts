
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { SimpleSitemapCreator } from '@/services/audit/simpleSitemapCreator';
import { useToast } from "@/hooks/use-toast";

export function useSimpleSitemapCreator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sitemap, setSitemap] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const { toast } = useToast();

  const generateSitemap = async (url: string) => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentUrl('');
    setSitemap(null);
    setUrls([]);

    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log(`Generating sitemap for ${normalizedUrl}...`);

      const sitemapCreator = new SimpleSitemapCreator({
        maxPages: 1000,
        maxDepth: 5,
        includeStylesheet: true
      });

      const progressCallback = (scanned: number, total: number, current: string) => {
        const progressPercent = total > 0 ? Math.min(Math.round((scanned / total) * 100), 100) : 0;
        setProgress(progressPercent);
        setCurrentUrl(current);
      };

      const scannedUrls = await sitemapCreator.crawl(normalizedUrl, progressCallback);
      
      if (scannedUrls.length > 0) {
        // Generate XML sitemap
        const sitemapXml = sitemapCreator.generateSitemapXml(scannedUrls);
        setSitemap(sitemapXml);
        setUrls(scannedUrls);
        
        toast({
          title: "Sitemap создан",
          description: `Найдено ${scannedUrls.length} URL на сайте ${url}`,
        });
      } else {
        toast({
          title: "Внимание",
          description: "Не удалось найти URL на сайте. Проверьте доступность сайта.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании карты сайта",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(100);
    }
  };

  const downloadSitemap = () => {
    if (!sitemap) {
      toast({
        title: "Ошибка",
        description: "Сначала сгенерируйте карту сайта",
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([sitemap], { type: 'application/xml' });
    saveAs(blob, 'sitemap.xml');
    
    toast({
      title: "Скачивание",
      description: "Файл sitemap.xml скачан",
    });
  };

  const downloadCsv = () => {
    if (urls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет данных для скачивания",
        variant: "destructive"
      });
      return;
    }

    const csv = urls.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'urls.csv');
    
    toast({
      title: "Скачивание",
      description: "Файл urls.csv скачан",
    });
  };

  return {
    isGenerating,
    progress,
    sitemap,
    urls,
    currentUrl,
    generateSitemap,
    downloadSitemap,
    downloadCsv
  };
}
