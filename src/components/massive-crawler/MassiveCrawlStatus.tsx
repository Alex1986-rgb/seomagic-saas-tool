
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { firecrawlService, CrawlStatus } from '@/services/api/firecrawlService';
import { useToast } from "@/hooks/use-toast";
import { Download, FileDown, RefreshCw, Clock, Loader2 } from 'lucide-react';

interface MassiveCrawlStatusProps {
  taskId: string;
  onComplete?: (pagesScanned: number) => void;
}

export const MassiveCrawlStatus: React.FC<MassiveCrawlStatusProps> = ({
  taskId,
  onComplete
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<CrawlStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const crawlStatus = await firecrawlService.checkCrawlStatus(taskId);
      setStatus(crawlStatus);
      
      if (crawlStatus.status === 'completed' && onComplete) {
        onComplete(crawlStatus.pagesScanned);
      }
    } catch (error) {
      console.error('Ошибка при получении статуса сканирования:', error);
      setError('Не удалось получить статус сканирования');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Периодическое обновление статуса
    const interval = setInterval(fetchStatus, 5000);
    
    return () => clearInterval(interval);
  }, [taskId]);

  const handleExport = async (format: 'json' | 'csv' | 'xml' | 'sitemap') => {
    try {
      const blob = await firecrawlService.exportCrawlResults(taskId, format);
      
      // Создаем временную ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crawl-results-${taskId}.${format === 'sitemap' ? 'xml' : format}`;
      document.body.appendChild(a);
      a.click();
      
      // Очищаем после скачивания
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Экспорт успешен",
        description: `Результаты экспортированы в формате ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Ошибка при экспорте результатов:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать результаты",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;
    
    const variants = {
      pending: 'secondary',
      processing: 'default',
      completed: 'success',
      failed: 'destructive'
    };
    
    const labels = {
      pending: 'Ожидание',
      processing: 'В процессе',
      completed: 'Завершено',
      failed: 'Ошибка'
    };
    
    return (
      <Badge variant={variants[status.status] as any}>{labels[status.status]}</Badge>
    );
  };

  if (loading && !status) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-destructive font-medium">{error}</p>
            <Button variant="outline" onClick={fetchStatus} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Повторить попытку
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">Статус задачи #{taskId}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Прогресс сканирования
            </span>
            <span className="font-medium">{status?.progress || 0}%</span>
          </div>
          <Progress value={status?.progress || 0} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground block">
              Просканировано страниц
            </span>
            <span className="text-lg font-semibold">
              {status?.pagesScanned.toLocaleString('ru-RU') || 0}
            </span>
          </div>
          
          <div>
            <span className="text-sm text-muted-foreground block">
              Всего страниц (прибл.)
            </span>
            <span className="text-lg font-semibold">
              {status?.estimatedTotalPages.toLocaleString('ru-RU') || 0}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Начало: {status?.startTime ? new Date(status.startTime).toLocaleString('ru-RU') : '-'}</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>Обновлено: {status?.lastUpdated ? new Date(status.lastUpdated).toLocaleString('ru-RU') : '-'}</span>
          </div>
        </div>
        
        {status?.status === 'completed' && (
          <div className="flex flex-wrap gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('json')} className="gap-1">
              <FileDown className="h-3 w-3" />
              JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('sitemap')} className="gap-1">
              <FileDown className="h-3 w-3" />
              Sitemap XML
            </Button>
            <Button size="sm" onClick={() => handleExport('sitemap')} className="gap-1">
              <Download className="h-3 w-3" />
              Скачать все
            </Button>
          </div>
        )}
        
        {status?.status === 'processing' && (
          <div className="flex items-center justify-center pt-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Сканирование в процессе...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
