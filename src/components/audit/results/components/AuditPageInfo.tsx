
import React from 'react';
import PageCountDisplay from '../../page-count';
import { DeepCrawlButton } from '../../deep-crawl';

interface AuditPageInfoProps {
  pageCount?: number;
  pageStats: any;
  url: string;
  onUpdatePageCount: (count: number) => void;
  onDownloadSitemap?: () => void;
}

const AuditPageInfo: React.FC<AuditPageInfoProps> = ({
  pageCount,
  pageStats,
  url,
  onUpdatePageCount,
  onDownloadSitemap
}) => {
  if (!pageCount) return null;

  return (
    <div className="relative">
      <PageCountDisplay 
        pageCount={pageCount} 
        isScanning={false}
        pageStats={pageStats}
        onDownloadSitemap={onDownloadSitemap}
      />
      
      <div className="absolute top-4 right-4">
        <DeepCrawlButton 
          url={url} 
          onCrawlComplete={onUpdatePageCount} 
        />
      </div>
    </div>
  );
};

export default AuditPageInfo;
