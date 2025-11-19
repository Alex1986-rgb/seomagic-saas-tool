
import { useEffect } from 'react';
import { useAuditContext } from '@/contexts/AuditContext';
import { useScanContext } from '@/contexts/ScanContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOptimizationContext } from '@/contexts/OptimizationContext';

/**
 * Base hook that provides shared audit data for other hooks
 */
export const useAuditBase = (url: string) => {
  const {
    auditData,
    recommendations,
    historyData,
    error,
    isLoading,
    loadingProgress,
    isRefreshing,
    auditResults,
    taskMetrics,
    pageAnalysis,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    setContentOptimizationPrompt,
    loadAuditData,
    generatePdfReportFile
  } = useAuditContext();
  
  const {
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    taskId,
    downloadSitemap: downloadSitemapLocal
  } = useScanContext();

  const {
    loadOptimizationCost
  } = useOptimizationContext();

  // Poll for task status and optimization items
  useEffect(() => {
    if (!taskId) return;

    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('audit_tasks')
          .select('status, error_message, pages_scanned, total_urls')
          .eq('id', taskId)
          .single();

        if (error) {
          console.error('[POLLING] Error fetching task status:', error);
          return;
        }

        console.log('[POLLING] Task status:', data);

        // If completed, check if results exist
        if (data.status === 'completed') {
          const { data: results } = await supabase
            .from('audit_results')
            .select('id')
            .eq('task_id', taskId)
            .single();

          if (!results) {
            console.warn('[POLLING] Task completed but no results found - likely scoring error');
            toast({
              title: 'Частичные результаты',
              description: 'Аудит завершен, но расчет сметы не удался. Попробуйте обновить страницу.',
            });
          } else {
            // Results exist, request optimization cost if not loaded
            if (optimizationItems.length === 0) {
              console.log('[POLLING] Requesting optimization cost calculation...');
              loadOptimizationCost(taskId);
            }
            clearInterval(pollInterval);
          }
        }

        // If failed, show error
        if (data.status === 'failed') {
          toast({
            title: 'Ошибка аудита',
            description: data.error_message || 'Произошла ошибка при выполнении аудита',
            variant: 'destructive'
          });
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('[POLLING] Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [taskId, optimizationItems.length, loadOptimizationCost]);

  return {
    // State
    isLoading,
    loadingProgress,
    auditData,
    recommendations,
    historyData,
    error,
    isRefreshing,
    isScanning,
    scanDetails,
    pageStats,
    sitemap,
    auditResults,
    taskMetrics,
    pageAnalysis,
    optimizationCost,
    optimizationItems,
    isOptimized,
    contentPrompt,
    taskId,
    
    // Actions
    loadAuditData,
    setIsRefreshing: (value: boolean) => {}, // This would be implemented in the context
    downloadSitemapLocal,
    generatePdfReportFile,
    setContentOptimizationPrompt
  };
};
