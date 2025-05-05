
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ListFilter, Map, FileCode, Table2 } from 'lucide-react';
import { useWebsiteAnalyzer } from '@/hooks/use-website-analyzer';
import HtmlExporter from '../html-export/HtmlExporter';

const WebsiteAnalyzerTabs = () => {
  const { scannedUrls, url } = useWebsiteAnalyzer();

  return (
    <Tabs defaultValue="urls" className="space-y-4">
      <TabsList className="grid grid-cols-4">
        <TabsTrigger value="urls" className="flex items-center gap-1">
          <ListFilter className="h-4 w-4" />
          <span className="hidden sm:inline">URLs</span>
        </TabsTrigger>
        <TabsTrigger value="sitemap" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Sitemap</span>
        </TabsTrigger>
        <TabsTrigger value="html" className="flex items-center gap-1">
          <FileCode className="h-4 w-4" />
          <span className="hidden sm:inline">HTML Экспорт</span>
        </TabsTrigger>
        <TabsTrigger value="data" className="flex items-center gap-1">
          <Table2 className="h-4 w-4" />
          <span className="hidden sm:inline">Данные</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="urls">
        <Card className="bg-white dark:bg-[#181929] p-4">
          <h3 className="text-lg font-semibold mb-4">Найденные URLs</h3>
          {scannedUrls.length > 0 ? (
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-2">
              <p className="text-sm font-medium mb-2">Всего: {scannedUrls.length}</p>
              <div className="border rounded-md divide-y">
                {scannedUrls.slice(0, 100).map((url, index) => (
                  <div key={index} className="p-2 text-sm hover:bg-muted/50">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate block">
                      {url}
                    </a>
                  </div>
                ))}
                {scannedUrls.length > 100 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    ...и еще {scannedUrls.length - 100} URL (показаны первые 100)
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Нет данных. Выполните сканирование, чтобы увидеть результаты.
            </div>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="sitemap">
        <Card className="bg-white dark:bg-[#181929] p-4">
          <h3 className="text-lg font-semibold mb-4">Sitemap Генератор</h3>
          <div className="text-center py-8 text-muted-foreground">
            Функционал генерации sitemap в разработке...
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="html">
        <HtmlExporter scannedUrls={scannedUrls} url={url} />
      </TabsContent>
      
      <TabsContent value="data">
        <Card className="bg-white dark:bg-[#181929] p-4">
          <h3 className="text-lg font-semibold mb-4">Аналитика Данных</h3>
          <div className="text-center py-8 text-muted-foreground">
            Функционал анализа данных в разработке...
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WebsiteAnalyzerTabs;
