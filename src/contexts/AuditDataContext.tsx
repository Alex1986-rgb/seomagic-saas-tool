
import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validationService } from '@/services/validation/validationService';
import { issueRecommendation } from '@/lib/issue-labels';
import { normalizeAuditData, summarizeIssues } from '@/lib/audit-data';
import { isSameSite, normalizeHost } from '@/modules/audit/utils/auditLinks';

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
  
  // Замечания нужны и спискам рекомендаций, и переводу данных для экранов —
  // грузим один раз и переиспользуем.
  const { data: issueRows = [] } = useQuery({
    queryKey: ['auditIssues', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const { data, error } = await supabase
        .from('issues')
        .select('issue_type, severity')
        .eq('task_id', taskId);
      if (error) {
        console.error('Не удалось загрузить замечания аудита:', error);
        return [];
      }
      return data ?? [];
    },
    enabled: !!taskId,
    staleTime: 10_000,
    /**
     * Замечания дописывает отдельный классификатор уже после того, как обход
     * закончился. Одного запроса мало: он успевает вернуть пустой список, и
     * пользователь навсегда видит «проблем 0». Пока список пуст — переспрашиваем.
     */
    refetchInterval: (query) => ((query.state.data?.length ?? 0) > 0 ? false : 4000),
  });

  // Fetch audit results from Supabase by taskId
  const { 
    data: rawAuditData, 
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
      return (data?.audit_data ?? null) as never;
    },
    enabled: !!taskId,
    staleTime: 30000, // Cache for 30 seconds
  });
  
  /**
   * История проверок этого сайта — только свои.
   *
   * Раньше: `.eq('url', url)` без владельца. Политика чтения отдаёт гостевые
   * записи всем, поэтому в «Истории аудита» могли оказаться чужие проверки;
   * а адрес из строки браузера («shop.ru») не совпадал с сохранённым
   * («https://shop.ru»), и своя история чаще была пустой. Теперь сравниваем
   * хост целиком и берём записи текущего пользователя; у гостя истории нет.
   */
  const { 
    data: historyData = { url, items: [] } 
  } = useQuery({
    queryKey: ['auditHistory', url],
    queryFn: async () => {
      if (!url) return { url, items: [] };

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      const host = normalizeHost(url);
      if (!userId || !host) return { url, items: [] };
      
      const { data, error } = await supabase
        .from('audits')
        .select('id, created_at, seo_score, pages_scanned, status, url')
        .eq('user_id', userId)
        .ilike('url', `%${host}%`)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching audit history:', error);
        return { url, items: [] };
      }
      
      // Map database fields to AuditHistoryItem format
      const items = (data || []).filter(item => isSameSite(item.url, host)).slice(0, 10).map(item => ({
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
  const { data: auditResults = null } = useQuery({
    queryKey: ['auditResults', taskId],
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
    queryKey: ['pageAnalysis', auditResults?.audit_id],
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
  
  /**
   * Сервер отдаёт свою структуру (`scores`, `metrics`, `summary`), а экраны
   * написаны под другую (`score`, `details.seo.score`, `issues.critical`).
   * Переводим здесь, когда готовы обе части: сами данные и замечания. Раньше
   * перевод жил внутри запроса и успевал отработать до загрузки замечаний,
   * из-за чего число проблем оставалось нулевым.
   */
  const auditData = useMemo(
    () => normalizeAuditData(rawAuditData as never, {
      url,
      taskId,
      counts: summarizeIssues(issueRows),
    }),
    [rawAuditData, issueRows, url, taskId],
  );

  /**
   * Рекомендации собираются из замечаний аудита.
   *
   * Раньше здесь стояла заглушка `null`, а блок результатов рисовался только
   * при наличии рекомендаций — поэтому после завершения аудита пользователь
   * видел пустой экран. Теперь берём настоящие замечания и группируем их по
   * важности: одинаковые сводим в одну строку с числом затронутых страниц.
   */
  const { data: recommendations = null } = useQuery({
    queryKey: ['auditRecommendations', taskId, issueRows.length],
    queryFn: async (): Promise<RecommendationData | null> => {
      if (!taskId) return null;
      const data = issueRows;
      if (!data || data.length === 0) return null;

      const bySeverity: Record<string, Map<string, number>> = {
        critical: new Map(),
        important: new Map(),
        opportunities: new Map(),
      };

      for (const issue of data) {
        // Краулер размечает важность как high/medium/low, интерфейс говорит
        // «критичные / важные / возможности» — сводим одно к другому.
        const bucket = issue.severity === 'high' || issue.severity === 'critical'
          ? 'critical'
          : issue.severity === 'medium'
            ? 'important'
            : 'opportunities';
        const counts = bySeverity[bucket];
        counts.set(issue.issue_type, (counts.get(issue.issue_type) ?? 0) + 1);
      }

      const toList = (counts: Map<string, number>) =>
        [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([issueType, count]) => issueRecommendation(issueType, count));

      return {
        url,
        title: `Рекомендации по ${url}`,
        description: 'Составлены по замечаниям, найденным при обходе сайта',
        priority: bySeverity.critical.size > 0 ? 'high' : 'medium',
        category: 'seo',
        affectedAreas: [],
        estimatedEffort: '',
        potentialImpact: '',
        status: 'ready',
        details: '',
        resources: [],
        critical: toList(bySeverity.critical),
        important: toList(bySeverity.important),
        opportunities: toList(bySeverity.opportunities),
      };
    },
    enabled: !!taskId,
    staleTime: 30000,
  });
  
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
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    auditData: auditData || null,
    recommendations: recommendations || null,
    historyData: historyData || { url, items: [] },
    error: error ? String(error) : null,
    isLoading,
    loadingProgress,
    isRefreshing,
    loadAuditData,
    generatePdfReportFile,
    exportJSONData,
    auditResults: auditResults || null,
    taskMetrics: taskMetrics || null,
    pageAnalysis: pageAnalysis || []
  }), [
    auditData,
    recommendations,
    historyData,
    url,
    error,
    isLoading,
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
