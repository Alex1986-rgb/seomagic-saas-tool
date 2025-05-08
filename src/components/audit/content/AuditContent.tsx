import React from 'react';
import { motion } from 'framer-motion';
import AuditStatus from '@/components/audit/results/components/AuditStatus';
import AuditResultHeader from '@/components/audit/results/components/AuditResultHeader';
import AuditRecommendationsSection from '@/components/audit/results/components/AuditRecommendationsSection';
import AuditPageAnalysisSection from '@/components/audit/results/components/AuditPageAnalysisSection';
import AuditOptimizationSection from '@/components/audit/results/components/AuditOptimizationSection';
import AuditTabs from '@/components/audit/AuditTabs';
import AuditRecommendations from '@/components/audit/AuditRecommendations';
import AuditShareResults from '@/components/audit/share/AuditShareResults';
import AuditComments from '@/components/audit/comments/AuditComments';
import AuditHistory from '@/components/audit/AuditHistory';
import AuditDataVisualizer from '@/components/audit/data-visualization/AuditDataVisualizer';
import AuditComparison from '@/components/audit/comparison/AuditComparison';
import GrowthVisualization from '@/components/audit/data-visualization/GrowthVisualization';
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

/**
 * Unified AuditContent component that handles different display variants
 */
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
  downloadOptimizedSite = () => {},
  optimizeSiteContent = () => {},
  setContentOptimizationPrompt = () => {},
  
  // Display variant
  variant = 'full',
  urls,
}) => {
  // If minimal version is requested, show simplified version
  if (variant === 'minimal' && auditData) {
    return renderMinimalVersion();
  }

  // Full version starts with status display
  return (
    <>
      {/* Status component (loading, scanning, error) */}
      {variant === 'full' && (
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
      )}
      
      {/* Display results after audit completion */}
      {!isLoading && !isScanning && !auditError && auditData && recommendations && variant === 'full' && (
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
            onDownloadSitemap={onDownloadSitemap}
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
  
  // Helper function for rendering the minimal version
  function renderMinimalVersion() {
    if (!auditData) return null;
    
    const renderWithAnimation = (component: React.ReactNode, delay: number) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {component}
      </motion.div>
    );

    const showGrowthVisualization = auditData.previousScore !== undefined || 
      (historyData && historyData.items?.length > 1);

    // Sample data for growth visualization (would typically come from props)
    const growthData = {
      overview: [
        { category: 'Общий балл', before: auditData.previousScore || 65, after: auditData.score },
        { category: 'SEO', before: auditData.details?.seo?.previousScore || 60, after: auditData.details?.seo?.score },
        { category: 'Производительность', before: auditData.details?.performance?.previousScore || 55, after: auditData.details?.performance?.score },
        { category: 'Контент', before: auditData.details?.content?.previousScore || 70, after: auditData.details?.content?.score },
        { category: 'Технические аспекты', before: auditData.details?.technical?.previousScore || 45, after: auditData.details?.technical?.score },
      ],
      seo: [
        { category: 'Meta-теги', before: 55, after: 85 },
        { category: 'Ключевые слова', before: 60, after: 80 },
        { category: 'Структура URL', before: 70, after: 90 },
        { category: 'Внутренние ссылки', before: 50, after: 75 },
        { category: 'Внешние ссылки', before: 65, after: 85 },
      ],
      performance: [
        { category: 'Время загрузки', before: 45, after: 75 },
        { category: 'Размер страницы', before: 50, after: 80 },
        { category: 'Кеширование', before: 60, after: 90 },
        { category: 'Мобильная оптимизация', before: 55, after: 85 },
        { category: 'Core Web Vitals', before: 40, after: 70 },
      ]
    };

    return (
      <>
        {historyData && historyData.items?.length > 1 && 
          renderWithAnimation(
            <AuditHistory 
              historyItems={historyData.items} 
              onSelectAudit={handleSelectHistoricalAudit}
            />, 
            0.1
          )
        }
        
        {renderWithAnimation(
          <AuditDataVisualizer auditData={auditData.details} />, 
          0.15
        )}
        
        {showGrowthVisualization && 
          renderWithAnimation(
            <GrowthVisualization beforeAfterData={growthData} />,
            0.2
          )
        }
        
        {historyData && historyData.items?.length > 1 && 
          renderWithAnimation(
            <AuditComparison 
              currentAudit={auditData} 
              historyItems={historyData.items} 
            />, 
            0.25
          )
        }
        
        {renderWithAnimation(
          <AuditTabs details={auditData.details} />, 
          0.3
        )}
        
        {recommendations && renderWithAnimation(
          <AuditRecommendations recommendations={recommendations} />, 
          0.35
        )}
        
        {renderWithAnimation(
          <AuditComments auditId={auditData.id} />, 
          0.4
        )}
        
        {renderWithAnimation(
          <AuditShareResults 
            auditId={auditData.id} 
            auditData={auditData}
            url={url}
            historyItems={historyData?.items}
            urls={urls}
            taskId={taskId}
          />, 
          0.45
        )}
      </>
    );
  }

  const safeOptimizeSiteContent = async () => {
    if (optimizeSiteContent) {
      return optimizeSiteContent();
    }
    return Promise.resolve();
  };

  const safeDownloadOptimizedSite = async () => {
    if (downloadOptimizedSite) {
      return downloadOptimizedSite();
    }
    return Promise.resolve();
  };
};

export default AuditContent;
