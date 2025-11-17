import React from 'react';
import AuditLoading from '../../AuditLoading';
import AuditError from '../AuditError';
import AuditRefreshing from './AuditRefreshing';
import { AuditRealtimeVisualizer } from '@/components/audit/realtime/AuditRealtimeVisualizer';
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
    status?: string;
    stage?: string;
    progress?: number;
    audit_data?: any;
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
      <AuditRealtimeVisualizer
        url={url}
        statusData={scanDetails}
      />
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
