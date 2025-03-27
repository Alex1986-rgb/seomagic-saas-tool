
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Map, Download } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch } from 'lucide-react';
import { 
  CrawlSummaryTab, 
  CrawlStructureTab, 
  CrawlExportTab 
} from './components/results';

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap: () => void;
  onDownloadReport: () => void;
  onDownloadAllData: () => void;
}

const CrawlResults: React.FC<CrawlResultsProps> = ({
  pageCount,
  domain,
  urls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Calculate URL statistics
  const urlStats = React.useMemo(() => {
    // Count URLs by directory patterns
    const directoryCount: Record<string, number> = {};
    
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        
        // Skip URLs from other domains
        if (urlObj.hostname !== domain) return;
        
        // Count by first directory
        const firstDir = path.split('/')[1] || 'root';
        directoryCount[firstDir] = (directoryCount[firstDir] || 0) + 1;
      } catch (e) {
        // Skip invalid URLs
      }
    });
    
    return {
      directoryCount,
      maxPagesInDirectory: Math.max(...Object.values(directoryCount)) || 0
    };
  }, [urls, domain]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-primary" />
            <span>Результаты сканирования</span>
          </div>
          <div className="text-sm font-normal text-muted-foreground">
            {new Date().toLocaleDateString('ru-RU')}
          </div>
        </CardTitle>
        <CardDescription>
          Найдено {pageCount.toLocaleString('ru-RU')} страниц на сайте {domain}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary" className="flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Итоги</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-1.5">
              <Map className="h-4 w-4" />
              <span>Структура</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-1.5">
              <Download className="h-4 w-4" />
              <span>Экспорт</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-2">
            <CrawlSummaryTab 
              pageCount={pageCount}
              directoryCount={Object.keys(urlStats.directoryCount).length}
              maxPagesInDirectory={urlStats.maxPagesInDirectory}
              domain={domain}
              onDownloadSitemap={onDownloadSitemap}
            />
          </TabsContent>
          
          <TabsContent value="structure" className="mt-2">
            <CrawlStructureTab 
              directoryCount={urlStats.directoryCount}
              pageCount={pageCount}
              urls={urls}
              onDownloadReport={onDownloadReport}
            />
          </TabsContent>
          
          <TabsContent value="export" className="mt-2">
            <CrawlExportTab 
              onDownloadSitemap={onDownloadSitemap}
              onDownloadAllData={onDownloadAllData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CrawlResults;
