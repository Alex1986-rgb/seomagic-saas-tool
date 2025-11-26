import React from 'react';
import { AlertTriangle, RefreshCw, PlayCircle, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { InterruptedAudit } from '@/hooks/useInterruptedAudit';

interface InterruptedAuditBannerProps {
  audit: InterruptedAudit;
  isResuming: boolean;
  onResume: () => void;
  onStartFresh: () => void;
  onDismiss: () => void;
}

export const InterruptedAuditBanner: React.FC<InterruptedAuditBannerProps> = ({
  audit,
  isResuming,
  onResume,
  onStartFresh,
  onDismiss
}) => {
  const progressPercent = audit.totalPages > 0 
    ? Math.round((audit.pagesScanned / audit.totalPages) * 100)
    : audit.progress || 0;

  return (
    <Card className="border-warning/50 bg-warning/5 mb-6">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">
                  Прерванный аудит
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Аудит был прерван {formatDistanceToNow(new Date(audit.updatedAt), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={onDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress info */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-medium">
                  {progressPercent}% ({audit.pagesScanned}/{audit.totalPages || '?'} страниц)
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            {/* Error message if any */}
            {audit.errorMessage && (
              <div className="mt-3 p-2 bg-destructive/10 rounded-md">
                <p className="text-xs text-destructive">
                  <span className="font-medium">Причина:</span> {audit.errorMessage}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={onResume}
                disabled={isResuming}
                className="gap-2"
              >
                {isResuming ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Возобновление...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Возобновить
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onStartFresh}
                disabled={isResuming}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Начать заново
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              При возобновлении сканирование продолжится с места остановки. 
              Уже обработанные страницы не будут сканироваться повторно.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
