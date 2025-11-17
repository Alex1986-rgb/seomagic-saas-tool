import { useState, useEffect } from 'react';
import { auditService } from '../services/auditService';
import type { Audit } from '../types';

export const useAuditList = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await auditService.getUserAudits();
      setAudits(data);
    } catch (err) {
      console.error('Error fetching audits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  return {
    audits,
    isLoading,
    error,
    refetch: fetchAudits
  };
};
