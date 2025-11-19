import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditData } from '@/types/audit';

export const usePartialResults = (taskId: string | null) => {
  const [partialData, setPartialData] = useState<Partial<AuditData> | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setPartialData(null);
      setIsPartial(false);
      return;
    }

    const fetchPartialResults = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('audit_results')
          .select('*')
          .eq('task_id', taskId)
          .eq('is_partial', true)
          .maybeSingle();

        if (data && !error) {
          setPartialData(data.audit_data as Partial<AuditData>);
          setIsPartial(true);
          setCompletionPercentage(data.completion_percentage || 0);
        } else {
          setPartialData(null);
          setIsPartial(false);
        }
      } catch (error) {
        console.error('Error fetching partial results:', error);
        setPartialData(null);
        setIsPartial(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartialResults();

    // Subscribe to real-time updates for partial results
    const channel = supabase
      .channel(`partial-results:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_results',
          filter: `task_id=eq.${taskId}`,
        },
        (payload: any) => {
          if (payload.new && payload.new.is_partial) {
            setPartialData(payload.new.audit_data as Partial<AuditData>);
            setIsPartial(true);
            setCompletionPercentage(payload.new.completion_percentage || 0);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);

  return { partialData, isPartial, completionPercentage, isLoading };
};
