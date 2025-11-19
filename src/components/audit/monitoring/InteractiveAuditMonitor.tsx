import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, DollarSign, RefreshCw, Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuditRealtime } from '@/hooks/audit/useAuditRealtime';
import { IssueFeed } from './IssueFeed';
import { CostEstimator } from './CostEstimator';
import { OptimizationItem } from '@/types/audit/optimization-types';

interface InteractiveAuditMonitorProps {
  taskId: string;
  progress: number;
  pagesScanned: number;
  totalPages: number;
  status: string;
  url?: string;
  optimizationItems?: OptimizationItem[];
  onDownloadPartialReport: () => void;
  onRetry: () => void;
  onPause?: () => void;
}

export const InteractiveAuditMonitor: React.FC<InteractiveAuditMonitorProps> = ({
  taskId,
  progress,
  pagesScanned,
  totalPages,
  url = '',
  status,
  optimizationItems = [],
  onDownloadPartialReport,
  onRetry,
  onPause,
}) => {
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const { metrics, recentIssues } = useAuditRealtime(taskId);
  
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
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс сканирования</span>
            <span className={`font-semibold ${getStatusColor()}`}>
              {pagesScanned} / {totalPages} страниц ({completionPercent}%)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Ошибки</div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-2xl font-bold text-destructive">{metrics?.errors || 0}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Предупреждения</div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600">{metrics?.warnings || 0}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Пройдено</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{metrics?.passed || 0}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Всего</div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{pagesScanned}</span>
            </div>
          </div>
        </div>

        {metrics?.currentUrl && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">Текущая страница:</div>
            <div className="text-sm font-mono bg-accent/50 p-3 rounded-lg truncate">
              {metrics.currentUrl}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Live-лента проблем</h4>
            <Badge variant="outline">{recentIssues.length} проблем</Badge>
          </div>
          <IssueFeed issues={recentIssues} maxHeight="300px" />
        </div>

        <div className="flex flex-wrap gap-2">
          {isActive && onPause && (
            <Button variant="outline" size="sm" onClick={onPause}>
              <Pause className="h-4 w-4 mr-2" />
              Приостановить
            </Button>
          )}
          
          {isFailed && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Повторить
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={onDownloadPartialReport}>
            <Download className="h-4 w-4 mr-2" />
            Скачать отчет
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowEstimateDialog(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            Смета
          </Button>
        </div>

        {(isFailed || completionPercent < 100) && (
          <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <div className="font-medium text-yellow-900 dark:text-yellow-100">
                  Частичные данные
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  Аудит завершен на {completionPercent}%. Отчет содержит предварительные данные.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={showEstimateDialog} onOpenChange={setShowEstimateDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Смета оптимизации</DialogTitle>
          </DialogHeader>
          <CostEstimator 
            items={optimizationItems} 
            discount={10}
            url={url}
            auditId={taskId}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
