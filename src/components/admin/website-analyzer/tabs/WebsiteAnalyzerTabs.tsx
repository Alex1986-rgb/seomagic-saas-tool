
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface WebsiteAnalyzerTabsProps {
  scannedUrls: string[];
}

const WebsiteAnalyzerTabs: React.FC<WebsiteAnalyzerTabsProps> = ({ scannedUrls }) => {
  const download = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  const sitemapXml = () => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${scannedUrls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n  </url>`).join('\n')}\n</urlset>`;
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid grid-cols-4 bg-card/50 backdrop-blur-sm">
        <TabsTrigger value="overview">Обзор</TabsTrigger>
        <TabsTrigger value="urls">URLs ({scannedUrls.length})</TabsTrigger>
        <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        <TabsTrigger value="reports">Отчеты</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <Card className="bg-card/90 backdrop-blur-sm border-border p-4">
          <h3 className="text-lg font-medium mb-4">Обзор сканирования</h3>
          {scannedUrls.length > 0 ? (
            <div className="space-y-2">
              <p>Найдено страниц: {scannedUrls.length}</p>
              <p>Типы страниц: HTML</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Запустите сканирование для получения данных</p>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="urls" className="space-y-4">
        <Card className="bg-card/90 backdrop-blur-sm border-border p-4">
          <h3 className="text-lg font-medium mb-4">Найденные URLs</h3>
          {scannedUrls.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <ul className="list-disc pl-5">
                {scannedUrls.map((url, index) => (
                  <li key={index} className="mb-1">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">Нет данных о URL</p>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="sitemap" className="space-y-4">
        <Card className="bg-card/90 backdrop-blur-sm border-border p-4">
          <h3 className="text-lg font-medium mb-4">Sitemap</h3>
          {scannedUrls.length > 0 ? (
            <div className="space-y-4">
              <p>На основе сканирования можно сгенерировать sitemap.xml</p>
              <div className="bg-card/50 p-2 rounded text-sm overflow-x-auto">
                <pre>
                  {`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${scannedUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('\n')}
</urlset>`}
                </pre>
              </div>
              <button
                onClick={() => download('sitemap.xml', sitemapXml(), 'application/xml')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded">
                Скачать sitemap.xml
              </button>
            </div>
          ) : (
            <p className="text-muted-foreground">Нет данных для создания sitemap</p>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4">
        <Card className="bg-card/90 backdrop-blur-sm border-border p-4">
          <h3 className="text-lg font-medium mb-4">Отчеты</h3>
          {scannedUrls.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="border border-border rounded p-4 bg-card/30 backdrop-blur-sm">
                <h4 className="font-medium mb-2">PDF отчет</h4>
                <p className="text-sm mb-4 text-muted-foreground">Брендированный PDF со сметой формируется на странице результатов аудита</p>
                <button disabled title="Доступно в результатах аудита" className="bg-muted text-muted-foreground px-4 py-2 rounded cursor-not-allowed opacity-60">
                  PDF — в результатах аудита
                </button>
              </div>
              <div className="border border-border rounded p-4 bg-card/30 backdrop-blur-sm">
                <h4 className="font-medium mb-2">JSON экспорт</h4>
                <p className="text-sm mb-4 text-muted-foreground">Полные данные в формате JSON</p>
                <button
                  onClick={() => download('scan-urls.json', JSON.stringify({ scannedAt: new Date().toISOString(), count: scannedUrls.length, urls: scannedUrls }, null, 2), 'application/json')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded">
                  Скачать JSON
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Нет данных для формирования отчетов</p>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WebsiteAnalyzerTabs;
