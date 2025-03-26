
import React from 'react';
import { RefreshCw, Calendar, FileSearch, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuditActionButtons from './AuditActionButtons';
import ExportDropdown from '../../share/ExportDropdown';

interface AuditHeaderProps {
  onRefresh: () => void;
  onDeepScan: () => void;
  isRefreshing: boolean;
  onDownloadSitemap?: () => void;
}

const AuditHeader: React.FC<AuditHeaderProps> = ({ 
  onRefresh, 
  onDeepScan, 
  isRefreshing,
  onDownloadSitemap
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card/50 border border-border/50 rounded-lg p-4 mb-6">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold mb-1">Результаты аудита</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date().toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</span>
        </div>
      </div>
      
      <div className="flex mt-4 md:mt-0 gap-2 w-full md:w-auto justify-between md:justify-end">
        {onDownloadSitemap && (
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={onDownloadSitemap}
          >
            <Download className="h-4 w-4" />
            Скачать Sitemap
          </Button>
        )}
        <AuditActionButtons
          onRefresh={onRefresh}
          onDeepScan={onDeepScan}
          isRefreshing={isRefreshing}
        />
        <ExportDropdown />
      </div>
    </div>
  );
};

export default AuditHeader;
