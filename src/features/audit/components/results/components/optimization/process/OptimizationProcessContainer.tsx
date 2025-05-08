
import React, { useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

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
  return (
    <div className="my-4 p-4 border border-primary/20 rounded-lg bg-background">
      <h4 className="text-sm font-semibold mb-2">Процесс оптимизации</h4>
      
      <div className="mb-2 flex justify-between text-sm">
        <span>Прогресс: {Math.round(progress)}%</span>
        <span>Оптимизация {url}</span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Улучшаем SEO-показатели сайта. Пожалуйста, подождите...</p>
        {progress > 30 && <p>Исправляем META-теги...</p>}
        {progress > 50 && <p>Оптимизируем контент...</p>}
        {progress > 70 && <p>Создаем файл sitemap.xml...</p>}
        {progress > 90 && <p>Финализируем оптимизацию...</p>}
      </div>
    </div>
  );
};

export default OptimizationProcessContainer;
