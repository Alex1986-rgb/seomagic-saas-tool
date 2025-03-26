
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import OptimizationProgress from '../../OptimizationProgress';
import { runOptimizationSimulation } from './optimizationSimulation';

interface OptimizationProcessContainerProps {
  url: string;
  setOptimizationResult: (result: {
    beforeScore: number;
    afterScore: number;
    demoPage?: {
      title: string;
      content: string;
      meta?: {
        description?: string;
        keywords?: string;
      };
      optimized?: {
        content: string;
        meta?: {
          description?: string;
          keywords?: string;
        };
      };
    };
  } | null) => void;
  setLocalIsOptimized: (value: boolean) => void;
}

const OptimizationProcessContainer: React.FC<OptimizationProcessContainerProps> = ({
  url,
  setOptimizationResult,
  setLocalIsOptimized
}) => {
  const { toast } = useToast();
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationStage, setOptimizationStage] = useState('Начало процесса оптимизации...');

  useEffect(() => {
    const runOptimization = async () => {
      const result = await runOptimizationSimulation({
        url,
        onProgressUpdate: (progress: number, stage: string) => {
          setOptimizationProgress(progress);
          setOptimizationStage(stage);
        }
      });
      
      setOptimizationResult(result);
      setLocalIsOptimized(true);
      
      toast({
        title: "Оптимизация завершена",
        description: `Сайт успешно оптимизирован! Оценка SEO повышена с ${result.beforeScore} до ${result.afterScore} баллов.`,
      });
    };
    
    runOptimization();
  }, [url, setOptimizationResult, setLocalIsOptimized, toast]);

  return (
    <OptimizationProgress 
      progress={optimizationProgress} 
      stage={optimizationStage} 
      className="mt-4 mb-4"
    />
  );
};

export default OptimizationProcessContainer;
