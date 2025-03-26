
import React from 'react';
import { motion } from 'framer-motion';
import { PageCountDisplayProps } from './types';
import PageCountHeader from './PageCountHeader';
import PageTypeDistribution from './PageTypeDistribution';
import SiteDepthVisualization from './SiteDepthVisualization';
import StatsGrid from './StatsGrid';

const PageCountDisplay: React.FC<PageCountDisplayProps> = ({ 
  pageCount, 
  isScanning, 
  pageStats,
  onDownloadSitemap 
}) => {
  return (
    <motion.div 
      className="p-4 border border-primary/20 rounded-lg mb-4 bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageCountHeader 
        pageCount={pageCount} 
        isScanning={isScanning} 
        onDownloadSitemap={onDownloadSitemap}
      />
      
      {!isScanning && pageCount > 0 && pageStats && (
        <div className="mt-4 space-y-3">
          {pageStats.subpages && Object.keys(pageStats.subpages).length > 0 && (
            <PageTypeDistribution pageStats={pageStats} pageCount={pageCount} />
          )}
          
          {pageStats.levels && Object.keys(pageStats.levels).length > 0 && (
            <SiteDepthVisualization pageStats={pageStats} />
          )}
          
          <StatsGrid 
            pageCount={pageCount} 
            pageStats={pageStats} 
            onDownloadSitemap={onDownloadSitemap} 
          />
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Анализ основан на структуре и глубине сайта с учетом всех обнаруженных страниц
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageCountDisplay;
