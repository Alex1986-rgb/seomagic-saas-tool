
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Download } from 'lucide-react';

interface CrawlResultsActionsProps {
  domain: string;
  pageCount: number;
  urls: string[];
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
}

export const CrawlResultsActions: React.FC<CrawlResultsActionsProps> = ({
  domain,
  pageCount,
  urls,
  pageTypes,
  depthData,
  brokenLinks,
  duplicatePages,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-end mt-4">
      {onDownloadSitemap && (
        <Button variant="outline" size="sm" onClick={onDownloadSitemap} className="gap-1">
          <FileDown className="h-3 w-3" />
          <span>Sitemap</span>
        </Button>
      )}

      {onDownloadReport && (
        <Button variant="outline" size="sm" onClick={onDownloadReport} className="gap-1">
          <FileText className="h-3 w-3" />
          <span>Отчет</span>
        </Button>
      )}

      {onDownloadAllData && (
        <Button size="sm" onClick={onDownloadAllData} className="gap-1">
          <Download className="h-3 w-3" />
          <span>Скачать все данные</span>
        </Button>
      )}
    </div>
  );
};

export default CrawlResultsActions;
