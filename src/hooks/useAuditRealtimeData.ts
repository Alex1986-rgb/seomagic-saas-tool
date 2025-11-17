import { useState, useEffect, useMemo } from 'react';
import { FlowNode, AuditStage, Issue, AuditMetrics } from '@/components/audit/realtime/types';

interface AuditStatusData {
  status: string;
  stage: string;
  pages_scanned: number;
  estimated_pages: number;
  current_url: string;
  progress: number;
  audit_data?: any;
}

export const useAuditRealtimeData = (statusData: AuditStatusData | null) => {
  const [processingSpeed, setProcessingSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [previousPagesScanned, setPreviousPagesScanned] = useState(0);
  const [issues, setIssues] = useState<Issue[]>([]);

  // Track start time
  useEffect(() => {
    if (statusData?.status === 'scanning' && !startTime) {
      setStartTime(Date.now());
    }
  }, [statusData?.status, startTime]);

  // Calculate processing speed
  useEffect(() => {
    if (statusData?.pages_scanned && startTime) {
      const elapsed = (Date.now() - startTime) / 60000; // minutes
      if (elapsed > 0) {
        const speed = statusData.pages_scanned / elapsed;
        setProcessingSpeed(Math.round(speed));
      }
    }
  }, [statusData?.pages_scanned, startTime]);

  // Extract issues from audit_data
  useEffect(() => {
    if (statusData?.audit_data?.seo?.items) {
      const seoItems = statusData.audit_data.seo.items || [];
      const newIssues: Issue[] = seoItems.map((item: any) => ({
        type: item.type || 'unknown',
        description: item.message || item.description || 'Unknown issue',
        severity: item.status === 'error' ? 'error' : item.status === 'warning' ? 'warning' : 'good',
        url: statusData.current_url || '',
        timestamp: new Date(),
      }));
      
      setIssues(prev => [...prev, ...newIssues].slice(-50)); // Keep last 50
    }
  }, [statusData?.audit_data, statusData?.current_url]);

  // Generate flow nodes
  const flowNodes: FlowNode[] = useMemo(() => {
    const stage = statusData?.stage || 'initialization';
    const progress = statusData?.progress || 0;

    return [
      {
        id: 'start',
        label: 'Инициализация',
        icon: 'Play',
        status: progress > 0 ? 'completed' : stage === 'initialization' ? 'active' : 'idle',
        progress: Math.min(progress, 10),
      },
      {
        id: 'crawling',
        label: 'Сканирование',
        icon: 'Search',
        status: stage === 'crawling' ? 'active' : progress > 10 ? 'completed' : 'idle',
        progress: stage === 'crawling' ? Math.min(Math.max(progress, 10), 90) : progress > 90 ? 90 : 0,
        metrics: stage === 'crawling' ? [
          { label: 'Страниц', value: statusData?.pages_scanned || 0 },
        ] : undefined,
      },
      {
        id: 'analyzing',
        label: 'Анализ',
        icon: 'BarChart3',
        status: stage === 'analysis' ? 'active' : progress >= 90 ? 'completed' : 'idle',
        progress: stage === 'analysis' ? Math.min(Math.max(progress, 90), 100) : progress === 100 ? 100 : 0,
      },
      {
        id: 'results',
        label: 'Результаты',
        icon: 'CheckCircle',
        status: statusData?.status === 'completed' ? 'completed' : 'idle',
        progress: statusData?.status === 'completed' ? 100 : 0,
      },
    ];
  }, [statusData]);

  // Generate audit stages
  const auditStages: AuditStage[] = useMemo(() => {
    const progress = statusData?.progress || 0;
    const stage = statusData?.stage || 'initialization';

    return [
      {
        id: 'initialization',
        label: 'Инициализация',
        icon: 'Play',
        progress: Math.min(progress, 10),
        status: stage === 'initialization' ? 'active' : progress > 10 ? 'completed' : 'pending',
      },
      {
        id: 'crawling',
        label: 'Сканирование страниц',
        icon: 'Search',
        progress: stage === 'crawling' ? progress : progress > 90 ? 90 : 0,
        status: stage === 'crawling' ? 'active' : progress > 90 ? 'completed' : 'pending',
      },
      {
        id: 'analysis',
        label: 'SEO и технический анализ',
        icon: 'BarChart3',
        progress: stage === 'analysis' ? progress : progress === 100 ? 100 : 0,
        status: stage === 'analysis' ? 'active' : progress === 100 ? 'completed' : 'pending',
      },
      {
        id: 'completed',
        label: 'Сохранение результатов',
        icon: 'CheckCircle',
        progress: statusData?.status === 'completed' ? 100 : 0,
        status: statusData?.status === 'completed' ? 'completed' : 'pending',
      },
    ];
  }, [statusData]);

  // Calculate metrics
  const metrics: AuditMetrics = useMemo(() => {
    const issueStats = issues.reduce(
      (acc, issue) => {
        acc[issue.severity]++;
        return acc;
      },
      { error: 0, warning: 0, good: 0 }
    );

    return {
      pagesScanned: statusData?.pages_scanned || 0,
      totalPages: statusData?.estimated_pages || 0,
      processingSpeed,
      avgLoadTime: 0, // TODO: Calculate from page_analysis data
      currentUrl: statusData?.current_url || '',
      errors: issueStats.error,
      warnings: issueStats.warning,
      passed: issueStats.good,
    };
  }, [statusData, processingSpeed, issues]);

  return {
    flowNodes,
    auditStages,
    metrics,
    issues,
  };
};
