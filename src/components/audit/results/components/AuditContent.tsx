
import React from 'react';
import AuditStatus from './AuditStatus';
import AuditResultHeader from './AuditResultHeader';
import AuditRecommendationsSection from './AuditRecommendationsSection';
import AuditPageAnalysisSection from './AuditPageAnalysisSection';
import AuditOptimizationSection from './AuditOptimizationSection';
import AuditErrorAnalysis from './AuditErrorAnalysis';
import AuditSummaryReport from './AuditSummaryReport';
import { AuditHistoryData } from '@/types/audit';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, FileBarChart2, Settings, Zap } from "lucide-react";

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
  downloadOptimizedSite: () => void;
  optimizeSiteContent: () => void;
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
          
          <Card className="mt-6 mb-6 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full border-b rounded-none justify-start bg-muted/30 overflow-x-auto">
                  <TabsTrigger value="summary">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Общий отчет
                  </TabsTrigger>
                  <TabsTrigger value="errors">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Ошибки
                  </TabsTrigger>
                  <TabsTrigger value="recommendations">
                    <FileBarChart2 className="h-4 w-4 mr-2" />
                    Рекомендации
                  </TabsTrigger>
                  <TabsTrigger value="pageAnalysis">
                    <Zap className="h-4 w-4 mr-2" />
                    Анализ страниц
                  </TabsTrigger>
                  <TabsTrigger value="optimization">
                    <Settings className="h-4 w-4 mr-2" />
                    Оптимизация
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="pt-6 px-6 pb-6 m-0">
                  <AuditSummaryReport 
                    url={url} 
                    auditData={auditData} 
                    recommendations={recommendations}
                  />
                </TabsContent>
                
                <TabsContent value="errors" className="pt-6 px-6 pb-6 m-0">
                  <AuditErrorAnalysis 
                    auditData={auditData} 
                    recommendations={recommendations} 
                  />
                </TabsContent>
                
                <TabsContent value="recommendations" className="pt-6 px-6 pb-6 m-0">
                  <AuditRecommendationsSection 
                    recommendations={recommendations}
                    auditData={auditData}
                    optimizationCost={optimizationCost}
                    optimizationItems={optimizationItems}
                  />
                </TabsContent>
                
                <TabsContent value="pageAnalysis" className="pt-6 px-6 pb-6 m-0">
                  <AuditPageAnalysisSection auditId={auditData.id} />
                </TabsContent>
                
                <TabsContent value="optimization" className="pt-6 px-6 pb-6 m-0">
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
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default AuditContent;
