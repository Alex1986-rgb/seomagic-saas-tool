
import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  CrawlResultsTabs, 
  CrawlStatsCards,
  CrawlResultsActions 
} from './components/results';

interface CrawlResultsProps {
  pageCount: number;
  domain: string;
  urls: string[];
  onDownloadSitemap?: () => void;
  onDownloadReport?: () => void;
  onDownloadAllData?: () => void;
  pageTypes?: Record<string, number>;
  depthData?: { level: number; count: number }[];
  brokenLinks?: { url: string; statusCode: number }[];
  duplicatePages?: { url: string; similarUrls: string[] }[];
}

export const CrawlResults: React.FC<CrawlResultsProps> = ({
  pageCount,
  domain,
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium">Результаты сканирования</h2>
        </div>
        
        <Badge variant="outline" className="font-normal">
          {pageCount} страниц
        </Badge>
      </div>
      
      <CrawlStatsCards pageCount={pageCount} urls={urls} />
      
      <CrawlResultsTabs urls={urls} pageCount={pageCount} />
      
      <CrawlResultsActions 
        domain={domain}
        pageCount={pageCount}
        urls={urls}
        pageTypes={pageTypes}
        depthData={depthData}
        brokenLinks={brokenLinks}
        duplicatePages={duplicatePages}
        onDownloadSitemap={onDownloadSitemap}
        onDownloadReport={onDownloadReport}
        onDownloadAllData={onDownloadAllData}
      />
    </motion.div>
  );
};

export default CrawlResults;
