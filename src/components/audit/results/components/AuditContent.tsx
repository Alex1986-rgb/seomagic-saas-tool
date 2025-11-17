import React, { useState } from 'react';
import AuditStatus from './AuditStatus';
import AuditResultHeader from './AuditResultHeader';
import AuditRecommendationsSection from './AuditRecommendationsSection';
import AuditPageAnalysisSection from './AuditPageAnalysisSection';
import AuditOptimizationSection from './AuditOptimizationSection';
import AuditResultsViewSwitcher from '../dashboard/AuditResultsViewSwitcher';
import { AuditHistoryData } from '@/types/audit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List } from 'lucide-react';

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
    stage?: string;
    progress?: number;
    status?: string;
    audit_data?: any;
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
  const [viewMode, setViewMode] = useState<'dashboard' | 'classic'>('dashboard');

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
          {/* Tabs for switching between views */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'dashboard' | 'classic')} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Интерактивная панель
              </TabsTrigger>
              <TabsTrigger value="classic">
                <List className="mr-2 h-4 w-4" />
                Классический вид
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AuditResultsViewSwitcher
                auditData={auditData}
                defaultMode="dashboard"
                onExportPDF={generatePdfReportFile}
                onExportJSON={exportJSONData}
                onShare={() => {}}
              />
            </TabsContent>

            <TabsContent value="classic" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default AuditContent;
