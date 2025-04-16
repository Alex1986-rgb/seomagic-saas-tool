
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Clock, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { CrawlStatus } from '@/services/api/types/firecrawl';

interface CrawlStatusDisplayProps {
  status: CrawlStatus;
}

export const CrawlStatusDisplay = ({ status }: CrawlStatusDisplayProps) => {
  const getStatusBadge = () => {
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'outline',
      failed: 'destructive'
    } as const;
    
    const labels = {
      pending: 'Ожидание',
      processing: 'В процессе',
      completed: 'Завершено',
      failed: 'Ошибка'
    } as const;
    
    return (
      <Badge variant={variants[status.status]}>{labels[status.status]}</Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">Статус задачи #{status.taskId}</h3>
        {getStatusBadge()}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Прогресс сканирования
          </span>
          <span className="font-medium">{status.progress || 0}%</span>
        </div>
        <Progress value={status.progress || 0} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-muted-foreground block">
            Просканировано страниц
          </span>
          <span className="text-lg font-semibold">
            {status.pagesScanned.toLocaleString('ru-RU')}
          </span>
        </div>
        
        <div>
          <span className="text-sm text-muted-foreground block">
            Всего страниц (прибл.)
          </span>
          <span className="text-lg font-semibold">
            {status.estimatedTotalPages.toLocaleString('ru-RU')}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Начало: {status.startTime ? new Date(status.startTime).toLocaleString('ru-RU') : '-'}</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          <span>Обновлено: {status.lastUpdated ? new Date(status.lastUpdated).toLocaleString('ru-RU') : '-'}</span>
        </div>
      </div>

      {status.status === 'processing' && (
        <div className="flex items-center justify-center pt-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Сканирование в процессе...</span>
        </div>
      )}
    </div>
  );
};
