
import React from 'react';
import { motion } from 'framer-motion';
import CrawlResults from '../../CrawlResults';

interface ResultsTabProps {
  isCompleted: boolean;
  error: string | null;
  pagesScanned: number;
  domain: string;
  scannedUrls: string[];
  onDownloadSitemap: () => void;
  onDownloadReport: () => void;
  onDownloadAllData: () => void;
}

const ResultsTab: React.FC<ResultsTabProps> = ({
  isCompleted,
  error,
  pagesScanned,
  domain,
  scannedUrls,
  onDownloadSitemap,
  onDownloadReport,
  onDownloadAllData
}) => {
  if (!isCompleted || error) {
    return null;
  }

  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CrawlResults
        pageCount={pagesScanned}
        domain={domain}
        urls={scannedUrls}
        onDownloadSitemap={onDownloadSitemap}
        onDownloadReport={onDownloadReport}
        onDownloadAllData={onDownloadAllData}
      />
    </motion.div>
  );
};

export default ResultsTab;
