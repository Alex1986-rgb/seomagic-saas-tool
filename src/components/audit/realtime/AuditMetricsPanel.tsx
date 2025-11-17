import { motion } from 'framer-motion';
import { FileText, Zap, Clock, AlertCircle, AlertTriangle, CheckCircle2, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from './AnimatedCounter';
import { AuditMetrics } from './types';

interface AuditMetricsPanelProps {
  metrics: AuditMetrics;
}

export const AuditMetricsPanel = ({ metrics }: AuditMetricsPanelProps) => {
  const metricCards = [
    {
      icon: FileText,
      label: 'Обработано страниц',
      value: metrics.pagesScanned,
      total: metrics.totalPages,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Zap,
      label: 'Скорость обработки',
      value: metrics.processingSpeed,
      suffix: ' стр/мин',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Ср. время загрузки',
      value: Math.round(metrics.avgLoadTime),
      suffix: ' мс',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const issueCards = [
    {
      icon: AlertCircle,
      label: 'Критические',
      value: metrics.errors,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: AlertTriangle,
      label: 'Предупреждения',
      value: metrics.warnings,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: CheckCircle2,
      label: 'Успешно',
      value: metrics.passed,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {metric.label}
                    </p>
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      <AnimatedCounter 
                        value={metric.value} 
                        suffix={metric.suffix || ''} 
                      />
                      {metric.total && (
                        <span className="text-sm text-muted-foreground ml-1">
                          / {metric.total}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Issues Counter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {issueCards.map((issue, index) => (
          <motion.div
            key={issue.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${issue.bgColor}`}>
                    <issue.icon className={`w-5 h-5 ${issue.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      {issue.label}
                    </p>
                    <p className={`text-2xl font-bold ${issue.color}`}>
                      <AnimatedCounter value={issue.value} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current URL */}
      {metrics.currentUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    Текущая страница
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {metrics.currentUrl}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
