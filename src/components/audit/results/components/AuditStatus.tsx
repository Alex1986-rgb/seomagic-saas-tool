
import React from 'react';
import AuditLoading from '../../AuditLoading';
import AuditError from '../AuditError';
import AuditScanning from './AuditScanning';
import AuditRefreshing from './AuditRefreshing';
import { ErrorDisplay } from '@/components/ui/error-handler';
import { Card } from "@/components/ui/card";

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
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <AuditLoading progress={loadingProgress} />
      </Card>
    );
  }

  if (isScanning) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <AuditScanning 
          url={url} 
          scanDetails={{
            pagesScanned: scanDetails.pages_scanned,
            totalPages: scanDetails.estimated_pages,
            currentUrl: scanDetails.current_url
          }} 
          onDownloadSitemap={onDownloadSitemap} 
        />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <AuditError error={error} onRetry={onRetry} />
      </Card>
    );
  }

  if (isRefreshing) {
    return (
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <AuditRefreshing />
      </Card>
    );
  }

  return null;
};

export default AuditStatus;
