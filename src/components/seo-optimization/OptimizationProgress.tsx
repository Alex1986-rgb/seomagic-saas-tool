
import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, FileCode, HardDrive, Image, LayoutDashboard, Loader2, RefreshCw, Search } from "lucide-react";

interface OptimizationTask {
  id: string;
  domain: string;
  crawlId: string;
  status: 'pending' | 'crawling' | 'optimizing' | 'generating' | 'deploying' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime: Date | null;
  pagesProcessed: number;
  totalPages: number;
  error: string | null;
}

interface OptimizationProgressProps {
  task: OptimizationTask;
  onComplete?: () => void;
}

const OptimizationProgress: React.FC<OptimizationProgressProps> = ({ task, onComplete }) => {
  // Call onComplete when the task is completed
  useEffect(() => {
    if (task.status === 'completed' && onComplete) {
      onComplete();
    }
  }, [task.status, onComplete]);
  
  // Get appropriate status icon based on task status
  const getStatusIcon = () => {
    switch (task.status) {
      case 'crawling':
        return <Search className="h-5 w-5 text-primary animate-pulse" />;
      case 'optimizing':
        return <RefreshCw className="h-5 w-5 text-primary animate-spin" />;
      case 'generating':
        return <FileCode className="h-5 w-5 text-primary animate-pulse" />;
      case 'deploying':
        return <HardDrive className="h-5 w-5 text-primary animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
    }
  };
  
  // Get stage description based on task status
  const getStageDescription = () => {
    switch (task.status) {
      case 'crawling':
        return "Сканирование страниц сайта и анализ SEO проблем";
      case 'optimizing':
        return "Оптимизация контента с использованием искусственного интеллекта";
      case 'generating':
        return "Создание оптимизированной версии сайта";
      case 'deploying':
        return "Публикация оптимизированной версии на хостинг";
      case 'completed':
        return "Оптимизация успешно завершена";
      case 'failed':
        return "Произошла ошибка при оптимизации";
      default:
        return "Подготовка к оптимизации";
    }
  };
  
  // Get appropriate status color class based on task status
  const getStatusColorClass = () => {
    switch (task.status) {
      case 'completed':
        return "text-green-500";
      case 'failed':
        return "text-destructive";
      default:
        return "text-primary";
    }
  };
  
  // Calculate elapsed time
  const getElapsedTime = () => {
    const start = new Date(task.startTime).getTime();
    const end = task.endTime ? new Date(task.endTime).getTime() : Date.now();
    const elapsed = Math.floor((end - start) / 1000); // seconds
    
    if (elapsed < 60) {
      return `${elapsed} сек.`;
    }
    
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes} мин. ${seconds} сек.`;
  };
  
  // Show detailed progress based on task status
  const renderDetailedProgress = () => {
    switch (task.status) {
      case 'crawling':
        return (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1">Обработано страниц</div>
              <div className="text-2xl font-bold">{task.pagesProcessed}</div>
            </div>
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1">Всего страниц</div>
              <div className="text-2xl font-bold">{task.totalPages || '—'}</div>
            </div>
            <div className="border rounded-md p-3 bg-background">
              <div className="text-sm font-medium mb-1">Прошло времени</div>
              <div className="text-2xl font-bold">{getElapsedTime()}</div>
            </div>
          </div>
        );
      
      case 'optimizing':
        return (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-3 bg-background">
                <div className="text-sm font-medium mb-1">Оптимизировано</div>
                <div className="text-2xl font-bold">{task.pagesProcessed} / {task.totalPages}</div>
              </div>
              <div className="border rounded-md p-3 bg-background">
                <div className="text-sm font-medium mb-1">Прошло времени</div>
                <div className="text-2xl font-bold">{getElapsedTime()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-2 border rounded-md bg-background">
                <FileCode className="h-8 w-8 mb-1 text-blue-500" />
                <div className="text-xs text-center">HTML</div>
              </div>
              <div className="flex flex-col items-center p-2 border rounded-md bg-background">
                <LayoutDashboard className="h-8 w-8 mb-1 text-purple-500" />
                <div className="text-xs text-center">Структура</div>
              </div>
              <div className="flex flex-col items-center p-2 border rounded-md bg-background">
                <Image className="h-8 w-8 mb-1 text-green-500" />
                <div className="text-xs text-center">Изображения</div>
              </div>
            </div>
          </div>
        );
      
      case 'completed':
        return (
          <div className="mt-4">
            <Alert variant="success" className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Оптимизация завершена!</AlertTitle>
              <AlertDescription>
                Оптимизированная версия сайта готова к скачиванию или публикации.
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium">Обработано страниц</div>
                    <div className="text-xl font-bold">{task.totalPages}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Общее время</div>
                    <div className="text-xl font-bold">{getElapsedTime()}</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        );
      
      case 'failed':
        return (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка оптимизации</AlertTitle>
              <AlertDescription>
                {task.error || "Произошла ошибка при оптимизации сайта. Пожалуйста, попробуйте еще раз."}
              </AlertDescription>
            </Alert>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle>Прогресс оптимизации</CardTitle>
          </div>
          <div className={`text-sm font-medium ${getStatusColorClass()}`}>
            {task.status === 'completed' ? 'Завершено' : 
             task.status === 'failed' ? 'Ошибка' : 
             'В процессе'}
          </div>
        </div>
        <CardDescription>
          {getStageDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Общий прогресс</div>
            <div className="text-sm font-medium">{Math.round(task.progress)}%</div>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>
        
        {renderDetailedProgress()}
      </CardContent>
    </Card>
  );
};

export default OptimizationProgress;
