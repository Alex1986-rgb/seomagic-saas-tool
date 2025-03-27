
import React from 'react';
import { Map } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { StatsCard } from './index';

interface CrawlSummaryTabProps {
  pageCount: number;
  directoryCount: number;
  maxPagesInDirectory: number;
  domain: string;
  onDownloadSitemap: () => void;
}

const CrawlSummaryTab: React.FC<CrawlSummaryTabProps> = ({
  pageCount,
  directoryCount,
  maxPagesInDirectory,
  domain,
  onDownloadSitemap
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatsCard 
          value={pageCount.toLocaleString('ru-RU')} 
          label="Всего страниц" 
        />
        
        <StatsCard 
          value={directoryCount.toLocaleString('ru-RU')} 
          label="Разделов сайта" 
        />
        
        <StatsCard 
          value={maxPagesInDirectory.toLocaleString('ru-RU')} 
          label="Страниц в разделе" 
        />
      </div>
      
      <div className="flex justify-between p-4 bg-background rounded-lg border mt-4">
        <div className="text-sm">
          <div className="font-medium mb-1">Сканирование завершено</div>
          <div className="text-muted-foreground">
            Сканирование сайта {domain} успешно завершено. Используйте вкладки выше для просмотра 
            и экспорта результатов анализа.
          </div>
        </div>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5"
            onClick={onDownloadSitemap}
          >
            <Map className="h-4 w-4" />
            <span>Sitemap</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrawlSummaryTab;
