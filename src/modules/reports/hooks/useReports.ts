import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import type { Report } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportService.getUserReports();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports
  };
};
