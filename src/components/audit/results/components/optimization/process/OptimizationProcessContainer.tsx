
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { OptimizationProcessContainerProps } from '@/features/audit/types/optimization-types';

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  progress,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const progressText = progress < 100 
    ? `Оптимизация сайта ${url} (${Math.round(progress)}%)` 
    : `Оптимизация сайта ${url} завершена`;

  // Определение этапов оптимизации
  const stages = [
    { name: "Анализ структуры сайта", threshold: 20 },
    { name: "Оптимизация мета-тегов", threshold: 40 },
    { name: "Оптимизация контента", threshold: 60 },
    { name: "Оптимизация изображений", threshold: 80 },
    { name: "Финальные улучшения", threshold: 95 },
    { name: "Готово", threshold: 100 }
  ];

  // Определение текущего этапа
  const currentStage = stages.find(stage => progress < stage.threshold) || stages[stages.length - 1];
  
  // Эффект анимации для прогресс-бара
  const progressBarVariants = {
    initial: { width: 0 },
    animate: { width: `${progress}%` }
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            {progress < 100 ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-green-500 mr-2" />
            )}
            <span className="font-medium">{progressText}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Текущий этап: {currentStage.name}
          </span>
        </div>
        
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial="initial"
            animate="animate"
            variants={progressBarVariants}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="mt-6 space-y-2">
          {stages.map((stage, index) => {
            const isCompleted = progress >= stage.threshold;
            const isCurrent = currentStage.name === stage.name;
            
            return (
              <div 
                key={index}
                className={`flex items-center p-2 rounded ${
                  isCompleted ? 'bg-primary/10' : isCurrent ? 'bg-muted' : ''
                }`}
              >
                <div className={`h-3 w-3 rounded-full mr-3 ${
                  isCompleted ? 'bg-green-500' : isCurrent ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
                <span className={isCompleted ? 'text-foreground' : isCurrent ? 'text-foreground' : 'text-muted-foreground'}>
                  {stage.name}
                </span>
                {isCompleted && <span className="ml-auto text-xs text-green-500">Завершено</span>}
                {isCurrent && !isCompleted && <span className="ml-auto text-xs text-primary animate-pulse">В процессе</span>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationProcessContainer;
