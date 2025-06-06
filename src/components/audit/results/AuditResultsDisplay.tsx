
import React from 'react';
import { motion } from 'framer-motion';
import AuditResultHeader from './components/AuditResultHeader';
import AuditRecommendationsSection from './components/AuditRecommendationsSection';
import AuditPageAnalysisSection from './components/AuditPageAnalysisSection';
import AuditOptimizationSection from './components/AuditOptimizationSection';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';

interface AuditResultsDisplayProps {
  url: string;
  auditData: AuditData;
  recommendations: RecommendationData;
  historyData: AuditHistoryData;
  optimizationCost: any;
  optimizationItems: any[];
  isOptimized: boolean;
  contentPrompt: string;
  taskId: string | null;
  showPrompt: boolean;
  isRefreshing: boolean;
  onTogglePrompt: () => void;
  loadAuditData: (refresh?: boolean, deepScan?: boolean) => Promise<void>;
  handleSelectHistoricalAudit: (auditId: string) => void;
  downloadSitemap?: () => void;
  exportJSONData: () => void;
  generatePdfReportFile: () => void;
  downloadOptimizedSite: () => Promise<void>;
  optimizeSiteContent: () => Promise<void>;
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditResultsDisplay: React.FC<AuditResultsDisplayProps> = ({
  url,
  auditData,
  recommendations,
  historyData,
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  taskId,
  showPrompt,
  isRefreshing,
  onTogglePrompt,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
    </motion.div>
  );
};

export default AuditResultsDisplay;
