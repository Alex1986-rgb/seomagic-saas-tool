
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Share } from 'lucide-react';

interface CrawlResultsActionsProps {
  domain: string;
  pageCount: number;
  urls: string[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
}

export const CrawlResultsActions: React.FC<CrawlResultsActionsProps> = ({
  domain,
  pageCount,
  urls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData,
  pageTypes,
  depthData,
  brokenLinks,
  duplicatePages
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-end">
      {onDownloadSitemap && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadSitemap}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Скачать Sitemap
        </Button>
      )}
      
      {onDownloadReport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadReport}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Скачать отчет
        </Button>
      )}
      
      {onDownloadAllData && (
        <Button
          variant="default"
          size="sm"
          onClick={onDownloadAllData}
          className="gap-2"
        >
          <Share className="h-4 w-4" />
          Экспортировать все данные
        </Button>
      )}
    </div>
  );
};
