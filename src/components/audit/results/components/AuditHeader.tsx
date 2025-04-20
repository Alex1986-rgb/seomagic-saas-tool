
import React from 'react';
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCcw, Database, BrainCircuit } from 'lucide-react';
import DeepCrawlButton from '../../deep-crawl/DeepCrawlButton';
import MassiveCrawlButton from '../../deep-crawl/MassiveCrawlButton';

interface AuditHeaderProps {
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
  onDownloadSitemap?: () => void;
  onTogglePrompt: () => void;
  onExportJSON: () => void;
  showPrompt: boolean;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({
  onRefresh,
  onDeepScan,
  isRefreshing,
  onDownloadSitemap,
  onTogglePrompt,
  onExportJSON,
  showPrompt
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 px-1 mb-4 gap-3 border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Обновить аудит
        </Button>
        
        {onDownloadSitemap && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadSitemap}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Скачать Sitemap
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onExportJSON}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Экспорт JSON
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 self-end lg:self-auto">
        <DeepCrawlButton url={window.location.hostname} />
        <MassiveCrawlButton url={window.location.hostname} />
      </div>
    </div>
  );
};

export default AuditHeader;
