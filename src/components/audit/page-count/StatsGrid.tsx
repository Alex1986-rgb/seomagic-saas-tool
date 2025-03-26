
import React from 'react';
import SitemapCard from './SitemapCard';
import SiteStructureCard from './SiteStructureCard';
import { PageStatistics } from './types';

interface StatsGridProps {
  pageCount: number;
  pageStats: PageStatistics;
  onDownloadSitemap?: () => void;
}

const StatsGrid: React.FC<StatsGridProps> = ({ 
  pageCount, 
  pageStats, 
  onDownloadSitemap 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <SitemapCard 
        pageCount={pageCount} 
        onDownloadSitemap={onDownloadSitemap} 
      />
      <SiteStructureCard pageStats={pageStats} />
    </div>
  );
};

export default StatsGrid;
