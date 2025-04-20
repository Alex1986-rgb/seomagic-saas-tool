
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface MassiveSiteCrawlProgressProps {
  pagesScanned: number;
  totalEstimated: number;
  currentUrl: string;
  processingStage: 'initializing' | 'crawling' | 'analyzing' | 'optimizing' | 'completed' | 'failed';
  percentage: number;
  batchNumber: number;
  totalBatches: number;
  error: string | null;
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
  const getStageText = () => {
    switch (processingStage) {
      case 'initializing':
        return 'Инициализация сканирования...';
      case 'crawling':
        return 'Сканирование страниц...';
      case 'analyzing':
        return 'Анализ данных...';
      case 'optimizing':
        return 'Подготовка рекомендаций...';
      case 'completed':
        return 'Сканирование завершено';
      case 'failed':
        return 'Ошибка сканирования';
      default:
        return 'Обработка...';
    }
  };
  
  const getStageColor = () => {
    switch (processingStage) {
      case 'optimizing':
      case 'analyzing':
        return 'text-amber-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };
  
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        {processingStage !== 'completed' && processingStage !== 'failed' && (
          <Loader2 className="h-5 w-5 animate-spin" />
        )}
        <div className={`text-lg font-medium ${getStageColor()}`}>
          {getStageText()}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Прогресс сканирования:</span>
          <div className="flex items-center gap-1">
            <span className="font-medium">{percentage}%</span>
            {totalBatches > 1 && (
              <span className="text-xs text-muted-foreground">
                (Пакет {batchNumber} из {totalBatches})
              </span>
            )}
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Просканировано страниц</div>
          <div className="text-2xl font-semibold mt-1">
            {pagesScanned.toLocaleString('ru-RU')}
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-md">
          <div className="text-xs text-muted-foreground">Оценка общего количества</div>
          <div className="text-2xl font-semibold mt-1">
            {totalEstimated > 0 
              ? totalEstimated.toLocaleString('ru-RU') 
              : 'Расчет...'}
          </div>
        </div>
      </div>
      
      {currentUrl && processingStage === 'crawling' && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Текущий URL:</div>
          <div className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto whitespace-nowrap">
            {currentUrl}
          </div>
        </div>
      )}
      
      {processingStage === 'analyzing' && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
            Анализ данных сайта
          </h4>
          <ul className="text-xs text-amber-600 dark:text-amber-400 space-y-1">
            <li>• Анализ метатегов и заголовков</li>
            <li>• Проверка качества контента</li>
            <li>• Оценка скорости загрузки</li>
            <li>• Анализ структуры ссылок</li>
          </ul>
        </div>
      )}
      
      {processingStage === 'optimizing' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            Подготовка рекомендаций
          </h4>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Формирование рекомендаций по SEO</li>
            <li>• Выявление проблемных страниц</li>
            <li>• Расчет приоритетов оптимизации</li>
            <li>• Подготовка итогового отчета</li>
          </ul>
        </div>
      )}
      
      {processingStage === 'completed' && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-md">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
            Сканирование успешно завершено
          </h4>
          <p className="text-xs text-green-600 dark:text-green-400">
            Обработано {pagesScanned.toLocaleString('ru-RU')} страниц. 
            Теперь вы можете просмотреть результаты анализа и получить рекомендации по оптимизации.
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      )}
      
      {pagesScanned > 1000000 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Обработка очень большого сайта
          </h4>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Сайт содержит более миллиона страниц. Для повышения эффективности анализа 
            система использует интеллектуальное семплирование данных и кластеризацию страниц.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MassiveSiteCrawlProgress;
