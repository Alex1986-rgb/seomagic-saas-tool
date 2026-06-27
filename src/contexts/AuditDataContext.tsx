
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';
import { supabase, isDemoMode } from '@/integrations/supabase/client';
import { buildAuditData, buildRecommendations } from '@/integrations/supabase/demoData';
import { useToast } from '@/hooks/use-toast';
import { validationService } from '@/services/validation/validationService';

// Define the provider props
interface AuditDataProviderProps {
  children: ReactNode;
  url: string;
  taskId: string | null;
}

interface AuditDataContextType {
  auditData: AuditData | null;
  recommendations: RecommendationData | null;
  historyData: AuditHistoryData;
  error: string | null;
  isLoading: boolean;
  loadingProgress: number;
  isRefreshing: boolean;
  loadAuditData: (refresh?: boolean) => Promise<void>;
  generatePdfReportFile: () => Promise<void>;
  exportJSONData: () => Promise<void>;
  auditResults: any | null;
  taskMetrics: any | null;
  pageAnalysis: any[];
}

const AuditDataContext = createContext<AuditDataContextType>({
  auditData: null,
  recommendations: null,
  historyData: { url: '', items: [] },
  error: null,
  isLoading: false,
  loadingProgress: 0,
  isRefreshing: false,
  loadAuditData: async () => {},
  generatePdfReportFile: async () => {},
  exportJSONData: async () => {},
  auditResults: null,
  taskMetrics: null,
  pageAnalysis: []
});

export const AuditDataProvider: React.FC<AuditDataProviderProps> = ({ 
  children, 
  url,
  taskId 
}) => {
  const { toast } = useToast();
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  console.log('🔧 AuditDataProvider rendering with url:', url, 'taskId:', taskId);
  
  // Fetch audit results from Supabase by taskId
  const { 
    data: auditData, 
    error,
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['auditResults', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      
      console.log('📊 Loading audit results for task:', taskId);
      setLoadingProgress(10);
      
      const { data, error } = await supabase
        .from('audit_results')
        .select('audit_data')
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching audit results:', error);
        throw error;
      }
      
      setLoadingProgress(100);
      // Safely cast the Json type to AuditData
      return (data?.audit_data || null) as unknown as AuditData | null;
    },
    enabled: !!taskId,
    staleTime: 30000 // Cache for 30 seconds
  });
  
  // Fetch audit history for this URL
  const {
    data: historyData = { url, items: [] }
  } = useQuery({
    queryKey: ['auditHistory', 'ctx', url],
    queryFn: async () => {
      if (!url) return { url, items: [] };
      
      const { data, error } = await supabase
        .from('audits')
        .select('id, created_at, seo_score, pages_scanned, status, url')
        .eq('url', url)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching audit history:', error);
        return { url, items: [] };
      }
      
      // Map database fields to AuditHistoryItem format
      const items = (data || []).map(item => ({
        id: item.id,
        url: item.url,
        date: item.created_at,
        score: item.seo_score || 0
      }));
      
      return { 
        url, 
        items 
      };
    },
    enabled: !!url
  });
  
  // Fetch audit results with weighted metrics
  // (отдельный ключ, чтобы не конфликтовать с запросом audit_data выше)
  const { data: auditResults = null } = useQuery({
    queryKey: ['auditResultsFull', taskId],
    queryFn: async () => {
      if (!taskId) return null;

      const { data, error } = await supabase
        .from('audit_results')
        .select('*')
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching audit results:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!taskId
  });
  
  // Fetch task metrics
  const { data: taskMetrics = null } = useQuery({
    queryKey: ['taskMetrics', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      
      const { data, error } = await supabase
        .from('audit_tasks')
        .select('avg_load_time_ms, success_rate, redirect_pages_count, error_pages_count, pages_scanned, total_urls')
        .eq('id', taskId)
        .single();
      
      if (error) {
        console.error('Error fetching task metrics:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!taskId
  });
  
  // Fetch page analysis
  const { data: pageAnalysis = [] } = useQuery({
    queryKey: ['pageAnalysis', 'ctx', auditResults?.audit_id],
    queryFn: async () => {
      if (!auditResults?.audit_id) return [];
      
      const { data, error } = await supabase
        .from('page_analysis')
        .select('*')
        .eq('audit_id', auditResults.audit_id)
        .order('depth', { ascending: true })
        .limit(50);
      
      if (error) {
        console.error('Error fetching page analysis:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!auditResults?.audit_id
  });
  
  // В демо-режиме отдаём демонстрационные рекомендации (иначе блок результатов
  // в AuditContent гейтится по `recommendations` и не отображается).
  const recommendations: RecommendationData | null =
    isDemoMode && url ? (buildRecommendations(url) as unknown as RecommendationData) : null;
  
  const loadAuditData = useCallback(async (refresh: boolean = false) => {
    setIsRefreshing(refresh);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);
  
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
      
      // Скачиваем файл из Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pdf-reports')
        .download(pdfReport.file_path);
      
      if (downloadError || !fileData) {
        console.error('Error downloading report:', downloadError);
        throw new Error('Не удалось скачать отчет');
      }
      
      // Определяем тип файла по расширению
      const isHtml = pdfReport.file_path.endsWith('.html');
      const mimeType = isHtml ? 'text/html' : 'application/pdf';
      const extension = isHtml ? 'html' : 'pdf';
      
      // Создаем blob и скачиваем файл
      const blob = new Blob([fileData], { type: mimeType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `seo-audit-${validationService.extractDomain(url)}-${new Date().getTime()}.${extension}`;
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
      console.error('Error generating PDF report:', error);
      
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось скачать отчет",
        variant: "destructive",
      });
    }
  }, [taskId, url, toast]);
  
  const exportJSONData = useCallback(async () => {
    if (!auditData) return;
    
    const dataStr = JSON.stringify(auditData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-data-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("Exported JSON data");
  }, [auditData]);
  
  // В демо-режиме, если реальные данные ещё не подгружены, показываем
  // демонстрационный результат аудита для введённого URL, чтобы интерфейс
  // результатов был полностью рабочим без бэкенда.
  const effectiveAuditData = useMemo(() => {
    if (auditData) return auditData;
    if (isDemoMode && url) return buildAuditData(url) as unknown as AuditData;
    return null;
  }, [auditData, url]);

  const effectiveLoading = isDemoMode && !auditData ? false : isLoading;

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    auditData: effectiveAuditData,
    recommendations: recommendations || null,
    historyData: historyData || { url, items: [] },
    error: error ? String(error) : null,
    isLoading: effectiveLoading,
    loadingProgress,
    isRefreshing,
    loadAuditData,
    generatePdfReportFile,
    exportJSONData,
    auditResults: auditResults || null,
    taskMetrics: taskMetrics || null,
    pageAnalysis: pageAnalysis || []
  }), [
    effectiveAuditData,
    recommendations,
    historyData,
    url,
    error,
    effectiveLoading,
    loadingProgress,
    isRefreshing,
    loadAuditData,
    generatePdfReportFile,
    exportJSONData,
    auditResults,
    taskMetrics,
    pageAnalysis
  ]);
  
  return (
    <AuditDataContext.Provider value={contextValue}>
      {children}
    </AuditDataContext.Provider>
  );
};

export const useAuditDataContext = () => {
  const context = useContext(AuditDataContext);
  
  if (context === undefined) {
    throw new Error('useAuditDataContext must be used within an AuditDataProvider');
  }
  
  return context;
};
