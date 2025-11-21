import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useScan } from './use-scan';
import { seoApiService, ApiOptimizationResult } from '@/services/api/seoApiService';
import { reportingService } from '@/services/reporting/reportingService';
import { validationService } from '@/services/validation/validationService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing website audit functionality
 */
export const useAudit = (initialUrl?: string) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [auditData, setAuditData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizationCost, setOptimizationCost] = useState(0);
  const [optimizationItems, setOptimizationItems] = useState<any[]>([]);
  const [contentPrompt, setContentPrompt] = useState('');
  
  const { toast } = useToast();
  
  // Initialize scanning functionality
  const {
    isScanning,
    scanDetails,
    sitemap,
    taskId,
    startScan,
    cancelScan,
    downloadSitemap
  } = useScan(url, (pageCount) => {
    // Update loading progress based on page count
    const progress = Math.min(Math.floor((pageCount / 500) * 100), 99);
    setLoadingProgress(progress);
  });

  // Update URL
  const updateUrl = useCallback((newUrl: string) => {
    if (newUrl !== url) {
      setUrl(newUrl);
      // Reset audit data when URL changes
      setAuditData(null);
      setRecommendations(null);
      setError(null);
      setIsOptimized(false);
    }
  }, [url]);

  // Load audit data
  const loadAuditData = useCallback(async (refresh: boolean = false, deepScan: boolean = false) => {
    if (!url) {
      setError('URL не указан');
      return;
    }

    if (!validationService.validateUrl(url)) {
      setError('Неверный формат URL');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingProgress(0);
      setIsRefreshing(refresh);
      setError(null);
      
      // Start scan process if needed
      if (!taskId || refresh || deepScan) {
        const scanTaskId = await startScan(true);
        
        if (!scanTaskId) {
          throw new Error('Не удалось запустить сканирование');
        }
        
        // Wait for scanning to complete
        while (isScanning) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Get audit info based on scan results
        const auditInfo = await seoApiService.getAuditInfo(scanTaskId);
        
        if (auditInfo) {
          // Generate mock audit data for now
          // In a real app, this would use the actual scan results
          const mockAuditData = {
            id: scanTaskId,
            url: url,
            domain: validationService.extractDomain(url),
            score: Math.floor(Math.random() * 30) + 70,
            pageCount: auditInfo.pageCount || scanDetails.pages_scanned,
            scanTime: new Date().toISOString(),
            issues: {
              critical: Array(Math.floor(Math.random() * 3)).fill(null).map(() => ({
                title: 'Критическая ошибка',
                description: 'Описание критической ошибки',
                impact: 'high'
              })),
              important: Array(Math.floor(Math.random() * 5)).fill(null).map(() => ({
                title: 'Важная ошибка',
                description: 'Описание важной ошибки',
                impact: 'medium'
              })),
              opportunities: Array(Math.floor(Math.random() * 7)).fill(null).map(() => ({
                title: 'Возможность для улучшения',
                description: 'Описание возможности',
                impact: 'low'
              })),
              minor: [],
              passed: Array(Math.floor(Math.random() * 10) + 5).fill(null).map(() => ({
                title: 'Успешная проверка',
                description: 'Описание успешной проверки'
              }))
            }
          };
          
          setAuditData(mockAuditData);
          
          // Generate recommendations based on audit data
          const mockRecommendations = {
            critical: mockAuditData.issues.critical,
            important: mockAuditData.issues.important,
            opportunities: mockAuditData.issues.opportunities
          };
          
          setRecommendations(mockRecommendations);
          
          // Add to history data
          setHistoryData(prev => [
            {
              id: scanTaskId,
              url: url,
              score: mockAuditData.score,
              date: new Date().toISOString(),
              pageCount: auditInfo.pageCount || scanDetails.pages_scanned
            },
            ...prev.slice(0, 9) // Keep only last 10 audits
          ]);
          
          // Generate optimization cost based on page count
          const pageCount = auditInfo.pageCount || scanDetails.pages_scanned;
          const baseCost = 2500;
          const costPerPage = 10;
          const calculatedCost = Math.floor(baseCost + (pageCount * costPerPage));
          setOptimizationCost(calculatedCost);
          
          // Generate optimization items
          setOptimizationItems([
            { id: 1, title: 'Базовая оптимизация SEO', price: baseCost, included: true },
            { id: 2, title: `Оптимизация ${pageCount} страниц`, price: pageCount * costPerPage, included: true },
            { id: 3, title: 'Оптимизация скорости загрузки', price: 5000, included: false },
            { id: 4, title: 'Техническое SEO', price: 7500, included: false },
            { id: 5, title: 'Оптимизация мобильной версии', price: 3500, included: false }
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading audit data:', error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке данных аудита');
      
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные аудита",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [url, taskId, isScanning, scanDetails, startScan, toast]);

  // Generate PDF report - check if ready in Storage
  const generatePdfReportFile = useCallback(async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Нет ID задачи для скачивания отчета",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Проверка отчета",
        description: "Пожалуйста, подождите...",
      });
      
      // Проверяем готовность PDF в таблице pdf_reports
      const { data: pdfReport, error: checkError } = await supabase
        .from('pdf_reports')
        .select('file_path, created_at')
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking PDF report:', checkError);
        throw new Error('Не удалось проверить статус отчета');
      }
      
      if (!pdfReport?.file_path) {
        toast({
          title: "Отчет генерируется",
          description: "PDF отчет еще не готов. Попробуйте через несколько секунд.",
        });
        return;
      }
      
      // Скачиваем PDF из Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pdf-reports')
        .download(pdfReport.file_path);
      
      if (downloadError || !fileData) {
        console.error('Error downloading PDF:', downloadError);
        throw new Error('Не удалось скачать PDF отчет');
      }
      
      // Создаем blob и скачиваем файл
      const blob = new Blob([fileData], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-audit-${validationService.extractDomain(url)}-${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      // Инкрементируем счетчик скачиваний
      await supabase.rpc('increment_pdf_download_count', { 
        report_task_id: taskId 
      });
      
      toast({
        title: "Готово",
        description: "PDF отчет успешно скачан",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось скачать отчет",
        variant: "destructive",
      });
    }
  }, [taskId, url, toast]);

  // Export JSON data
  const exportJSONData = useCallback(async () => {
    if (!auditData) {
      toast({
        title: "Ошибка",
        description: "Нет данных для экспорта",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await reportingService.exportJsonReport(auditData, validationService.extractDomain(url));
      
      toast({
        title: "Готово",
        description: "Данные успешно экспортированы в JSON",
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось экспортировать данные",
        variant: "destructive",
      });
    }
  }, [auditData, url, toast]);

  // Download optimized site
  const downloadOptimizedSite = useCallback(async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Нет задания для скачивания",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Подготовка",
        description: "Подготовка оптимизированной версии сайта...",
      });
      
      const response = await seoApiService.downloadOptimizedSite(taskId);
      
      // Type guard to ensure response is a Blob
      if (!(response instanceof Blob)) {
        throw new Error('Invalid response format');
      }
      
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `optimized-site-${validationService.extractDomain(url)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Готово",
        description: "Оптимизированная версия сайта скачана",
      });
    } catch (error) {
      console.error('Error downloading optimized site:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось скачать оптимизированную версию сайта",
        variant: "destructive",
      });
    }
  }, [taskId, url, toast]);

  // Optimize site content
  const optimizeSiteContent = useCallback(async () => {
    if (!taskId) {
      toast({
        title: "Ошибка",
        description: "Нет задания для оптимизации",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Оптимизация",
        description: "Запуск процесса оптимизации...",
      });
      
      const result = await seoApiService.optimizeSiteContent(taskId, contentPrompt);
      
      // Type guard to ensure result is of OptimizationResult type
      if (typeof result === 'object' && result !== null && 'success' in result) {
        const typedResult = result as ApiOptimizationResult;
        
        if (typedResult.success) {
          setIsOptimized(true);
          
          toast({
            title: "Готово",
            description: typedResult.message || "Контент успешно оптимизирован",
          });
        } else {
          throw new Error(typedResult.message || "Не удалось оптимизировать контент");
        }
      } else {
        throw new Error("Неверный формат ответа");
      }
    } catch (error) {
      console.error('Error optimizing content:', error);
      
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось оптимизировать контент",
        variant: "destructive",
      });
    }
  }, [taskId, contentPrompt, toast]);

  return {
    url,
    auditData,
    recommendations,
    isLoading,
    loadingProgress,
    error,
    historyData,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats: null,
    sitemap,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    updateUrl,
    loadAuditData,
    downloadSitemap,
    downloadOptimizedSite,
    generatePdfReportFile,
    exportJSONData,
    optimizeSiteContent,
    setContentOptimizationPrompt: setContentPrompt,
    cancelScan
  };
};
