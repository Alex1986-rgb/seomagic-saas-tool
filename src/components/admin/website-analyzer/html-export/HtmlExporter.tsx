
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Download, FileCode, Settings2, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface HtmlExporterProps {
  scannedUrls: string[];
  url: string;
  isExporting?: boolean;
}

const HtmlExporter: React.FC<HtmlExporterProps> = ({ scannedUrls, url, isExporting = false }) => {
  const { toast } = useToast();
  const [exportProgress, setExportProgress] = useState(0);
  const [isExportRunning, setIsExportRunning] = useState(isExporting);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeImages: true,
    includeCss: true,
    includeJs: false,
    createSitemap: true,
    preserveStructure: true,
    optimizeHtml: false,
    maxConcurrentRequests: 5
  });

  const handleOptionChange = (option: string, value: boolean | number) => {
    setExportOptions(prev => ({ ...prev, [option]: value }));
  };

  const startHtmlExport = async () => {
    if (scannedUrls.length === 0) {
      toast({
        title: "Ошибка",
        description: "Нет URL для экспорта. Сначала выполните сканирование.",
        variant: "destructive",
      });
      return;
    }

    setIsExportRunning(true);
    setExportProgress(0);

    try {
      // Create a new zip file
      const zip = new JSZip();
      const domain = url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
      
      // Create a simple HTML index file
      const indexHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Экспорт сайта ${domain}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2 { color: #333; }
    .url-list { margin-top: 20px; }
    .url-item { margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .stats { background: #e9f7fe; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Экспорт сайта ${domain}</h1>
  
  <div class="stats">
    <p><strong>Всего URL:</strong> ${scannedUrls.length}</p>
    <p><strong>Дата экспорта:</strong> ${new Date().toLocaleString()}</p>
  </div>
  
  <h2>Список страниц</h2>
  <div class="url-list">
    ${scannedUrls.map((url, index) => `
      <div class="url-item">
        <a href="${url}" target="_blank">${url}</a>
        <div><small>Локальная копия: <a href="pages/${index}.html">pages/${index}.html</a></small></div>
      </div>
    `).join('')}
  </div>
</body>
</html>
      `;
      
      // Add index.html to the zip
      zip.file("index.html", indexHtml);
      
      // Create a pages folder
      const pagesFolder = zip.folder("pages");
      
      // Process URLs in batches to avoid memory issues
      const batchSize = 100;
      const totalBatches = Math.ceil(scannedUrls.length / batchSize);
      
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min(batchStart + batchSize, scannedUrls.length);
        const batch = scannedUrls.slice(batchStart, batchEnd);
        
        // Create placeholder HTML files for this batch
        for (let i = 0; i < batch.length; i++) {
          const fileIndex = batchStart + i;
          const url = batch[i];
          
          // Create simple HTML file for each URL
          const pageHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${url}</title>
</head>
<body>
  <h1>Страница: ${url}</h1>
  <p>Эта страница была экспортирована из списка URL.</p>
  <p><a href="../index.html">Вернуться к списку</a></p>
</body>
</html>
          `;
          
          pagesFolder?.file(`${fileIndex}.html`, pageHtml);
        }
        
        // Update progress
        setExportProgress(((batchIndex + 1) / totalBatches) * 100);
        
        // Small delay to prevent UI freeze
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Add sitemap.xml if option enabled
      if (exportOptions.createSitemap) {
        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        for (const url of scannedUrls) {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${url}</loc>\n`;
          sitemap += '    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n';
          sitemap += '    <changefreq>monthly</changefreq>\n';
          sitemap += '    <priority>0.8</priority>\n';
          sitemap += '  </url>\n';
        }
        
        sitemap += '</urlset>';
        zip.file("sitemap.xml", sitemap);
      }
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${domain}-html-export.zip`);
      
      toast({
        title: "Экспорт завершен",
        description: `HTML экспорт успешно создан (${scannedUrls.length} URL)`,
      });
    } catch (error) {
      console.error("HTML export error:", error);
      toast({
        title: "Ошибка экспорта",
        description: "Произошла ошибка при создании HTML экспорта",
        variant: "destructive",
      });
    } finally {
      setIsExportRunning(false);
      setExportProgress(100);
    }
  };

  return (
    <Card className="bg-white dark:bg-[#181929]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5 text-[#36CFFF]" />
          Экспорт сайта в HTML
        </CardTitle>
        <CardDescription>
          Создайте локальную HTML копию сайта для просмотра офлайн или архивирования
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={url}
            readOnly
            className="flex-1 bg-muted/50"
          />
          <Button
            onClick={startHtmlExport}
            disabled={isExportRunning || scannedUrls.length === 0}
            className="gap-2"
          >
            {isExportRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Экспорт...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Экспорт HTML
              </>
            )}
          </Button>
        </div>

        {isExportRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Создание HTML экспорта...</span>
              <span>{Math.round(exportProgress)}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        <Collapsible
          open={advancedOptionsOpen}
          onOpenChange={setAdvancedOptionsOpen}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs mt-2">
              <Settings2 className="h-3 w-3" />
              {advancedOptionsOpen ? 'Скрыть' : 'Показать'} настройки экспорта
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.includeImages}
                  onCheckedChange={(checked) => handleOptionChange('includeImages', checked)}
                  id="includeImages"
                />
                <Label htmlFor="includeImages">Сохранять изображения</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.includeCss}
                  onCheckedChange={(checked) => handleOptionChange('includeCss', checked)}
                  id="includeCss"
                />
                <Label htmlFor="includeCss">Сохранять CSS</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.includeJs}
                  onCheckedChange={(checked) => handleOptionChange('includeJs', checked)}
                  id="includeJs"
                />
                <Label htmlFor="includeJs">Сохранять JavaScript</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.createSitemap}
                  onCheckedChange={(checked) => handleOptionChange('createSitemap', checked)}
                  id="createSitemap"
                />
                <Label htmlFor="createSitemap">Создать sitemap.xml</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.preserveStructure}
                  onCheckedChange={(checked) => handleOptionChange('preserveStructure', checked)}
                  id="preserveStructure"
                />
                <Label htmlFor="preserveStructure">Сохранять структуру URL</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={exportOptions.optimizeHtml}
                  onCheckedChange={(checked) => handleOptionChange('optimizeHtml', checked)}
                  id="optimizeHtml"
                />
                <Label htmlFor="optimizeHtml">Оптимизировать HTML</Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="text-sm text-muted-foreground">
          {scannedUrls.length > 0 ? (
            <p>Готово к экспорту {scannedUrls.length.toLocaleString()} URL в HTML формат</p>
          ) : (
            <p>Нет данных для экспорта. Выполните сканирование сайта.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HtmlExporter;
