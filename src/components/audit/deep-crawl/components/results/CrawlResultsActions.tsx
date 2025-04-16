
import React from 'react';
import { Download, FileText, FilePlus, Server } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ExportDeepCrawlPdf from '../../ExportDeepCrawlPdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const CrawlResultsActions: React.FC<CrawlResultsActionsProps> = ({
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
    <div className="flex flex-wrap justify-end space-x-2 mt-4">
      {onDownloadSitemap && (
        <Button 
          onClick={onDownloadSitemap}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Скачать Sitemap
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FilePlus className="h-4 w-4" />
            <span>PDF отчет</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <div className="cursor-pointer">
              <ExportDeepCrawlPdf
                domain={domain}
                urls={urls}
                pageCount={pageCount}
                pageTypes={pageTypes}
                depthData={depthData}
                brokenLinks={brokenLinks}
                duplicatePages={duplicatePages}
                includeFullDetails={false}
                enhancedStyling={false}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div className="cursor-pointer">
              <ExportDeepCrawlPdf
                domain={domain}
                urls={urls}
                pageCount={pageCount}
                pageTypes={pageTypes}
                depthData={depthData}
                brokenLinks={brokenLinks}
                duplicatePages={duplicatePages}
                includeFullDetails={true}
                enhancedStyling={true}
                variant="ghost"
                className="w-full justify-start px-2"
              >
                <span>Расширенный PDF отчет</span>
              </ExportDeepCrawlPdf>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onDownloadReport && (
        <Button 
          onClick={onDownloadReport}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Скачать отчет
        </Button>
      )}
      
      {onDownloadAllData && (
        <Button 
          onClick={onDownloadAllData}
          size="sm"
          className="gap-2"
        >
          <Server className="h-4 w-4" />
          Скачать все данные
        </Button>
      )}
    </div>
  );
};

export default CrawlResultsActions;
