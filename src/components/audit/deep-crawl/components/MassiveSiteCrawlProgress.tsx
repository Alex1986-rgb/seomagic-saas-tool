
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Shield } from 'lucide-react';

interface MassiveSiteCrawlProgressProps {
  pagesScanned: number;
  totalEstimated: number;
  currentUrl: string;
  processingStage: 'initializing' | 'crawling' | 'analyzing' | 'optimizing' | 'completed' | 'failed';
  percentage: number;
  batchNumber: number;
  totalBatches: number;
  error?: string;
}

export const MassiveSiteCrawlProgress: React.FC<MassiveSiteCrawlProgressProps> = ({
  pagesScanned,
  totalEstimated,
  currentUrl,
  processingStage,
  percentage,
  batchNumber,
  totalBatches,
  error
}) => {
  const getStageInfo = () => {
    switch (processingStage) {
      case 'initializing':
        return { text: 'Инициализация сканирования...', color: 'text-blue-500' };
      case 'crawling':
        return { text: 'Сканирование страниц', color: 'text-green-500' };
      case 'analyzing':
        return { text: 'Анализ контента', color: 'text-indigo-500' };
      case 'optimizing':
        return { text: 'Оптимизация страниц', color: 'text-purple-500' };
      case 'completed':
        return { text: 'Сканирование завершено', color: 'text-emerald-500' };
      case 'failed':
        return { text: 'Произошла ошибка', color: 'text-red-500' };
      default:
        return { text: 'В процессе...', color: 'text-gray-500' };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Shield className={`h-5 w-5 ${stageInfo.color}`} />
        <h3 className={`text-lg font-semibold ${stageInfo.color}`}>
          {stageInfo.text}
        </h3>
      </div>

      <div className="space-y-4">
        <Progress value={percentage} className="w-full h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Просканировано страниц:</p>
            <p className="font-medium">{pagesScanned.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Всего страниц:</p>
            <p className="font-medium">{totalEstimated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Текущая партия:</p>
            <p className="font-medium">{batchNumber} из {totalBatches}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Прогресс:</p>
            <p className="font-medium">{percentage}%</p>
          </div>
        </div>

        {currentUrl && (
          <div className="pt-2">
            <p className="text-muted-foreground text-sm">Текущий URL:</p>
            <p className="text-sm font-mono break-all">{currentUrl}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};
