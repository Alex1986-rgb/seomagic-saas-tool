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
    if (statusData && (statusData.status === 'scanning' || statusData.status === 'analyzing') && !startTime) {
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
    if (!statusData?.audit_data) {
      return;
    }

    const auditData = statusData.audit_data;
    const newIssues: Issue[] = [];
    
    // Extract from audit_data structure (when completed)
    if (auditData.audit_data) {
      const data = auditData.audit_data;
      
      // Extract SEO issues
      if (data.seo?.items) {
        data.seo.items.forEach((item: any) => {
          newIssues.push({
            type: item.type || 'seo',
            description: item.message || item.description || 'SEO issue detected',
            severity: item.status === 'error' ? 'error' : item.status === 'warning' ? 'warning' : 'good',
            url: item.url || statusData.current_url || '',
            timestamp: new Date(),
          });
        });
      }
      
      // Extract technical issues
      if (data.technical?.items) {
        data.technical.items.forEach((item: any) => {
          newIssues.push({
            type: item.type || 'technical',
            description: item.message || item.description || 'Technical issue detected',
            severity: item.status === 'error' ? 'error' : item.status === 'warning' ? 'warning' : 'good',
            url: item.url || statusData.current_url || '',
            timestamp: new Date(),
          });
        });
      }
    }
    
    if (newIssues.length > 0) {
      setIssues(newIssues.slice(-100)); // Keep last 100 unique issues
    }
  }, [statusData?.audit_data, statusData?.current_url]);

  // Generate flow nodes
  const flowNodes: FlowNode[] = useMemo(() => {
    if (!statusData) {
      return [
        { id: 'start', label: 'Инициализация', icon: 'Play', status: 'idle', progress: 0 },
        { id: 'crawling', label: 'Сканирование', icon: 'Search', status: 'idle', progress: 0 },
        { id: 'analyzing', label: 'Анализ', icon: 'BarChart3', status: 'idle', progress: 0 },
        { id: 'results', label: 'Результаты', icon: 'CheckCircle', status: 'idle', progress: 0 },
      ];
    }

    const stage = statusData.stage || 'initialization';
    const progress = statusData.progress || 0;
    const status = statusData.status || 'queued';

    return [
      {
        id: 'start',
        label: 'Инициализация',
        icon: 'Play',
        status: progress > 0 || status === 'completed' ? 'completed' : stage === 'initialization' || status === 'queued' ? 'active' : 'idle',
        progress: Math.min(progress, 10),
      },
      {
        id: 'crawling',
        label: 'Сканирование',
        icon: 'Search',
        status: stage === 'crawling' || status === 'scanning' ? 'active' : progress > 10 ? 'completed' : 'idle',
        progress: (stage === 'crawling' || status === 'scanning') ? Math.min(Math.max(progress, 10), 90) : progress > 90 ? 90 : 0,
        metrics: (stage === 'crawling' || status === 'scanning') ? [
          { label: 'Страниц', value: statusData.pages_scanned || 0 },
        ] : undefined,
      },
      {
        id: 'analyzing',
        label: 'Анализ',
        icon: 'BarChart3',
        status: stage === 'analysis' || status === 'analyzing' ? 'active' : (status === 'completed' || progress >= 90) ? 'completed' : 'idle',
        progress: (stage === 'analysis' || status === 'analyzing') ? Math.min(Math.max(progress, 90), 100) : status === 'completed' || progress === 100 ? 100 : 0,
      },
      {
        id: 'results',
        label: 'Результаты',
        icon: 'CheckCircle',
        status: status === 'completed' ? 'completed' : 'idle',
        progress: status === 'completed' ? 100 : 0,
      },
    ];
  }, [statusData]);

  // Generate audit stages
  const auditStages: AuditStage[] = useMemo(() => {
    if (!statusData) {
      return [
        { id: 'initialization', label: 'Инициализация', icon: 'Play', progress: 0, status: 'pending' },
        { id: 'crawling', label: 'Сканирование страниц', icon: 'Search', progress: 0, status: 'pending' },
        { id: 'analysis', label: 'SEO и технический анализ', icon: 'BarChart3', progress: 0, status: 'pending' },
        { id: 'completed', label: 'Сохранение результатов', icon: 'CheckCircle', progress: 0, status: 'pending' },
      ];
    }

    const progress = statusData.progress || 0;
    const stage = statusData.stage || 'initialization';
    const status = statusData.status || 'queued';

    return [
      {
        id: 'initialization',
        label: 'Инициализация',
        icon: 'Play',
        progress: Math.min(progress, 10),
        status: (stage === 'initialization' || status === 'queued') ? 'active' : progress > 10 ? 'completed' : 'pending',
      },
      {
        id: 'crawling',
        label: 'Сканирование страниц',
        icon: 'Search',
        progress: (stage === 'crawling' || status === 'scanning') ? progress : progress > 90 ? 90 : 0,
        status: (stage === 'crawling' || status === 'scanning') ? 'active' : progress > 90 ? 'completed' : 'pending',
      },
      {
        id: 'analysis',
        label: 'SEO и технический анализ',
        icon: 'BarChart3',
        progress: (stage === 'analysis' || status === 'analyzing') ? progress : status === 'completed' || progress === 100 ? 100 : 0,
        status: (stage === 'analysis' || status === 'analyzing') ? 'active' : status === 'completed' || progress === 100 ? 'completed' : 'pending',
      },
      {
        id: 'completed',
        label: 'Сохранение результатов',
        icon: 'CheckCircle',
        progress: status === 'completed' ? 100 : 0,
        status: status === 'completed' ? 'completed' : 'pending',
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
