
import React from 'react';
import { OptimizationProcessContainerProps } from '@/features/audit/types/optimization-types';

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="font-medium mb-2">Оптимизация {url}</h3>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Прогресс оптимизации: {progress}%
      </p>
    </div>
  );
};

export default OptimizationProcessContainer;
