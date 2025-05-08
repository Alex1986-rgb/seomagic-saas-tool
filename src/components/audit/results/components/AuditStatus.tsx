
import React from 'react';
import AuditLoading from '../../AuditLoading';
import AuditError from '../AuditError';
import AuditScanning from './AuditScanning';
import AuditRefreshing from './AuditRefreshing';
import { ErrorDisplay } from '@/components/ui/error-handler';

interface AuditStatusProps {
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

const AuditStatus: React.FC<AuditStatusProps> = ({
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
  if (isLoading) {
    return <AuditLoading progress={loadingProgress} />;
  }

  if (isScanning) {
    return <AuditScanning 
      url={url} 
      scanDetails={{
        pagesScanned: scanDetails.pages_scanned,
        totalPages: scanDetails.estimated_pages,
        currentUrl: scanDetails.current_url
      }} 
      onDownloadSitemap={onDownloadSitemap} 
    />;
  }

  if (error) {
    return <AuditError error={error} onRetry={onRetry} />;
  }

  if (isRefreshing) {
    return <AuditRefreshing />;
  }

  return null;
};

export default AuditStatus;
