import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, DollarSign, RefreshCw, Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditMetrics {
  pagesScanned: number;
  totalPages: number;
  processingSpeed: number;
  avgLoadTime: number;
  currentUrl: string;
  errors: number;
  warnings: number;
  passed: number;
}

interface InteractiveAuditMonitorProps {
  taskId: string;
  progress: number;
  pagesScanned: number;
  totalPages: number;
  status: string;
  metrics?: AuditMetrics;
  issues?: Array<{ type: string; description: string; severity: 'error' | 'warning' | 'good'; url: string }>;
  onDownloadPartialReport: () => void;
  onShowEstimate?: () => void;
  onRetry: () => void;
  onPause?: () => void;
}

export const InteractiveAuditMonitor: React.FC<InteractiveAuditMonitorProps> = ({
  progress,
  pagesScanned,
  totalPages,
  status,
  metrics,
  issues = [],
  onDownloadPartialReport,
  onShowEstimate,
  onRetry,
  onPause,
}) => {
  const completionPercent = Math.round((pagesScanned / totalPages) * 100) || 0;
  const isActive = status === 'processing' || status === 'in-progress';
  const isFailed = status === 'failed' || status === 'error';

  const getStatusColor = () => {
    if (isFailed) return 'text-destructive';
    if (isActive) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getStatusBadge = () => {
    if (isFailed) return <Badge variant="destructive">Ошибка</Badge>;
    if (isActive) return <Badge className="animate-pulse">В процессе</Badge>;
    return <Badge variant="secondary">Завершено</Badge>;
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {isActive && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <RefreshCw className="h-5 w-5 text-primary" />
              </motion.div>
            )}
            Интерактивный мониторинг аудита
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс сканирования</span>
            <span className={`font-semibold ${getStatusColor()}`}>
              {pagesScanned} / {totalPages} страниц ({completionPercent}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Ошибки</div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-2xl font-bold text-destructive">{metrics.errors}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Предупреждения</div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{metrics.warnings}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Пройдено</div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{metrics.passed}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Скорость</div>
              <div className="text-2xl font-bold text-primary">
                {metrics.processingSpeed.toFixed(1)}
                <span className="text-sm text-muted-foreground ml-1">стр/с</span>
              </div>
            </div>
          </div>
        )}

        {/* Current URL */}
        {metrics?.currentUrl && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Текущая страница:</div>
            <div className="text-sm bg-muted/30 rounded-md px-3 py-2 font-mono truncate">
              {metrics.currentUrl}
            </div>
          </div>
        )}

        {/* Issues Feed */}
        {issues.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold">Найденные проблемы ({issues.length})</div>
            <ScrollArea className="h-40 border rounded-md">
              <div className="p-3 space-y-2">
                {issues.slice(0, 20).map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-2 text-xs border-b border-border/30 pb-2 last:border-0"
                  >
                    {issue.severity === 'error' && <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />}
                    {issue.severity === 'warning' && <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                    {issue.severity === 'good' && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{issue.description}</div>
                      <div className="text-muted-foreground truncate">{issue.url}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={onDownloadPartialReport}
            variant="default"
            size="sm"
            className="flex-1 min-w-[140px]"
          >
            <Download className="h-4 w-4 mr-2" />
            Скачать отчет PDF
          </Button>
          {onShowEstimate && (
            <Button
              onClick={onShowEstimate}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[140px]"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Показать смету
            </Button>
          )}
          {isFailed && (
            <Button
              onClick={onRetry}
              variant="secondary"
              size="sm"
              className="flex-1 min-w-[140px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Повторить
            </Button>
          )}
          {isActive && onPause && (
            <Button
              onClick={onPause}
              variant="ghost"
              size="sm"
            >
              <Pause className="h-4 w-4 mr-2" />
              Остановить
            </Button>
          )}
        </div>

        {/* Partial Data Warning */}
        {completionPercent < 100 && completionPercent > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 text-sm"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-700 dark:text-yellow-500">Частичные данные</div>
                <div className="text-muted-foreground mt-1">
                  Отчет сформирован на основе {completionPercent}% проанализированных страниц.
                  Запустите полный аудит для получения полной картины.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
