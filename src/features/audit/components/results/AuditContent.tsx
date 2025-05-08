
import React from 'react';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditContentProps {
  url: string;
  isLoading: boolean;
  loadingProgress: number;
  isScanning: boolean;
  isRefreshing: boolean;
  auditError: any;
  scanDetails: any;
  auditData: AuditData | null;
  recommendations: RecommendationData | null;
  historyData: AuditHistoryData | null;
  optimizationCost?: number;
  optimizationItems?: any[];
  isOptimized?: boolean;
  contentPrompt: string;
  taskId?: string | null;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onRetry: () => void;
  onDownloadSitemap?: () => void;
  loadAuditData: (refresh?: boolean) => void;
  handleSelectHistoricalAudit: (auditId: string) => void;
  downloadSitemap?: () => void;
  exportJSONData: () => void;
  generatePdfReportFile: () => void;
  downloadOptimizedSite: () => void;
  optimizeSiteContent: () => void;
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditContent: React.FC<AuditContentProps> = ({
  url,
  auditData,
  recommendations,
  historyData
}) => {
  if (!auditData) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-xl text-muted-foreground">Загрузка данных аудита...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-4">
      <h2 className="text-2xl font-bold">Аудит сайта: {url}</h2>
      <div className="p-4 bg-card rounded-lg border">
        <p className="text-lg">Общий балл: {auditData.score}</p>
        <p>URL: {auditData.url}</p>
        <p>Дата: {auditData.date}</p>
        <p>Статус: {auditData.status}</p>
      </div>
    </div>
  );
};

export default AuditContent;
