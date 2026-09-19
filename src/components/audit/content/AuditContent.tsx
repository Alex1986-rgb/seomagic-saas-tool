import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuditStatus from '@/components/audit/results/components/AuditStatus';
import AuditResultHeader from '@/components/audit/results/components/AuditResultHeader';
import AuditReportActions from '@/components/audit/results/components/AuditReportActions';
import FloatingReportButton from '@/components/audit/results/components/FloatingReportButton';
import AuditRecommendationsSection from '@/components/audit/results/components/AuditRecommendationsSection';
import AuditPageAnalysisSection from '@/components/audit/results/components/AuditPageAnalysisSection';
import InteractiveOptimizationPanel from '@/components/audit/results/components/optimization/InteractiveOptimizationPanel';
import AuditTabs from '@/components/audit/AuditTabs';
import AuditRecommendations from '@/components/audit/AuditRecommendations';
import AuditShareResults from '@/components/audit/share/AuditShareResults';
import AuditHistory from '@/components/audit/AuditHistory';
import AuditDataVisualizer from '@/components/audit/data-visualization/AuditDataVisualizer';
import AuditComparison from '@/components/audit/comparison/AuditComparison';
import GrowthVisualization from '@/components/audit/data-visualization/GrowthVisualization';
import { AuditData, RecommendationData, AuditHistoryData } from '@/types/audit';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useScanContext } from '@/contexts/ScanContext';
import { auditService } from '@/modules/audit/services/auditService';
import { auditPagePath } from '@/modules/audit/utils/auditLinks';

/**
 * Сколько страниц обходить при «глубоком сканировании» с экрана результатов —
 * то же значение, что audit-start берёт для глубокого аудита по умолчанию.
 */
const DEEP_SCAN_PAGES = 100;

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
  /** Открыть аудит из истории. Не передан — открываем его задачу сами. */
  handleSelectHistoricalAudit?: (auditId: string) => void;
  exportJSONData?: () => void;
  generatePdfReportFile?: () => void;
  /**
   * Скачать исправленную копию сайта. Без обработчика кнопки нет: сборка копии
   * на сервере пока не реализована.
   */
  downloadOptimizedSite?: () => Promise<void>;
  optimizeSiteContent?: () => Promise<void>;
  setContentOptimizationPrompt?: (prompt: string) => void;
  /** Посчитать смету по задаче аудита — без неё панель оптимизации пустая. */
  loadOptimizationCost?: (taskId: string) => Promise<void>;
  
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
  handleSelectHistoricalAudit,
  exportJSONData = () => {},
  generatePdfReportFile = () => {},
  downloadOptimizedSite,
  optimizeSiteContent = () => {},
  setContentOptimizationPrompt = () => {},
  loadOptimizationCost,
  
  // Display variant
  variant = 'full',
  urls,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { startScan } = useScanContext();

  /**
   * Выбор даты в «Истории аудита». Раньше по умолчанию стояла пустая функция:
   * кнопка ничего не открывала. В истории лежат записи `audits`, а страница
   * результатов открывает задачу — находим её и переходим.
   */
  const openHistoricalAudit = useCallback(async (auditId: string) => {
    const historicalTaskId = await auditService.getTaskIdForAudit(auditId);
    if (!historicalTaskId) {
      toast({
        title: 'Аудит не открывается',
        description: 'У этой записи не найдена задача с результатами.',
        variant: 'destructive',
      });
      return;
    }
    navigate(auditPagePath(url, historicalTaskId));
  }, [navigate, toast, url]);

  const selectHistoricalAudit = useCallback((auditId: string) => {
    if (handleSelectHistoricalAudit) {
      handleSelectHistoricalAudit(auditId);
      return;
    }
    void openHistoricalAudit(auditId);
  }, [handleSelectHistoricalAudit, openHistoricalAudit]);

  /**
   * «Запустить глубокое сканирование». Раньше здесь был `loadAuditData(false, true)`:
   * второй аргумент нигде не читался, перечитывались старые данные, а новый
   * обход не начинался. Теперь запускаем настоящую проверку; глубокий аудит,
   * как и на вкладке запуска, — только после входа.
   */
  const handleDeepScan = useCallback(async () => {
    if (!user.isLoggedIn) {
      navigate(`/auth?redirect=${encodeURIComponent(auditPagePath(url, taskId))}`);
      return;
    }
    await startScan(true, Math.max(DEEP_SCAN_PAGES, scanDetails?.estimated_pages || 0));
  }, [user.isLoggedIn, navigate, url, taskId, startScan, scanDetails?.estimated_pages]);

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
      
      {/*
        Результаты — как только есть данные аудита. Раньше требовались ещё и
        рекомендации, а их нет у сайта без замечаний: экран оставался пустым,
        хотя аудит завершён. Блок рекомендаций сам не рисуется, если их нет.
      */}
      {!isLoading && !isScanning && !auditError && auditData && variant === 'full' && (
        <>
          {/* Header and main audit data */}
          <AuditResultHeader 
            url={url}
            auditData={auditData}
            recommendations={recommendations}
            historyData={historyData}
            taskId={taskId || ""}
            onRefresh={() => loadAuditData(true)}
            onDeepScan={() => void handleDeepScan()}
            isRefreshing={isRefreshing}
            onDownloadSitemap={onDownloadSitemap}
            onTogglePrompt={onTogglePrompt}
            onExportJSON={exportJSONData}
            onSelectAudit={selectHistoricalAudit}
            showPrompt={showPrompt}
          />

          {/* Report actions panel */}
          <AuditReportActions
            url={url}
            onGeneratePdf={generatePdfReportFile}
            onExportJSON={exportJSONData}
            onViewEstimate={() => {
              const element = document.getElementById('optimization-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
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
          <div id="optimization-section">
            <InteractiveOptimizationPanel
              url={url}
              taskId={taskId || auditData.id}
              currentScore={auditData.score}
              optimizationCost={optimizationCost}
              optimizationItems={optimizationItems}
              pageCount={auditData.pageCount || 0}
              isOptimized={isOptimized}
              onCalculateCost={
                loadOptimizationCost && (taskId || auditData.id)
                  ? () => { void loadOptimizationCost(taskId || auditData.id); }
                  : undefined
              }
              onDownloadOptimizedSite={downloadOptimizedSite ? () => { void downloadOptimizedSite(); } : undefined}
              onGeneratePdfReport={generatePdfReportFile}
            />
          </div>

          {/* Floating PDF button */}
          <FloatingReportButton onGeneratePdf={generatePdfReportFile} />
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

    /**
     * Сравнение «было → стало».
     *
     * Здесь лежал заготовленный набор: разделы «SEO» и «Производительность»
     * были вписаны в код целиком (Meta-теги 55→85, Core Web Vitals 40→70) и
     * показывались любому сайту одинаково, а в общем разделе вместо
     * отсутствующей прошлой оценки подставлялись числа 65, 60, 55, 70 и 45 —
     * то есть «рост» рисовался даже там, где сравнивать было не с чем.
     *
     * Теперь сравнение строится только по настоящей прошлой оценке. Нет
     * второго аудита — блок не показывается.
     */
    const previousScore = auditData.previousScore;
    const showGrowthVisualization = previousScore !== undefined;

    const growthData = showGrowthVisualization
      ? {
          overview: [
            { category: 'Общий балл', before: previousScore as number, after: auditData.score },
            ...(['seo', 'content', 'performance', 'technical'] as const).flatMap((key) => {
              const section = auditData.details?.[key];
              const before = section?.previousScore;
              if (before === undefined || section?.score === undefined) return [];
              const titles: Record<typeof key, string> = {
                seo: 'SEO',
                content: 'Контент',
                performance: 'Производительность',
                technical: 'Технические аспекты',
              };
              return [{ category: titles[key], before, after: section.score }];
            }),
          ],
        }
      : null;

    return (
      <>
        {historyData && historyData.items?.length > 1 && 
          renderWithAnimation(
            <AuditHistory 
              historyItems={historyData.items} 
              onSelectAudit={selectHistoricalAudit}
            />, 
            0.1
          )
        }
        
        {renderWithAnimation(
          <AuditDataVisualizer auditData={auditData.details} url={url} />, 
          0.15
        )}
        
        {showGrowthVisualization && growthData && 
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
        
        {/*
          Здесь был блок «Комментарии к аудиту» с чужим комментарием «Иван
          Петров» и ответами «Комментарий добавлен к аудиту». Комментарии
          нигде не сохранялись и пропадали при обновлении страницы, таблицы для
          них в базе нет. Блок убран, пока не появится настоящее хранение.
        */}
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
};

export default AuditContent;
