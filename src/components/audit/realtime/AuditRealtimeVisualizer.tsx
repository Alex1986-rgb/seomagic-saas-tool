import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { AuditFlowDiagram } from './AuditFlowDiagram';
import { AuditMetricsPanel } from './AuditMetricsPanel';
import { AuditStageIndicator } from './AuditStageIndicator';
import { IssuesStreamView } from './IssuesStreamView';
import { UrlDiscoveryStream } from './UrlDiscoveryStream';
import { useAuditRealtimeData } from '@/hooks/useAuditRealtimeData';
import { useState } from 'react';

interface AuditRealtimeVisualizerProps {
  url: string;
  statusData: any;
}

export const AuditRealtimeVisualizer = ({ url, statusData }: AuditRealtimeVisualizerProps) => {
  const [issuesOpen, setIssuesOpen] = useState(false);
  const { flowNodes, auditStages, metrics, issues } = useAuditRealtimeData(statusData);

  const progress = statusData?.progress || 0;
  const stage = statusData?.stage || 'queued';
  const status = statusData?.status || 'queued';

  // Get stage label
  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      queued: 'Инициализация',
      discovery: 'Поиск страниц',
      fetching: 'Загрузка HTML',
      analysis: 'SEO анализ',
      generating: 'Генерация отчетов',
      completed: 'Завершено'
    };
    return labels[stage] || stage;
  };

  // Debug logging
  console.log('AuditRealtimeVisualizer render:', { 
    url,
    statusData, 
    progress, 
    stage, 
    status,
    metricsCount: metrics.pagesScanned,
    issuesCount: issues.length,
    flowNodesCount: flowNodes.length
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    Аудит в реальном времени
                    {progress === 100 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-primary"
                      >
                        ✓
                      </motion.span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getStageLabel(stage)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold transition-colors ${progress === 100 ? 'text-primary' : 'text-foreground'}`}>
                    {progress}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {progress === 100 ? 'Готово' : 'Завершено'}
                  </p>
                  {stage === 'analysis' && progress > 90 && progress < 100 && (
                    <p className="text-xs text-muted-foreground animate-pulse mt-1">
                      (Финальная обработка данных...)
                    </p>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground truncate flex-1">
                  {url}
                </p>
                {statusData?.current_url && statusData.current_url !== url && (
                  <p className="text-xs text-muted-foreground ml-2">
                    Обработка: {new URL(statusData.current_url).pathname}
                  </p>
                )}
              </div>
              {metrics.pagesScanned > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Страниц обработано: <span className="font-semibold text-foreground">{metrics.pagesScanned}</span>
                  </span>
                  {metrics.totalPages > 0 && (
                    <span className="text-muted-foreground">
                      / {metrics.totalPages}
                    </span>
                  )}
                  {metrics.processingSpeed > 0 && (
                    <span className="text-muted-foreground">
                      Скорость: <span className="font-semibold text-foreground">{metrics.processingSpeed}</span> стр/мин
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AuditFlowDiagram
          currentStage={stage}
          progress={progress}
          nodes={flowNodes}
        />
      </motion.div>

      {/* URL Discovery Stream - Show during discovery phase */}
      {stage === 'discovery' && statusData?.task_id && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <UrlDiscoveryStream taskId={statusData.task_id} />
        </motion.div>
      )}

      {/* Layout: Stages + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stage Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Этапы выполнения</CardTitle>
            </CardHeader>
            <CardContent>
              <AuditStageIndicator stages={auditStages} currentStage={stage} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <AuditMetricsPanel metrics={metrics} />
        </motion.div>
      </div>

      {/* Issues Stream (Collapsible) */}
      {issues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Collapsible open={issuesOpen} onOpenChange={setIssuesOpen}>
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CollapsibleTrigger className="w-full">
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Найденные проблемы ({issues.length})
                    </CardTitle>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${issuesOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <IssuesStreamView issues={issues} />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </motion.div>
      )}
    </div>
  );
};
