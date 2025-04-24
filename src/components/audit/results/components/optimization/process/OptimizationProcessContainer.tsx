
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult: (result: any) => void;
  setLocalIsOptimized: (isOptimized: boolean) => void;
}

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const [currentStage, setCurrentStage] = useState<string>('Анализ страниц');
  
  // Update the current stage based on progress
  useEffect(() => {
    if (progress < 20) {
      setCurrentStage('Анализ страниц');
    } else if (progress < 40) {
      setCurrentStage('Оптимизация мета-тегов');
    } else if (progress < 60) {
      setCurrentStage('Улучшение контента');
    } else if (progress < 80) {
      setCurrentStage('Оптимизация изображений');
    } else {
      setCurrentStage('Применение изменений');
    }
  }, [progress]);
  
  return (
    <div className="my-6 p-4 border border-primary/20 rounded-lg bg-background/50">
      <div className="flex items-center gap-2 mb-2">
        <Loader2 className="animate-spin h-4 w-4 text-primary" />
        <h3 className="font-medium">Оптимизация сайта</h3>
      </div>
      
      <Progress value={progress} className="h-2 mb-2" />
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">{currentStage}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        Пожалуйста, не закрывайте страницу во время оптимизации. 
        Процесс может занять до 5 минут в зависимости от размера сайта.
      </div>
    </div>
  );
};

export default OptimizationProcessContainer;
