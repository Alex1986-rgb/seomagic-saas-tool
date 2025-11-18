
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuditData, AuditHistoryData, RecommendationData } from '@/types/audit';
import { supabase } from '@/integrations/supabase/client';

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
  exportJSONData: async () => {}
});

export const AuditDataProvider: React.FC<AuditDataProviderProps> = ({ 
  children, 
  url,
  taskId 
}) => {
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
    queryKey: ['auditHistory', url],
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
  
  // Placeholder for recommendations (can be implemented later)
  const recommendations: RecommendationData | null = null;
  
  const loadAuditData = useCallback(async (refresh: boolean = false) => {
    setIsRefreshing(refresh);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);
  
  const generatePdfReportFile = useCallback(async () => {
    if (!auditData || !taskId) return;
    
    console.log("Generating PDF report for task:", taskId);
    // Implementation would call edge function or service
  }, [auditData, taskId]);
  
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
  
  return (
    <AuditDataContext.Provider value={{
      auditData: auditData || null,
      recommendations: recommendations || null,
      historyData: historyData || { url, items: [] },
      error: error ? String(error) : null,
      isLoading,
      loadingProgress,
      isRefreshing,
      loadAuditData,
      generatePdfReportFile,
      exportJSONData
    }}>
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
