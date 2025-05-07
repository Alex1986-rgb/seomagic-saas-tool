
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuditData } from './hooks/useAuditData';
import AuditStatus from './components/AuditStatus';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuditResultHeader from './components/AuditResultHeader';
import AuditRecommendationsSection from './components/AuditRecommendationsSection';
import AuditPageAnalysisSection from './components/AuditPageAnalysisSection';
import AuditOptimizationSection from './components/AuditOptimizationSection';
import { AuditHistoryData } from '@/types/audit';

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

  // Ensure historyData has the correct type
  const typedHistoryData: AuditHistoryData = historyData && typeof historyData === 'object' ? 
    { 
      url: url, 
      items: Array.isArray(historyData) ? historyData : [] 
    } : 
    { url: url, items: [] };

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

  // Обработчик выбора исторического аудита
  const handleSelectHistoricalAudit = (auditId: string) => {
    console.log("Selected historical audit:", auditId);
  };

  // Переключение отображения поля для промпта оптимизации
  const toggleContentPrompt = () => {
    setShowPrompt(!showPrompt);
  };
  
  // Обработчик повторной попытки при ошибке
  const handleRetry = () => {
    console.log("Retrying audit...");
    initRef.current = false;
    setIsInitialized(false);
    setHadError(false);
    setTimeoutStatus(false);
    setTimeout(() => {
      initializeAudit();
    }, 100);
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
            {/* Заголовок и основные данные аудита */}
            <AuditResultHeader 
              url={url}
              auditData={auditData}
              recommendations={recommendations}
              historyData={typedHistoryData}
              taskId={taskId || ""}
              onRefresh={() => loadAuditData(true)}
              onDeepScan={() => loadAuditData(false, true)}
              isRefreshing={isRefreshing}
              onDownloadSitemap={sitemap ? downloadSitemap : undefined}
              onTogglePrompt={() => setShowPrompt(!showPrompt)}
              onExportJSON={exportJSONData}
              onSelectAudit={handleSelectHistoricalAudit}
              showPrompt={showPrompt}
            />
            
            {/* Секция рекомендаций и ошибок */}
            <AuditRecommendationsSection 
              recommendations={recommendations}
              auditData={auditData}
              optimizationCost={optimizationCost}
              optimizationItems={optimizationItems}
            />
            
            {/* Секция анализа страниц */}
            <AuditPageAnalysisSection auditId={auditData.id} />
            
            {/* Модуль оптимизации */}
            <AuditOptimizationSection 
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
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AuditResultsContainer;
