
import React from 'react';
import { OptimizationProgressState } from '@/features/audit/types/optimization-types';

interface OptimizationProcessContainerProps {
  url: string;
  progress: number;
  setOptimizationResult?: (result: any) => void;
  setLocalIsOptimized?: (value: boolean) => void;
}

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const currentStage = progress < 20 ? 'Анализ страниц' :
                       progress < 40 ? 'Оптимизация мета-тегов' :
                       progress < 60 ? 'Улучшение контента' :
                       progress < 80 ? 'Оптимизация изображений' :
                       'Применение изменений';
  
  return (
    <div className="my-6 p-4 border border-primary/20 rounded-lg bg-background/50">
      <div className="flex items-center gap-2 mb-2">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
        <h3 className="font-medium">Оптимизация сайта</h3>
      </div>
      
      <div className="w-full bg-muted h-2 rounded-full mb-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${Math.min(100, progress)}%` }}
        ></div>
      </div>
      
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
