import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface AuditMetrics {
  progress?: number;
  pagesScanned?: number;
  totalPages?: number;
  currentUrl?: string;
  stage?: string;
  status?: string;
  errors?: number;
  warnings?: number;
  passed?: number;
}

interface PageIssue {
  type: string;
  description: string;
  severity: 'error' | 'warning' | 'good';
  url: string;
  timestamp: Date;
}

export const useAuditRealtime = (taskId: string | null) => {
  const [metrics, setMetrics] = useState<AuditMetrics>({});
  const [recentIssues, setRecentIssues] = useState<PageIssue[]>([]);

  useEffect(() => {
    if (!taskId) return;

    let channel: RealtimeChannel;

    const setupRealtime = async () => {
      // Subscribe to audit_tasks changes
      channel = supabase
        .channel(`audit:${taskId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'audit_tasks',
            filter: `id=eq.${taskId}`,
          },
          (payload: any) => {
            console.log('Realtime audit_tasks update:', payload);
            
            if (payload.new) {
              setMetrics((prev) => ({
                ...prev,
                progress: payload.new.progress || prev.progress,
                pagesScanned: payload.new.pages_scanned || prev.pagesScanned,
                totalPages: payload.new.total_urls || prev.totalPages,
                currentUrl: payload.new.current_url || prev.currentUrl,
                stage: payload.new.stage || prev.stage,
                status: payload.new.status || prev.status,
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'page_analysis',
            filter: `task_id=eq.${taskId}`,
          },
          (payload: any) => {
            console.log('Realtime page_analysis insert:', payload);
            
            if (payload.new) {
              const newPage = payload.new;
              const issues: PageIssue[] = [];

              // Extract issues from the analyzed page
              if (!newPage.title) {
                issues.push({
                  type: 'missing_title',
                  description: 'Отсутствует заголовок страницы',
                  severity: 'error',
                  url: newPage.url,
                  timestamp: new Date(),
                });
              }

              if (!newPage.meta_description) {
                issues.push({
                  type: 'missing_description',
                  description: 'Отсутствует мета-описание',
                  severity: 'warning',
                  url: newPage.url,
                  timestamp: new Date(),
                });
              }

              if (newPage.h1_count === 0) {
                issues.push({
                  type: 'missing_h1',
                  description: 'Отсутствует H1 заголовок',
                  severity: 'error',
                  url: newPage.url,
                  timestamp: new Date(),
                });
              }

              if (newPage.has_thin_content) {
                issues.push({
                  type: 'thin_content',
                  description: 'Недостаточно контента на странице',
                  severity: 'warning',
                  url: newPage.url,
                  timestamp: new Date(),
                });
              }

              if (newPage.status_code >= 400) {
                issues.push({
                  type: 'http_error',
                  description: `Ошибка HTTP ${newPage.status_code}`,
                  severity: 'error',
                  url: newPage.url,
                  timestamp: new Date(),
                });
              }

              if (issues.length > 0) {
                setRecentIssues((prev) => [...issues, ...prev].slice(0, 50));
              }

              // Update metrics counters
              setMetrics((prev) => {
                const newErrors = issues.filter((i) => i.severity === 'error').length;
                const newWarnings = issues.filter((i) => i.severity === 'warning').length;
                
                return {
                  ...prev,
                  errors: (prev.errors || 0) + newErrors,
                  warnings: (prev.warnings || 0) + newWarnings,
                  passed: issues.length === 0 ? (prev.passed || 0) + 1 : prev.passed,
                };
              });
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [taskId]);

  return { metrics, recentIssues };
};
