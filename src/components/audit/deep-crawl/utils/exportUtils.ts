
import { SitemapGenerator } from '@/services/audit/crawler/sitemapGenerator';
import { generateSitemap } from '@/services/audit/sitemap';
import { useToast } from "@/hooks/use-toast";
import { AdvancedCrawler } from '@/services/audit/crawler/advancedCrawler';

export function useSitemapExport() {
  const { toast } = useToast();
  
  // Generate sitemap from domain and page count
  const generateSitemapFile = (domain: string, pageCount: number): string => {
    return generateSitemap(domain, pageCount);
  };

  // Download generated sitemap
  const downloadSitemap = (sitemap: string | null, domain: string) => {
    if (sitemap) {
      const blob = new Blob([sitemap], { type: 'text/xml' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      let hostname = domain || 'site';
      
      a.download = `sitemap_${hostname}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Карта сайта скачана",
        description: "XML-файл карты сайта успешно сохранен",
      });
    }
  };
  
  // Download enhanced sitemap package
  const downloadAllData = async (scannedUrls: string[], domain: string) => {
    if (!domain) return;
    
    try {
      // Create entries for SitemapGenerator
      const entries = scannedUrls.map(url => ({
        url,
        priority: url === (url.startsWith('http') ? url : `https://${url}`) ? 1.0 : 0.7
      }));
      
      await SitemapGenerator.downloadSitemapPackage(entries, domain);
      
      toast({
        title: "Данные скачаны",
        description: "Архив с данными сканирования успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading data package:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать архив с данными",
        variant: "destructive",
      });
    }
  };

  // Download crawler report
  const downloadReport = async (crawler: AdvancedCrawler | null, domain: string) => {
    if (!crawler) return;
    
    try {
      const blob = await crawler.exportCrawlData();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `crawl-report-${domain}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      
      toast({
        title: "Отчет скачан",
        description: "Отчет о сканировании успешно сохранен",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать отчет о сканировании",
        variant: "destructive",
      });
    }
  };

  return {
    generateSitemapFile,
    downloadSitemap,
    downloadAllData,
    downloadReport
  };
}
