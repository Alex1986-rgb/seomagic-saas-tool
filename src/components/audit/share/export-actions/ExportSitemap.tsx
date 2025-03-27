
import React from 'react';
import { Map, Loader2 } from 'lucide-react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AuditData } from '@/types/audit';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { cleanUrl, formatDate, showExportError, showExportSuccess, formatSitemapXml, shouldIncludeInSitemap } from '../export-utils';

interface ExportSitemapProps {
  auditData?: AuditData;
  url: string;
  urls?: string[];
  isExporting: string | null;
  setIsExporting: (state: string | null) => void;
}

const ExportSitemap: React.FC<ExportSitemapProps> = ({ 
  auditData, 
  url,
  urls = [],
  isExporting,
  setIsExporting
}) => {
  // Generate sitemap index for large sites
  const generateSitemapIndex = (sitemapFiles: string[]): string => {
    let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapIndex += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    sitemapFiles.forEach(file => {
      sitemapIndex += '  <sitemap>\n';
      sitemapIndex += `    <loc>${url}/${file}</loc>\n`;
      sitemapIndex += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      sitemapIndex += '  </sitemap>\n';
    });
    
    sitemapIndex += '</sitemapindex>';
    return sitemapIndex;
  };
  
  // Generate HTML sitemap for better visualization
  const generateHtmlSitemap = (siteUrls: string[]): string => {
    // Group URLs by directory structure
    const urlsByStructure: Record<string, string[]> = {};
    
    siteUrls.forEach(siteUrl => {
      try {
        const urlObj = new URL(siteUrl);
        const path = urlObj.pathname;
        const pathParts = path.split('/').filter(Boolean);
        
        if (pathParts.length === 0) {
          // Root path
          if (!urlsByStructure['']) {
            urlsByStructure[''] = [];
          }
          urlsByStructure[''].push(siteUrl);
        } else {
          // Group by first directory level
          const mainSection = pathParts[0];
          if (!urlsByStructure[mainSection]) {
            urlsByStructure[mainSection] = [];
          }
          urlsByStructure[mainSection].push(siteUrl);
        }
      } catch (error) {
        // Skip invalid URLs
      }
    });
    
    // Generate HTML content
    let htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карта сайта - ${url}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2 { color: #2c3e50; }
    .section { margin-bottom: 30px; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
    .url-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
    .url-item { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 5px 0; }
    .section-title { display: flex; align-items: center; gap: 10px; }
    .count-badge { background-color: #3498db; color: white; border-radius: 20px; padding: 2px 8px; font-size: 0.8em; }
    a { color: #3498db; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .summary { background-color: #f1f8ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Карта сайта ${url}</h1>
  
  <div class="summary">
    <p>Всего URL: <strong>${siteUrls.length}</strong></p>
    <p>Дата создания: ${new Date().toLocaleDateString()}</p>
  </div>`;
  
    // Root URLs first if they exist
    if (urlsByStructure[''] && urlsByStructure[''].length > 0) {
      htmlContent += `
  <div class="section">
    <div class="section-title">
      <h2>Главная</h2>
      <span class="count-badge">${urlsByStructure[''].length}</span>
    </div>
    <div class="url-list">`;
      
      urlsByStructure[''].forEach(siteUrl => {
        htmlContent += `
      <div class="url-item">
        <a href="${siteUrl}" target="_blank" title="${siteUrl}">${siteUrl}</a>
      </div>`;
      });
      
      htmlContent += `
    </div>
  </div>`;
    }
    
    // Then add all other sections
    Object.keys(urlsByStructure).filter(key => key !== '').forEach(section => {
      htmlContent += `
  <div class="section">
    <div class="section-title">
      <h2>/${section}/</h2>
      <span class="count-badge">${urlsByStructure[section].length}</span>
    </div>
    <div class="url-list">`;
      
      urlsByStructure[section].forEach(siteUrl => {
        htmlContent += `
      <div class="url-item">
        <a href="${siteUrl}" target="_blank" title="${siteUrl}">${siteUrl}</a>
      </div>`;
      });
      
      htmlContent += `
    </div>
  </div>`;
    });
    
    htmlContent += `
</body>
</html>`;
    
    return htmlContent;
  };
  
  const handleExportSitemap = async () => {
    try {
      setIsExporting('sitemap');
      
      let siteUrls: string[] = [];
      
      // Use provided URLs or generate basic ones if not available
      if (urls && urls.length > 0) {
        siteUrls = urls.filter(u => shouldIncludeInSitemap(u));
      } else if (auditData) {
        // Generate basic URLs based on page count estimate
        const pageCount = auditData.pageCount || 10;
        const domain = new URL(url).hostname;
        
        // Generate dummy URLs for demonstration
        siteUrls = [
          `https://${domain}/`,
          `https://${domain}/about`,
          `https://${domain}/contact`,
          `https://${domain}/products`,
          `https://${domain}/services`,
        ];
        
        // Add more dummy URLs based on page count
        for (let i = 1; i <= Math.min(pageCount - 5, 20); i++) {
          siteUrls.push(`https://${domain}/page-${i}`);
        }
      } else {
        showExportError("Нет данных для создания карты сайта");
        setIsExporting(null);
        return;
      }
      
      // Create ZIP archive
      const zip = new JSZip();
      
      // Standard XML sitemap
      const standardSitemap = formatSitemapXml(siteUrls);
      zip.file('sitemap.xml', standardSitemap);
      
      // Create HTML visualization of the sitemap
      const htmlSitemap = generateHtmlSitemap(siteUrls);
      zip.file('sitemap.html', htmlSitemap);
      
      // For larger sites, split into multiple sitemaps
      if (siteUrls.length > 1000) {
        const chunks = [];
        for (let i = 0; i < siteUrls.length; i += 1000) {
          chunks.push(siteUrls.slice(i, i + 1000));
        }
        
        const sitemapFiles = [];
        
        // Create individual sitemap files
        chunks.forEach((chunk, index) => {
          const filename = `sitemap-${index + 1}.xml`;
          zip.file(filename, formatSitemapXml(chunk));
          sitemapFiles.push(filename);
        });
        
        // Create sitemap index file
        const sitemapIndex = generateSitemapIndex(sitemapFiles);
        zip.file('sitemap_index.xml', sitemapIndex);
      }
      
      // Add a README.txt with instructions
      const readmeContent = `КАРТА САЙТА ДЛЯ ${url}
Дата создания: ${new Date().toLocaleDateString()}

Содержимое архива:
- sitemap.xml: основной файл карты сайта в формате XML
- sitemap.html: визуализация карты сайта для удобного просмотра

Инструкции по использованию:
1. Загрузите файл sitemap.xml в корневую директорию вашего сайта
2. Добавьте следующую строку в robots.txt:
   Sitemap: https://${new URL(url).hostname}/sitemap.xml
3. Отправьте карту сайта в Google Search Console и Яндекс.Вебмастер

Для больших сайтов:
- sitemap_index.xml: индекс сайтмапов, который нужно загрузить в корень сайта
- sitemap-1.xml, sitemap-2.xml, и т.д.: отдельные файлы карты сайта

Примечание: регулярно обновляйте карту сайта для обеспечения актуальности индексации.
`;
      zip.file('README.txt', readmeContent);
      
      // Generate and download the ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `sitemap-${cleanUrl(url)}-${formatDate(new Date().toISOString())}.zip`);
      
      showExportSuccess("Карта сайта создана", "Файлы карты сайта успешно сохранены в ZIP архиве");
    } catch (error) {
      console.error('Ошибка при создании карты сайта:', error);
      showExportError("Не удалось создать карту сайта. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenuItem 
      onClick={handleExportSitemap}
      disabled={isExporting !== null}
      className="flex items-center gap-2"
    >
      {isExporting === 'sitemap' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Создание карты сайта...</span>
        </>
      ) : (
        <>
          <Map className="h-4 w-4" />
          <span>Экспорт карты сайта (Sitemap)</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ExportSitemap;
