
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, Package, Map, Database, Code } from 'lucide-react';
import { DeepCrawlProgressDialog } from './DeepCrawlProgressDialog';
import { ContentExtractorDialog } from './components/ContentExtractorDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface AdvancedSitemapExtractorProps {
  domain: string;
  initialUrl: string;
  onUrlsScanned?: (urls: string[]) => void;
}

const AdvancedSitemapExtractor: React.FC<AdvancedSitemapExtractorProps> = ({ 
  domain, 
  initialUrl,
  onUrlsScanned 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl || domain || '');
  const [scannedUrls, setScannedUrls] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  
  const handleStartAdvancedCrawl = async () => {
    if (!url) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите URL сайта",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Opening advanced crawl dialog with URL:", url);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (pageCount?: number, urls?: string[]) => {
    setIsDialogOpen(false);
    
    if (urls && urls.length > 0) {
      console.log(`Dialog closed with ${urls.length} URLs scanned`);
      setScannedUrls(urls);
      
      if (onUrlsScanned) {
        onUrlsScanned(urls);
      }
      
      // Automatically open the content extractor if we have URLs
      if (urls.length > 0) {
        setTimeout(() => {
          setIsExtractorOpen(true);
        }, 500);
      }
    }
  };

  const handleCloseExtractor = () => {
    setIsExtractorOpen(false);
  };
  
  const exportFullSitemap = async () => {
    if (scannedUrls.length === 0) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта",
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Generate sitemap XML
      const now = new Date().toISOString().split('T')[0];
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<?xml-stylesheet type="text/xsl" href="https://www.sitemaps.org/xsl/sitemap.xsl"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      scannedUrls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(url)}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      });
      
      xml += '</urlset>';
      
      // Generate HTML sitemap
      const html = generateHtmlSitemap(domain, scannedUrls);
      
      // Create a ZIP file with both formats
      const zip = new JSZip();
      zip.file("sitemap.xml", xml);
      zip.file("sitemap.html", html);
      zip.file("urls.txt", scannedUrls.join('\n'));
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${domain.replace(/[^a-z0-9]/gi, '-')}-sitemap.zip`);
      
      toast({
        title: "Экспорт завершен",
        description: "Карта сайта успешно экспортирована в разных форматах",
      });
    } catch (error) {
      console.error("Error exporting sitemap:", error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать архив с картой сайта",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const generateHtmlSitemap = (domain: string, urls: string[]): string => {
    // Group URLs by their paths
    const urlsByPath: Record<string, string[]> = {};
    
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname.split('/').filter(Boolean);
        
        if (path.length === 0) {
          // Homepage
          if (!urlsByPath['Homepage']) urlsByPath['Homepage'] = [];
          urlsByPath['Homepage'].push(url);
        } else {
          const mainSection = path[0].charAt(0).toUpperCase() + path[0].slice(1);
          if (!urlsByPath[mainSection]) urlsByPath[mainSection] = [];
          urlsByPath[mainSection].push(url);
        }
      } catch (error) {
        // If URL parsing fails, add to Other category
        if (!urlsByPath['Other']) urlsByPath['Other'] = [];
        urlsByPath['Other'].push(url);
      }
    });
    
    // Generate HTML
    let html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Карта сайта ${domain}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #2563eb; margin-bottom: 30px; }
        h2 { color: #4b5563; margin-top: 30px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .section { margin-bottom: 40px; }
        .timestamp { color: #6b7280; font-size: 0.9em; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Карта сайта ${domain}</h1>
        <p>Общее количество страниц: ${urls.length}</p>
`;

    // Add each section
    Object.entries(urlsByPath).forEach(([section, sectionUrls]) => {
      html += `
        <div class="section">
            <h2>${section}</h2>
            <ul>
`;
      
      sectionUrls.forEach(url => {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname;
          const displayText = path === '/' ? 'Главная страница' : path.split('/').filter(Boolean).join(' / ');
          
          html += `                <li><a href="${url}" target="_blank">${displayText}</a></li>\n`;
        } catch (error) {
          html += `                <li><a href="${url}" target="_blank">${url}</a></li>\n`;
        }
      });
      
      html += `            </ul>
        </div>
`;
    });
    
    html += `
        <div class="timestamp">
            Создано: ${new Date().toLocaleString('ru-RU')}
        </div>
    </div>
</body>
</html>
`;
    
    return html;
  };
  
  // Helper function to escape XML special characters
  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Update URL when props change
  React.useEffect(() => {
    const newUrl = initialUrl || domain || '';
    console.log("Setting URL from props:", newUrl);
    setUrl(newUrl);
  }, [initialUrl, domain]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Продвинутое сканирование и экстракция контента
        </CardTitle>
        <CardDescription>
          Глубокое сканирование сайта с созданием полной карты сайта, включая контент и HTML
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleStartAdvancedCrawl}
            variant="default"
            size="sm"
            className="flex items-center gap-2 hover-lift"
            disabled={!url}
          >
            <Database className="h-4 w-4" />
            <span>Запустить полное сканирование</span>
          </Button>
          
          {scannedUrls.length > 0 && (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsExtractorOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                <span>Извлечь контент</span>
              </Button>
              
              <Button
                onClick={exportFullSitemap}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isExporting}
              >
                <Download className="h-4 w-4" />
                <span>{isExporting ? 'Экспорт...' : 'Экспорт карты сайта'}</span>
              </Button>
            </div>
          )}
        </div>

        <DeepCrawlProgressDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          url={url}
          initialStage="starting"
        />
        
        <ContentExtractorDialog
          open={isExtractorOpen}
          onClose={handleCloseExtractor}
          urls={scannedUrls}
          domain={domain || url}
        />
        
        {scannedUrls.length > 0 && (
          <div className="text-sm text-muted-foreground mt-2">
            Обнаружено {scannedUrls.length} URL на сайте. Используйте кнопку "Извлечь контент" для создания полной карты сайта с контентом.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSitemapExtractor;
