
import React from 'react';
import { FileText, Search, BarChart, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimpleSitemapCreatorTool from '@/components/audit/deep-crawl/SimpleSitemapCreatorTool';

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
  return (
    <Tabs defaultValue="sitemap">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="sitemap">
          <FileText className="mr-2 h-4 w-4" />
          Карта сайта
        </TabsTrigger>
        <TabsTrigger value="audit">
          <Search className="mr-2 h-4 w-4" />
          Аудит
        </TabsTrigger>
        <TabsTrigger value="reports">
          <BarChart className="mr-2 h-4 w-4" />
          Отчеты
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="sitemap" className="mt-4">
        <SimpleSitemapCreatorTool 
          initialUrl={url} 
          onUrlsScanned={onUrlsScanned} 
          domain={url.replace(/^https?:\/\//, '')}
        />
      </TabsContent>
      
      <TabsContent value="audit" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Аудит сайта</CardTitle>
            <CardDescription>
              Проверка основных SEO-параметров и выявление проблем
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedUrls.length > 0 || hasAuditResults ? (
              <div className="space-y-4">
                <p className="text-sm">{scannedUrls.length > 0 ? `Найдено ${scannedUrls.length} URL для аудита` : "Аудит готов"}</p>
                <Button 
                  className="gap-2" 
                  onClick={startFullScan}
                  disabled={isScanning}
                >
                  <Search className="h-4 w-4" />
                  {hasAuditResults ? "Обновить данные аудита" : "Начать аудит"}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Сначала выполните сканирование сайта или создайте карту сайта
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Отчеты и рекомендации</CardTitle>
            <CardDescription>
              Генерация отчетов и рекомендаций по оптимизации
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hasAuditResults || scannedUrls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadPdfReport}>
                    <FileText className="h-4 w-4" />
                    Скачать полный SEO-отчет
                  </Button>
                  <Button variant="outline" className="gap-2 justify-start" onClick={handleDownloadErrorReport}>
                    <Download className="h-4 w-4" />
                    Скачать отчет об ошибках
                  </Button>
                  {scannedUrls.length > 0 && (
                    <Button variant="outline" className="gap-2 justify-start">
                      <Download className="h-4 w-4" />
                      Скачать карту сайта
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
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
