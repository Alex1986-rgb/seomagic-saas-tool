
import React from 'react';
import { FileText, Search, BarChart, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleSitemapCreatorTool from '@/components/audit/deep-crawl/SimpleSitemapCreatorTool';
import { useMobile } from '@/hooks/use-mobile';

interface ScannerTabsProps {
  url: string;
  onUrlsScanned: (urls: string[]) => void;
  scannedUrls: string[];
  hasAuditResults: boolean;
  isScanning: boolean;
  startFullScan: () => void;
  handleDownloadPdfReport: () => void;
  handleDownloadErrorReport: () => void;
}

const ScannerTabs: React.FC<ScannerTabsProps> = ({
  url,
  onUrlsScanned,
  scannedUrls,
  hasAuditResults,
  isScanning,
  startFullScan,
  handleDownloadPdfReport,
  handleDownloadErrorReport
}) => {
  const isMobile = useMobile();

  return (
    <Tabs defaultValue="sitemap" className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-4 md:mb-6">
        <TabsTrigger value="sitemap" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 px-1 md:px-3 text-xs md:text-sm">
          <FileText className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Карта сайта</span>
        </TabsTrigger>
        <TabsTrigger value="audit" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 px-1 md:px-3 text-xs md:text-sm">
          <Search className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Аудит</span>
        </TabsTrigger>
        <TabsTrigger value="reports" className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 px-1 md:px-3 text-xs md:text-sm">
          <BarChart className="h-3 w-3 md:h-4 md:w-4" />
          <span className="truncate">Отчеты</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="sitemap" className="mt-2 md:mt-4">
        <SimpleSitemapCreatorTool 
          initialUrl={url} 
          onUrlsScanned={onUrlsScanned} 
          domain={url.replace(/^https?:\/\//, '')}
        />
      </TabsContent>
      
      <TabsContent value="audit" className="mt-2 md:mt-4">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Аудит сайта</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Проверка основных SEO-параметров и выявление проблем
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {scannedUrls.length > 0 || hasAuditResults ? (
              <div className="space-y-4">
                <p className="text-xs md:text-sm">{scannedUrls.length > 0 ? `Найдено ${scannedUrls.length} URL для аудита` : "Аудит готов"}</p>
                <Button 
                  className="gap-2 w-full md:w-auto" 
                  onClick={startFullScan}
                  disabled={isScanning}
                >
                  <Search className="h-4 w-4" />
                  {hasAuditResults ? "Обновить данные аудита" : "Начать аудит"}
                </Button>
              </div>
            ) : (
              <p className="text-xs md:text-sm text-muted-foreground">
                Сначала выполните сканирование сайта или создайте карту сайта
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports" className="mt-2 md:mt-4">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Отчеты и рекомендации</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Генерация отчетов и рекомендаций по оптимизации
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              {hasAuditResults || scannedUrls.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadPdfReport}>
                    <FileText className="h-4 w-4" />
                    <span className="text-xs md:text-sm">Скачать полный SEO-отчет</span>
                  </Button>
                  <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadErrorReport}>
                    <Download className="h-4 w-4" />
                    <span className="text-xs md:text-sm">Скачать отчет об ошибках</span>
                  </Button>
                  {scannedUrls.length > 0 && (
                    <Button variant="outline" className="gap-2 justify-start">
                      <Download className="h-4 w-4" />
                      <span className="text-xs md:text-sm">Скачать карту сайта</span>
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-xs md:text-sm text-muted-foreground">
                  Доступные отчеты появятся после выполнения аудита
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ScannerTabs;
