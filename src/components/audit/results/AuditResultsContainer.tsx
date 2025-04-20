import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditData } from './hooks/useAuditData';
import { usePageAnalysis } from '@/hooks/use-page-analysis';
import AuditHeader from './components/AuditHeader';
import AuditStatus from './components/AuditStatus';
import AuditMain from './components/AuditMain';
import AuditPageInfo from './components/AuditPageInfo';
import AuditOptimization from './components/AuditOptimization';
import PageAnalysisTable from './components/PageAnalysisTable';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuditRecommendations from '@/components/audit/AuditRecommendations';
import IssuesSummary from '@/components/audit/summary/IssuesSummary';
import AuditIssuesAndEstimate from '@/components/audit/AuditIssuesAndEstimate';

/**
 * Основной контейнер для отображения результатов SEO аудита
 * 
 * Компонент управляет загрузкой, отображением и обработкой данных аудита.
 * Обрабатывает состояния загрузки, ошибок и таймаутов.
 * 
 * @param {string} url - URL сайта для аудита
 */
interface AuditResultsContainerProps {
  url: string;
}

const AuditResultsContainer: React.FC<AuditResultsContainerProps> = ({ url }) => {
  // Состояния для отображения и управления UI
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [timeout, setTimeoutStatus] = useState(false);
  const { toast } = useToast();
  
  // Рефы для отслеживания инициализации и таймаутов
  const initRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Получение данных аудита через хук
  const {
    isLoading: isAuditLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error: auditError,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    loadAuditData,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt
  } = useAuditData(url);

  // Установка таймаута для предотвращения бесконечной загрузки
  useEffect(() => {
    if (url && !timeout && isInitialized) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Установка 3-минутного таймаута для загрузки данных
      timeoutRef.current = setTimeout(() => {
        console.log("Audit data loading timeout triggered after 3 minutes");
        setTimeoutStatus(true);
        setIsLoading(false);
        setHadError(true);
        
        toast({
          title: "Превышено время ожидания",
          description: "Загрузка данных аудита заняла слишком много времени. Пожалуйста, попробуйте снова или используйте другой URL.",
          variant: "destructive",
        });
      }, 180000) as unknown as NodeJS.Timeout;
    }
    
    // Очистка таймаута при размонтировании компонента
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, timeout, isInitialized, toast]);

  // Синхронизация состояния загрузки
  useEffect(() => {
    setIsLoading(isAuditLoading);
  }, [isAuditLoading]);

  // Инициализация аудита при монтировании компонента
  const initializeAudit = useCallback(() => {
    if (initRef.current) return;
    
    console.log("Initializing audit for URL:", url);
    try {
      initRef.current = true;
      setIsLoading(true);
      
      // Загрузка данных аудита
      loadAuditData(false).then(() => {
        setIsLoading(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }).catch(err => {
        console.error("Error loading audit data:", err);
        setHadError(true);
        setIsLoading(false);
        toast({
          title: "Ошибка загрузки аудита",
          description: "Произошла ошибка при загрузке данных аудита",
          variant: "destructive"
        });
      });
    } catch (err) {
      console.error("Exception during audit initialization:", err);
      setHadError(true);
      setIsLoading(false);
    }
    setIsInitialized(true);
  }, [url, loadAuditData, toast]);

  // Запуск инициализации при монтировании компонента с URL
  useEffect(() => {
    if (!isInitialized && url) {
      initializeAudit();
    }
    
    // Очистка при размонтировании
    return () => {
      console.log("AuditResultsContainer unmounted");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, isInitialized, initializeAudit]);

  // Обработчик обновления количества страниц
  const handleUpdatePageCount = (pageCount: number) => {
    if (auditData) {
      auditData.pageCount = pageCount;
    }
  };

  // Обработчик выбора исторического аудита
  const handleSelectHistoricalAudit = (auditId: string) => {
    console.log("Selected historical audit:", auditId);
  };

  // Переключение отображения поля для промпта оптимизации
  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };

  // Получение данных анализа страниц
  const { data: pageAnalysisData, isLoading: isLoadingAnalysis } = usePageAnalysis(
    auditData?.id
  );
  
  // Обработчик повторной попытки при ошибке
  const handleRetry = () => {
    initRef.current = false;
    setIsInitialized(false);
    setHadError(false);
    setTimeoutStatus(false);
  };

  // Отображение сообщения об ошибке или таймауте
  if (hadError || timeout) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500 mb-4">
          {timeout 
            ? "Время ожидания истекло. Возможно, сайт слишком большой или недоступен." 
            : "Произошла ошибка при загрузке аудита"
          }
        </p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // Отображение индикатора загрузки
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Основной рендеринг результатов аудита
  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Компонент статуса аудита (загрузка, сканирование, ошибка) */}
        <AuditStatus 
          isLoading={isAuditLoading}
          loadingProgress={loadingProgress}
          isScanning={isScanning}
          isRefreshing={isRefreshing}
          error={auditError}
          scanDetails={scanDetails}
          url={url}
          onRetry={() => loadAuditData(false)}
          onDownloadSitemap={sitemap ? downloadSitemap : undefined}
        />
        
        {/* Отображение результатов после завершения аудита */}
        {!isAuditLoading && !isScanning && !auditError && auditData && recommendations && (
          <>
            {/* Заголовок аудита с кнопками действий */}
            <AuditHeader 
              onRefresh={() => loadAuditData(true)}
              onDeepScan={() => loadAuditData(false)}
              isRefreshing={isRefreshing}
              onDownloadSitemap={sitemap ? downloadSitemap : undefined}
              onTogglePrompt={() => setShowPrompt(!showPrompt)}
              onExportJSON={exportJSONData}
              showPrompt={showPrompt}
            />
            
            <div className="space-y-6">
              {/* Основные результаты аудита */}
              <AuditMain 
                url={url}
                auditData={auditData}
                recommendations={recommendations}
                historyData={historyData}
                taskId={taskId || ""}
                onSelectAudit={handleSelectHistoricalAudit}
              />
              
              {/* Секция со сводкой найденных проблем */}
              {auditData.issues && (
                <div className="neo-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Сводка проблем</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IssuesSummary 
                      issues={{
                        critical: auditData.issues.critical.length,
                        important: auditData.issues.important.length,
                        opportunities: auditData.issues.opportunities.length
                      }} 
                    />
                    
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Оценка сайта</h3>
                      <p className="text-sm mb-2">Общий SEO-скор вашего сайта: <strong>{auditData.score}/100</strong></p>
                      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div 
                          className={`h-4 rounded-full ${auditData.score >= 70 ? 'bg-green-500' : auditData.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${auditData.score}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {auditData.score >= 70 
                          ? 'Хороший результат! Ваш сайт соответствует большинству рекомендаций SEO.' 
                          : auditData.score >= 50 
                            ? 'Средний результат. Есть пространство для улучшений.' 
                            : 'Требуется значительная оптимизация для улучшения SEO показателей.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Новы�� блок: Детализация ошибок и сметы */}
              <AuditIssuesAndEstimate 
                auditData={auditData} 
                optimizationCost={optimizationCost} 
                optimizationItems={optimizationItems} 
              />

              {/* Подробные рекомендации по категориям */}
              {recommendations && (
                <AuditRecommendations recommendations={recommendations} />
              )}
              
              {/* Таблица анализа страниц */}
              <div className="neo-card p-6">
                <h2 className="text-xl font-semibold mb-4">Анализ страниц</h2>
                <PageAnalysisTable 
                  data={pageAnalysisData}
                  isLoading={isLoadingAnalysis}
                />
              </div>
              
              {/* Модуль оптимизации с расчетом стоимости */}
              <AuditOptimization 
                optimizationCost={optimizationCost}
                optimizationItems={optimizationItems}
                isOptimized={isOptimized}
                contentPrompt={contentPrompt}
                url={url}
                pageCount={auditData.pageCount || 0}
                showPrompt={showPrompt}
                onTogglePrompt={toggleContentPrompt}
                onOptimize={optimizeSiteContent}
                onDownloadOptimizedSite={downloadOptimizedSite}
                onGeneratePdfReport={generatePdfReportFile}
                setContentOptimizationPrompt={setContentOptimizationPrompt}
              />
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
