
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { OptimizationProcessContainerProps } from '@/features/audit/types/optimization-types';

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
}) => {
  // Раньше этапы («оптимизация изображений», «финальные улучшения») менялись
  // по проценту полосы и не отражали ничего: сервер переписывает страницы
  // языковой моделью. Показываем то, что происходит на самом деле.
  const getStageMessage = (progress: number) => {
    if (progress <= 0) return "Ставим задачу в очередь...";
    if (progress >= 99) return "Сохраняем переписанные страницы...";
    return "Переписываем страницы...";
  };

  // Здесь стоял подставной итог: «было 65, стало 92» и выдуманная страница с
  // текстом «Оптимизированный контент страницы...». Экран показывает только ход
  // работы; настоящий результат приходит от сервера и ставится выше.

  return (
    <Card className="my-6 border border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div>
            <p className="font-medium">{getStageMessage(progress)}</p>
            <p className="text-sm text-muted-foreground">Оптимизируем: {url}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Выполнено {Math.min(Math.round(progress), 100)}%</span>
            <span>{progress >= 99 ? 'Завершаем' : 'Идёт работа'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationProcessContainer;
