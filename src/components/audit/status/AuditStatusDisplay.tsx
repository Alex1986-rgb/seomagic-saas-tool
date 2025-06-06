
import React from 'react';
import { motion } from 'framer-motion';
import AuditStatus from '@/components/audit/results/components/AuditStatus';

interface AuditStatusDisplayProps {
  isLoading: boolean;
  loadingProgress: number;
  isScanning: boolean;
  isRefreshing: boolean;
  error: string | null;
  scanDetails: {
    pages_scanned: number;
    estimated_pages: number;
    current_url: string;
  };
  url: string;
  onRetry: () => void;
  onDownloadSitemap?: () => void;
}

const AuditStatusDisplay: React.FC<AuditStatusDisplayProps> = ({
  isLoading,
  loadingProgress,
  isScanning,
  isRefreshing,
  error,
  scanDetails,
  url,
  onRetry,
  onDownloadSitemap
}) => {
  if (!isLoading && !isScanning && !error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AuditStatus 
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        isScanning={isScanning}
        isRefreshing={isRefreshing}
        error={error}
        scanDetails={scanDetails}
        url={url}
        onRetry={onRetry}
        onDownloadSitemap={onDownloadSitemap}
      />
    </motion.div>
  );
};

export default AuditStatusDisplay;
