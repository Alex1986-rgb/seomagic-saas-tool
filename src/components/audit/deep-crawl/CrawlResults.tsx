
import React, { useState } from 'react';
import { CrawlResultsActions } from './components/results/CrawlResultsActions';
import { Button } from '@/components/ui/button';
import { FileText, Download, Package } from 'lucide-react';
import { ContentExtractorDialog } from './components/ContentExtractorDialog';

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

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg border">
        <h2 className="text-xl font-medium mb-4">Результаты сканирования</h2>
        
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
            <div className="text-lg font-medium">{pageCount > 10000 ? 'Крупный' : pageCount > 1000 ? 'Средний' : 'Малый'}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
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
          
          <div className="text-sm text-muted-foreground mt-4">
            Сканирование завершено. Вы можете скачать карту сайта для отправки в Google Search Console
            или выполнить экстракцию контента для более детального анализа.
          </div>
        </div>
      </div>
      
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
