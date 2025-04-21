
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OptimizationProcessStage {
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

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
  const [stages, setStages] = useState<OptimizationProcessStage[]>([
    { name: 'Анализ страниц', description: 'Сканирование структуры сайта, анализ контента и мета-тегов', status: 'pending' },
    { name: 'Оптимизация мета-тегов', description: 'Улучшение title, description и других мета-тегов', status: 'pending' },
    { name: 'Улучшение контента', description: 'Оптимизация текстов, заголовков и ключевых слов', status: 'pending' },
    { name: 'Оптимизация изображений', description: 'Сжатие и переименование изображений, добавление alt-тегов', status: 'pending' },
    { name: 'Применение изменений', description: 'Компиляция оптимизированной версии сайта', status: 'pending' }
  ]);
  const { toast } = useToast();
  
  // Update the current stage and stage statuses based on progress
  useEffect(() => {
    let activeStageIndex = 0;
    
    if (progress < 20) {
      activeStageIndex = 0;
      setCurrentStage('Анализ страниц');
    } else if (progress < 40) {
      activeStageIndex = 1;
      setCurrentStage('Оптимизация мета-тегов');
    } else if (progress < 60) {
      activeStageIndex = 2;
      setCurrentStage('Улучшение контента');
    } else if (progress < 80) {
      activeStageIndex = 3;
      setCurrentStage('Оптимизация изображений');
    } else {
      activeStageIndex = 4;
      setCurrentStage('Применение изменений');
    }
    
    // Update stage statuses based on active stage
    setStages(prevStages => 
      prevStages.map((stage, index) => ({
        ...stage,
        status: index < activeStageIndex 
          ? 'completed' 
          : index === activeStageIndex 
            ? 'active' 
            : 'pending'
      }))
    );
    
    // Notify about stage changes
    if (progress > 0 && progress <= 100 && activeStageIndex > 0 && stages[activeStageIndex].status !== 'active') {
      toast({
        title: `Этап завершен: ${stages[activeStageIndex-1].name}`,
        description: `Переходим к этапу: ${stages[activeStageIndex].name}`,
        variant: "default",
      });
    }
    
  }, [progress, toast, stages]);
  
  const getStageIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'active':
        return <Loader2 className="animate-spin h-4 w-4 text-primary" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border border-muted-foreground/30"></div>;
    }
  };
  
  return (
    <div className="my-6 p-6 border border-primary/20 rounded-lg bg-background/50">
      <div className="flex items-center gap-2 mb-4">
        <Loader2 className="animate-spin h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Оптимизация сайта {url}</h3>
      </div>
      
      <div className="relative mb-2">
        <Progress value={progress} className="h-3 mb-2" />
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1 pointer-events-none">
          {stages.map((_, index) => (
            <div 
              key={index} 
              className={`h-3 w-0.5 ${index === 0 || index === stages.length - 1 ? 'opacity-0' : 'bg-background/30'}`}
              style={{ left: `${(index + 1) * (100 / stages.length)}%` }}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="font-medium text-primary">{currentStage}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="space-y-3 mt-4 max-h-60 overflow-y-auto pr-2">
        {stages.map((stage, index) => (
          <div 
            key={index}
            className={`p-3 border rounded-md transition-colors ${
              stage.status === 'active' ? 'border-primary/50 bg-primary/5' : 
              stage.status === 'completed' ? 'border-green-500/20 bg-green-500/5' : 'border-muted'
            }`}
          >
            <div className="flex items-center gap-2">
              {getStageIcon(stage.status)}
              <h4 className={`font-medium ${stage.status === 'active' ? 'text-primary' : ''}`}>{stage.name}</h4>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">{stage.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
        <AlertCircle className="h-3 w-3" />
        Пожалуйста, не закрывайте страницу во время оптимизации. 
        Процесс может занять до 5 минут в зависимости от размера сайта.
      </div>
      
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-muted-foreground">Начало: {new Date().toLocaleTimeString()}</span>
        <span className="text-muted-foreground">
          Ожидаемое время окончания: {new Date(Date.now() + (100 - progress) * 3000).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default OptimizationProcessContainer;
