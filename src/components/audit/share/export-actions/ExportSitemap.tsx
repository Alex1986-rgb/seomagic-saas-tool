
import React from 'react';
import { Map } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AuditData } from '@/types/audit';
import { seoApiService } from '@/api/seoApiService';

interface ExportSitemapProps {
  auditData?: AuditData;
  url: string;
  urls?: string[];
  isExporting: string | null;
  setIsExporting: (value: string | null) => void;
  taskId?: string | null;
}

const ExportSitemap: React.FC<ExportSitemapProps> = ({ 
  auditData, 
  url, 
  urls,
  isExporting, 
  setIsExporting,
  taskId
}) => {
  const { toast } = useToast();
  
  const handleExportSitemap = async () => {
    setIsExporting('sitemap');
    
    try {
      if (taskId) {
        // Use backend API
        await seoApiService.downloadSitemap(taskId);
        
        toast({
          title: "Sitemap скачан",
          description: "Файл sitemap.xml успешно скачан",
        });
      } else if (urls && urls.length > 0) {
        // Extract domain from URL if possible
        let domain = url;
        try {
          const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
          domain = urlObj.hostname;
        } catch (e) {
          console.warn("Could not parse URL for domain extraction:", e);
        }
        
        // Создаем sitemap.xml из списка URL
        const sitemapContent = generateSitemapXml(domain, urls);
        
        // Создаем и скачиваем файл
        const blob = new Blob([sitemapContent], { type: 'application/xml' });
        const dataUrl = URL.createObjectURL(blob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = 'sitemap.xml';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        URL.revokeObjectURL(dataUrl);
        
        toast({
          title: "Sitemap скачан",
          description: "Файл sitemap.xml успешно скачан",
        });
      } else {
        toast({
          title: "Недостаточно данных",
          description: "Для создания sitemap необходимы данные о страницах сайта",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error exporting sitemap:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при экспорте sitemap. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };
  
  // Функция для генерации XML-файла sitemap
  const generateSitemapXml = (domain: string, urls: string[]) => {
    // Проверяем, что домен корректный
    if (!domain) {
      return '';
    }

    // Начало XML-документа
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                  '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n' +
                  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Добавляем каждый URL как элемент <url>
    const urlEntries = urls.map(pageUrl => {
      // Убеждаемся, что URL полный
      let fullUrl = pageUrl;
      if (!fullUrl.startsWith('http')) {
        if (domain.startsWith('http')) {
          // Если домен уже включает протокол
          fullUrl = `${domain}${pageUrl.startsWith('/') ? '' : '/'}${pageUrl}`;
        } else {
          // Иначе добавляем протокол
          fullUrl = `https://${domain}${pageUrl.startsWith('/') ? '' : '/'}${pageUrl}`;
        }
      }

      // Экранируем специальные символы XML
      fullUrl = fullUrl
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      // Формируем элемент URL с текущей датой для lastmod
      const currentDate = new Date().toISOString().split('T')[0];
      
      return `  <url>\n    <loc>${fullUrl}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    }).join('\n');
    
    // Закрываем XML-документ
    const footer = '\n</urlset>';
    
    return header + urlEntries + footer;
  };
  
  return (
    <DropdownMenuItem 
      onClick={handleExportSitemap}
      disabled={isExporting !== null}
    >
      <Map className="mr-2 h-4 w-4" />
      <span>{isExporting === 'sitemap' ? 'Экспортируется...' : 'Экспорт Sitemap'}</span>
    </DropdownMenuItem>
  );
};

export default ExportSitemap;
