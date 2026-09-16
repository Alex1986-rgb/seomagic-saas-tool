
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditContext } from '@/contexts/AuditContext';
import { useAuditDataContext } from '@/contexts/AuditDataContext';
import { useScanContext } from '@/contexts/ScanContext';
import { useOptimizationContext } from '@/contexts/OptimizationContext';
import { useAuditInitialization } from '../../hooks/useAuditInitialization';
import { usePromptToggle } from '../../hooks/usePromptToggle';
import AuditStateHandler from './components/AuditStateHandler';
import AuditContent from './AuditContent';
import { auditService } from '@/modules/audit/services/auditService';
import { auditPagePath } from '@/modules/audit/utils/auditLinks';
import { useToast } from '@/hooks/use-toast';

interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  // Get data from our contexts
  const { updateUrl } = useAuditContext();
  
  const {
    auditData,
    recommendations,
    historyData,
    error: auditError,
    isLoading: isAuditLoading,
    loadingProgress,
    isRefreshing,
    loadAuditData,
    generatePdfReportFile,
    exportJSONData
  } = useAuditDataContext();
  
  const {
    isScanning,
    scanDetails,
    taskId,
    sitemap,
    pageStats,
    downloadSitemap
  } = useScanContext();
  
  const {
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    setContentOptimizationPrompt,
    optimizeSiteContent,
    loadOptimizationCost
  } = useOptimizationContext();
  
  // Make sure URL is up to date
  React.useEffect(() => {
    if (url) {
      updateUrl(url);
    }
  }, [url, updateUrl]);
  
  // Content prompt state management
  const { showPrompt, togglePrompt } = usePromptToggle();
  
  // Initialization and timeout handling
  const {
    isLoading,
    hadError,
    timeout,
    handleRetry,
    setIsLoading
  } = useAuditInitialization(url, loadAuditData);

  // Sync loading state from audit data context
  React.useEffect(() => {
    setIsLoading(isAuditLoading);
  }, [isAuditLoading, setIsLoading]);

  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Выбор аудита в «Истории аудита». Раньше — только console.log. В истории
   * записи `audits`, а страница результатов открывает задачу: находим её.
   */
  const handleSelectHistoricalAudit = useCallback(async (auditId: string) => {
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

  // Ensure historyData has the correct type - memoize transformation
  const typedHistoryData = useMemo(() => 
    historyData && typeof historyData === 'object' ? 
    { 
      url: url, 
      items: Array.isArray(historyData.items) ? historyData.items : [] 
    } : 
    { url: url, items: [] }, 
  [historyData, url]);

  // Wrap optimizeSiteContent to match the expected function signature (no arguments)
  const handleOptimizeSiteContent = useCallback(() => {
    if (taskId) {
      return optimizeSiteContent(taskId, contentPrompt);
    }
    return Promise.resolve(null);
  }, [taskId, contentPrompt, optimizeSiteContent]);

  // «Скачать оптимизированный сайт» не передаём: обработчик из контекста только
  // ждал секунду и ничего не скачивал, а сборки исправленной копии сайта на
  // сервере нет. Без обработчика кнопка не показывается.
  //
  // loadOptimizationCost, наоборот, передаём: без него панель оптимизации
  // оставалась пустой и без кнопки «Рассчитать смету». Смету считает функция
  // optimization-calculate по замечаниям этого аудита (hooks/use-optimization-api.ts).

  return (
    <AuditStateHandler
      isLoading={isLoading}
      hadError={hadError}
      timeout={timeout}
      onRetry={handleRetry}
      url={url}
    >
      <AuditContent
        url={url}
        isLoading={isAuditLoading}
        loadingProgress={loadingProgress}
        isScanning={isScanning}
        isRefreshing={isRefreshing}
        auditError={auditError}
        scanDetails={scanDetails}
        auditData={auditData}
        recommendations={recommendations}
        historyData={typedHistoryData}
        optimizationCost={optimizationCost}
        optimizationItems={optimizationItems}
        isOptimized={isOptimized}
        contentPrompt={contentPrompt}
        taskId={taskId}
        showPrompt={showPrompt}
        onTogglePrompt={togglePrompt}
        onRetry={() => loadAuditData(false)}
        onDownloadSitemap={sitemap ? downloadSitemap : undefined}
        loadAuditData={loadAuditData}
        handleSelectHistoricalAudit={handleSelectHistoricalAudit}
        downloadSitemap={sitemap ? downloadSitemap : undefined}
        exportJSONData={exportJSONData}
        generatePdfReportFile={generatePdfReportFile}
        optimizeSiteContent={handleOptimizeSiteContent}
        setContentOptimizationPrompt={setContentOptimizationPrompt}
        loadOptimizationCost={loadOptimizationCost}
      />
    </AuditStateHandler>
  );
};

export default React.memo(AuditResultsContainer);
