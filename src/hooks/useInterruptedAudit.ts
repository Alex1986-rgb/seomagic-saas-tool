import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InterruptedAudit {
  taskId: string;
  auditId: string;
  url: string;
  status: string;
  progress: number;
  pagesScanned: number;
  totalPages: number;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useInterruptedAudit(url: string) {
  const [interruptedAudit, setInterruptedAudit] = useState<InterruptedAudit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResuming, setIsResuming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for interrupted audits for this URL
  const checkForInterruptedAudit = useCallback(async () => {
    if (!url) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Normalize URL for comparison
      const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Look for failed/stuck tasks for this URL
      const { data: tasks, error: queryError } = await supabase
        .from('audit_tasks')
        .select('*')
        .or(`url.ilike.%${normalizedUrl}%`)
        .in('status', ['failed', 'error', 'cancelled'])
        .order('updated_at', { ascending: false })
        .limit(1);

      if (queryError) {
        console.error('[useInterruptedAudit] Query error:', queryError);
        setError(queryError.message);
        return;
      }

      if (tasks && tasks.length > 0) {
        const task = tasks[0];
        
        // Check if there's meaningful progress to resume
        const hasProgress = (task.pages_scanned || 0) > 0;
        
        // Only show if there's progress to save
        if (hasProgress) {
          setInterruptedAudit({
            taskId: task.id,
            auditId: task.audit_id || '',
            url: task.url,
            status: task.status,
            progress: task.progress || 0,
            pagesScanned: task.pages_scanned || 0,
            totalPages: task.estimated_pages || task.total_urls || 0,
            errorMessage: task.error_message,
            createdAt: task.created_at,
            updatedAt: task.updated_at
          });
        } else {
          setInterruptedAudit(null);
        }
      } else {
        setInterruptedAudit(null);
      }
    } catch (err: any) {
      console.error('[useInterruptedAudit] Error:', err);
      setError(err.message || 'Failed to check for interrupted audits');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  // Resume the interrupted audit
  const resumeAudit = useCallback(async () => {
    if (!interruptedAudit) return null;

    try {
      setIsResuming(true);
      setError(null);

      console.log('[useInterruptedAudit] Resuming audit:', interruptedAudit.taskId);

      const { data, error: invokeError } = await supabase.functions.invoke('audit-resume', {
        body: { task_id: interruptedAudit.taskId }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to resume audit');
      }

      if (!data?.success) {
        throw new Error(data?.message || 'Resume failed');
      }

      console.log('[useInterruptedAudit] ✅ Audit resumed:', data);
      
      // Clear the interrupted audit state
      setInterruptedAudit(null);
      
      return interruptedAudit.taskId;
    } catch (err: any) {
      console.error('[useInterruptedAudit] Resume error:', err);
      setError(err.message || 'Failed to resume audit');
      return null;
    } finally {
      setIsResuming(false);
    }
  }, [interruptedAudit]);

  // Dismiss/clear the interrupted audit (user chose to start fresh)
  const dismissInterruptedAudit = useCallback(() => {
    setInterruptedAudit(null);
  }, []);

  // Check on mount and when URL changes
  useEffect(() => {
    checkForInterruptedAudit();
  }, [checkForInterruptedAudit]);

  return {
    interruptedAudit,
    isLoading,
    isResuming,
    error,
    resumeAudit,
    dismissInterruptedAudit,
    refresh: checkForInterruptedAudit
  };
}
