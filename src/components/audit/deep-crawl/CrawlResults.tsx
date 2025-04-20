
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Globe, Download, FileJson } from 'lucide-react';

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap: () => void;
  onDownloadReport: () => void;
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
  // Format the domain for display - show the original input URL as provided by the user
  const displayDomain = domain || "Unknown domain";
  
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Результаты сканирования</CardTitle>
            <CardDescription>
              <span className="flex items-center gap-1 mt-1">
                <Globe className="h-4 w-4" />
                <span>{displayDomain}</span>
              </span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {pageCount} страниц
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="font-medium mb-2">Статистика сканирования</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Всего страниц:</span>
                <span className="font-medium">{pageCount}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Уникальных URL:</span>
                <span className="font-medium">{urls.length}</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onDownloadSitemap}>
              <FileText className="h-4 w-4 mr-2" />
              Скачать Sitemap
            </Button>
            
            <Button size="sm" variant="outline" onClick={onDownloadReport}>
              <FileJson className="h-4 w-4 mr-2" />
              Отчет
            </Button>
            
            {onDownloadAllData && (
              <Button size="sm" variant="outline" onClick={onDownloadAllData}>
                <Download className="h-4 w-4 mr-2" />
                Все данные
              </Button>
            )}
          </div>
          
          {urls.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Найденные URL ({Math.min(urls.length, 5)} из {urls.length})</h4>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md max-h-40 overflow-y-auto text-xs">
                <ul className="space-y-1">
                  {urls.slice(0, 5).map((url, index) => (
                    <li key={index} className="truncate">
                      {url}
                    </li>
                  ))}
                  {urls.length > 5 && (
                    <li className="text-gray-500 dark:text-gray-400 italic">
                      ... и еще {urls.length - 5} URL
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlResults;
