import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { AuditFlowDiagram } from './AuditFlowDiagram';
import { AuditMetricsPanel } from './AuditMetricsPanel';
import { AuditStageIndicator } from './AuditStageIndicator';
import { IssuesStreamView } from './IssuesStreamView';
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
  const stage = statusData?.stage || 'initialization';

  // Debug logging
  console.log('AuditRealtimeVisualizer render:', { 
    url,
    statusData, 
    progress, 
    stage, 
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
                <CardTitle className="text-2xl">
                  Аудит в реальном времени
                </CardTitle>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {progress}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Завершено
                  </p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {url}
              </p>
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
