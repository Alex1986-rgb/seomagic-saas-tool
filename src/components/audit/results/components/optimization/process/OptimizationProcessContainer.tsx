
import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { OptimizationProcessContainerProps } from '@/features/audit/types/optimization-types';

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({ 
  url, 
  progress, 
  setOptimizationResult, 
  setLocalIsOptimized 
}) => {
  // Get stage message based on progress
  const getStageMessage = (progress: number) => {
    if (progress < 20) return "Анализ структуры сайта...";
    if (progress < 40) return "Оптимизация мета-тегов...";
    if (progress < 60) return "Улучшение контента...";
    if (progress < 80) return "Оптимизация изображений...";
    return "Финальные улучшения...";
  };

  useEffect(() => {
    // If optimization completes
    if (progress >= 100 && setLocalIsOptimized && setOptimizationResult) {
      const timer = setTimeout(() => {
        setLocalIsOptimized(true);
        
        // Set mock result
        setOptimizationResult({
          beforeScore: 65,
          afterScore: 92,
          demoPage: {
            title: 'Главная страница',
            content: 'Первоначальный контент страницы...',
            meta: {
              description: 'Старое описание',
              keywords: 'старые, ключевые, слова'
            },
            optimized: {
              content: 'Оптимизированный контент страницы с улучшенной структурой...',
              meta: {
                description: 'Оптимизированное SEO-описание с ключевыми словами',
                keywords: 'оптимизированные, ключевые, слова, сайт'
              }
            }
          }
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, setLocalIsOptimized, setOptimizationResult]);

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
            <span>Осталось: {Math.round((100 - progress) / 10)} мин</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationProcessContainer;
