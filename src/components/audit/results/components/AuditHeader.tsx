
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Scan, Text, FileJson } from 'lucide-react';

interface AuditHeaderProps {
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
  onDownloadSitemap?: () => void;
  onTogglePrompt?: () => void;
  onExportJSON?: () => void;
  showPrompt?: boolean;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ 
  onRefresh, 
  onDeepScan, 
  isRefreshing, 
  onDownloadSitemap,
  onTogglePrompt,
  onExportJSON,
  showPrompt = false
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          className="gap-2" 
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Обновить</span>
        </Button>
        
        <Button 
          onClick={onDeepScan} 
          variant="outline" 
          className="gap-2"
          disabled={isRefreshing}
        >
          <Scan className="h-4 w-4" />
          <span>Глубокий анализ</span>
        </Button>
        
        {onTogglePrompt && (
          <Button 
            onClick={onTogglePrompt} 
            variant={showPrompt ? "default" : "outline"} 
            className="gap-2"
          >
            <Text className="h-4 w-4" />
            <span>{showPrompt ? 'Скрыть промпт' : 'Оптимизация контента'}</span>
          </Button>
        )}
        
        {onExportJSON && (
          <Button 
            onClick={onExportJSON} 
            variant="outline" 
            className="gap-2"
          >
            <FileJson className="h-4 w-4" />
            <span>Экспорт JSON</span>
          </Button>
        )}
      </div>
      
      {onDownloadSitemap && (
        <Button 
          onClick={onDownloadSitemap} 
          variant="outline" 
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Скачать Sitemap</span>
        </Button>
      )}
    </div>
  );
};

export default AuditHeader;
