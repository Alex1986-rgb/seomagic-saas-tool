
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
        // Use frontend implementation - basic example
        const sitemapContent = generateSitemapXml(url, urls);
        
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
  
  const generateSitemapXml = (domain: string, urls: string[]) => {
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const urlEntries = urls.map(pageUrl => {
      return `  <url>\n    <loc>${pageUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n  </url>`;
    }).join('\n');
    
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
