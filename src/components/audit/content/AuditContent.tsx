
import React from 'react';
import { motion } from 'framer-motion';
import AuditStatusDisplay from '@/components/audit/status/AuditStatusDisplay';
import AuditResultsDisplay from '@/components/audit/results/AuditResultsDisplay';
import AuditMinimalView from '@/components/audit/minimal/AuditMinimalView';
import { useAuditDisplay } from '@/components/audit/hooks/useAuditDisplay';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

export interface AuditContentProps {
  // Core props
  url: string;
  auditData?: AuditData | null;
  recommendations?: RecommendationData | null;
  historyData?: AuditHistoryData | null;
  
  // Status props
  isLoading?: boolean;
  loadingProgress?: number;
  isScanning?: boolean;
  isRefreshing?: boolean;
  auditError?: any;
  scanDetails?: {
    pages_scanned: number;
    estimated_pages: number;
    current_url: string;
  };
  
  // Optimization props
  optimizationCost?: number;
  optimizationItems?: any[];
  isOptimized?: boolean;
  contentPrompt?: string;
  taskId?: string | null;
  showPrompt?: boolean;
  
  // Function handlers
  onTogglePrompt?: () => void;
  onRetry?: () => void;
  onDownloadSitemap?: () => void;
  loadAuditData?: (refresh?: boolean, deepScan?: boolean) => Promise<void> | void;
  handleSelectHistoricalAudit?: (auditId: string) => void;
  exportJSONData?: () => void;
  generatePdfReportFile?: () => void;
  downloadOptimizedSite?: () => Promise<void>;
  optimizeSiteContent?: () => Promise<void>;
  setContentOptimizationPrompt?: (prompt: string) => void;
  
  // Optional variant props
  variant?: 'full' | 'minimal';
  urls?: string[];
}

const AuditContent: React.FC<AuditContentProps> = ({
  // Core props
  url,
  auditData,
  recommendations,
  historyData,
  
  // Status props
  isLoading = false,
  loadingProgress = 0,
  isScanning = false,
  isRefreshing = false,
  auditError = null,
  scanDetails = { pages_scanned: 0, estimated_pages: 0, current_url: '' },
  
  // Optimization props
  optimizationCost,
  optimizationItems = [],
  isOptimized = false,
  contentPrompt = '',
  taskId = null,
  showPrompt = false,
  
  // Function handlers
  onTogglePrompt = () => {},
  onRetry = () => {},
  onDownloadSitemap,
  loadAuditData = () => {},
  handleSelectHistoricalAudit = () => {},
  exportJSONData = () => {},
  generatePdfReportFile = () => {},
  downloadOptimizedSite = () => Promise.resolve(),
  optimizeSiteContent = () => Promise.resolve(),
  setContentOptimizationPrompt = () => {},
  
  // Display variant
  variant = 'full',
  urls,
}) => {
  const { shouldShowStatus, shouldShowResults, shouldShowMinimalResults } = useAuditDisplay({
    isLoading,
    isScanning,
    auditError,
    auditData,
    recommendations,
    variant
  });

  if (shouldShowMinimalResults) {
    return (
      <AuditMinimalView
        auditData={auditData!}
        historyData={historyData}
        url={url}
        urls={urls}
        taskId={taskId}
        handleSelectHistoricalAudit={handleSelectHistoricalAudit}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {shouldShowStatus && (
        <AuditStatusDisplay
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
      )}
      
      {shouldShowResults && variant === 'full' && (
        <AuditResultsDisplay
          url={url}
          auditData={auditData!}
          recommendations={recommendations!}
          historyData={historyData!}
          optimizationCost={optimizationCost}
          optimizationItems={optimizationItems}
          isOptimized={isOptimized}
          contentPrompt={contentPrompt}
          taskId={taskId}
          showPrompt={showPrompt}
          isRefreshing={isRefreshing}
          onTogglePrompt={onTogglePrompt}
          loadAuditData={loadAuditData}
          handleSelectHistoricalAudit={handleSelectHistoricalAudit}
          downloadSitemap={onDownloadSitemap}
          exportJSONData={exportJSONData}
          generatePdfReportFile={generatePdfReportFile}
          downloadOptimizedSite={downloadOptimizedSite}
          optimizeSiteContent={optimizeSiteContent}
          setContentOptimizationPrompt={setContentOptimizationPrompt}
        />
      )}
    </motion.div>
  );
};

export default AuditContent;
