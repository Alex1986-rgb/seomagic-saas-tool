import { useState, useEffect, useCallback } from 'react';
import { auditService } from '../services/auditService';
import type { AuditStatusResponse } from '../types';

interface UseAuditStatusOptions {
  taskId: string | null;
  onComplete?: (data: AuditStatusResponse) => void;
  onError?: (error: string) => void;
  pollingInterval?: number;
}

export const useAuditStatus = ({
  taskId,
  onComplete,
  onError,
  pollingInterval = 2000
}: UseAuditStatusOptions) => {
  const [status, setStatus] = useState<AuditStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!taskId) return;

    try {
      const data = await auditService.getAuditStatus(taskId);
      setStatus(data);

      // Проверяем статус завершения
      if (data.status === 'completed') {
        setIsPolling(false);
        onComplete?.(data);
      } else if (data.status === 'failed' || data.error) {
        setIsPolling(false);
        onError?.(data.error || 'Audit failed');
      }
    } catch (error) {
      console.error('Error fetching audit status:', error);
      setIsPolling(false);
      onError?.(error instanceof Error ? error.message : 'Failed to fetch status');
    }
  }, [taskId, onComplete, onError]);

  useEffect(() => {
    if (!taskId || !isPolling) return;

    // Немедленно запрашиваем статус
    fetchStatus();

    // Затем устанавливаем polling
    const interval = setInterval(fetchStatus, pollingInterval);

    return () => clearInterval(interval);
  }, [taskId, isPolling, fetchStatus, pollingInterval]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    status,
    isPolling,
    startPolling,
    stopPolling,
    refetch: fetchStatus
  };
};
