
import React from 'react';
import AuditStatus from './AuditStatus';
import AuditResultHeader from './AuditResultHeader';
import AuditRecommendationsSection from './AuditRecommendationsSection';
import AuditPageAnalysisSection from './AuditPageAnalysisSection';
import AuditOptimizationSection from './AuditOptimizationSection';
import { AuditHistoryData } from '@/types/audit';

interface AuditContentProps {
  url: string;
  isLoading: boolean;
  loadingProgress: number;
  isScanning: boolean;
  isRefreshing: boolean;
  auditError: string | null;
  scanDetails: {
    pages_scanned: number;
    estimated_pages: number;
    current_url: string;
  };
  auditData: any;
  recommendations: any;
  historyData: AuditHistoryData;
  optimizationCost: any;
  optimizationItems: any[];
  isOptimized: boolean;
  contentPrompt: string;
  taskId: string | null;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onRetry: () => void;
  onDownloadSitemap?: () => void;
  loadAuditData: (refresh?: boolean, deepScan?: boolean) => Promise<void>;
  handleSelectHistoricalAudit: (auditId: string) => void;
  downloadSitemap?: () => void;
  exportJSONData: () => void;
  generatePdfReportFile: () => void;
  downloadOptimizedSite: () => Promise<void>; // Updated return type
  optimizeSiteContent: () => Promise<void>; // Updated return type
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditContent: React.FC<AuditContentProps> = ({
  url,
  isLoading,
  loadingProgress,
  isScanning,
  isRefreshing,
  auditError,
  scanDetails,
  auditData,
  recommendations,
  historyData,
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  taskId,
  showPrompt,
  onTogglePrompt,
  onRetry,
  onDownloadSitemap,
  loadAuditData,
  handleSelectHistoricalAudit,
  downloadSitemap,
  exportJSONData,
  generatePdfReportFile,
  downloadOptimizedSite,
  optimizeSiteContent,
  setContentOptimizationPrompt
}) => {
  return (
    <>
      {/* Status component (loading, scanning, error) */}
      <AuditStatus 
        isLoading={isLoading}
        loadingProgress={loadingProgress}
        isScanning={isScanning}
        isRefreshing={isRefreshing}
        error={auditError}
        scanDetails={scanDetails}
        url={url}
        onRetry={onRetry}
        onDownloadSitemap={onDownloadSitemap}
      />
      
      {/* Display results after audit completion */}
      {!isLoading && !isScanning && !auditError && auditData && recommendations && (
        <>
          {/* Header and main audit data */}
          <AuditResultHeader 
            url={url}
            auditData={auditData}
            recommendations={recommendations}
            historyData={historyData}
            taskId={taskId || ""}
            onRefresh={() => loadAuditData(true)}
            onDeepScan={() => loadAuditData(false, true)}
            isRefreshing={isRefreshing}
            onDownloadSitemap={downloadSitemap}
            onTogglePrompt={onTogglePrompt}
            onExportJSON={exportJSONData}
            onSelectAudit={handleSelectHistoricalAudit}
            showPrompt={showPrompt}
          />
          
          {/* Recommendations section */}
          <AuditRecommendationsSection 
            recommendations={recommendations}
            auditData={auditData}
            optimizationCost={optimizationCost}
            optimizationItems={optimizationItems}
          />
          
          {/* Page analysis section */}
          <AuditPageAnalysisSection auditId={auditData.id} />
          
          {/* Optimization section */}
          <AuditOptimizationSection 
            optimizationCost={optimizationCost}
            optimizationItems={optimizationItems}
            isOptimized={isOptimized}
            contentPrompt={contentPrompt}
            url={url}
            pageCount={auditData.pageCount || 0}
            showPrompt={showPrompt}
            onTogglePrompt={onTogglePrompt}
            onOptimize={optimizeSiteContent}
            onDownloadOptimizedSite={downloadOptimizedSite}
            onGeneratePdfReport={generatePdfReportFile}
            setContentOptimizationPrompt={setContentOptimizationPrompt}
          />
        </>
      )}
    </>
  );
};

export default AuditContent;
