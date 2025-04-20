
import React, { useState } from 'react';
import { CrawlResultsActions } from './components/results/CrawlResultsActions';
import { Button } from '@/components/ui/button';
import { FileText, Download, Package, Map, Database, BarChart2 } from 'lucide-react';
import { ContentExtractorDialog } from './components/ContentExtractorDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
}

const CrawlResults: React.FC<CrawlResultsProps> = ({
  pageCount,
  domain,
  urls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);

  const openContentExtractor = () => {
    setIsExtractorOpen(true);
  };

  const getSiteSize = (count: number) => {
    if (count > 10000) return 'Крупный';
    if (count > 1000) return 'Средний';
    return 'Малый';
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Результаты сканирования
            <Badge variant="outline" className="ml-2">{getSiteSize(pageCount)} сайт</Badge>
          </CardTitle>
          <CardDescription>
            Анализ структуры сайта и данные для создания карты сайта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-muted-foreground">Домен</div>
              <div className="text-lg font-medium">{domain}</div>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-muted-foreground">Обнаружено страниц</div>
              <div className="text-lg font-medium">{pageCount.toLocaleString()}</div>
            </div>
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm text-muted-foreground">Тип сайта</div>
              <div className="text-lg font-medium">{getSiteSize(pageCount)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onDownloadSitemap} 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Скачать Sitemap
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onDownloadReport} 
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Отчет о сканировании
            </Button>
            
            <Button 
              variant="default" 
              size="lg" 
              onClick={openContentExtractor} 
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              Извлечь контент и создать карту сайта
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-muted/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Экспорт данных
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDownloadAllData} 
                  className="gap-2 w-full justify-start"
                >
                  <Download className="h-3.5 w-3.5" />
                  Все данные (ZIP)
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <Map className="h-4 w-4 mr-2" />
                  Карта сайта
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDownloadSitemap} 
                  className="gap-2 w-full justify-start"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Sitemap XML
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm flex items-center">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Аналитика
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDownloadReport} 
                  className="gap-2 w-full justify-start"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Отчет SEO
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-sm text-muted-foreground mt-4">
            Сканирование завершено. Вы можете скачать карту сайта для отправки в Google Search Console
            или выполнить экстракцию контента для более детального анализа.
          </div>
        </CardContent>
      </Card>
      
      <CrawlResultsActions 
        domain={domain}
        pageCount={pageCount}
        urls={urls}
        onDownloadSitemap={onDownloadSitemap}
        onDownloadReport={onDownloadReport}
        onDownloadAllData={onDownloadAllData}
      />
      
      <ContentExtractorDialog
        open={isExtractorOpen}
        onClose={() => setIsExtractorOpen(false)}
        urls={urls}
        domain={domain}
      />
    </div>
  );
};

export default CrawlResults;
