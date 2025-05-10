
import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

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
    <div className="my-6 p-4 border border-primary/20 rounded-lg bg-card/30">
      <h3 className="text-lg font-medium mb-2">Оптимизация сайта {url}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Пожалуйста, подождите. Процесс оптимизации может занять несколько минут.
      </p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогресс</span>
          <span>{Math.min(100, Math.round(progress))}%</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {progress > 10 && (
            <p className="text-xs text-muted-foreground">✓ Анализ структуры сайта</p>
          )}
          
          {progress > 30 && (
            <p className="text-xs text-muted-foreground">✓ Оптимизация мета-тегов</p>
          )}
          
          {progress > 50 && (
            <p className="text-xs text-muted-foreground">✓ Улучшение заголовков страниц</p>
          )}
          
          {progress > 70 && (
            <p className="text-xs text-muted-foreground">✓ Оптимизация контента</p>
          )}
          
          {progress > 90 && (
            <p className="text-xs text-muted-foreground">✓ Проверка оптимизированных страниц</p>
          )}
          
          {progress >= 100 && (
            <p className="text-xs font-medium text-primary">Оптимизация завершена!</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OptimizationProcessContainer;
