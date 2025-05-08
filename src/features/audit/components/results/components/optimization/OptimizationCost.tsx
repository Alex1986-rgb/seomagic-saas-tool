
import React, { useState, useEffect } from 'react';
import CostSummary from './CostSummary';
import CostDetailsTable, { OptimizationItem } from './CostDetailsTable';
import OptimizationActions from './OptimizationActions';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import OptimizationProcessContainer from './process/OptimizationProcessContainer';
import OptimizationResults from './OptimizationResults';

interface OptimizationCostProps {
  optimizationCost?: number;
  pageCount: number;
  url: string;
  onDownloadOptimized?: () => void;
  isOptimized?: boolean;
  className?: string;
  optimizationItems?: OptimizationItem[];
  onGeneratePdfReport?: () => void;
}

const OptimizationCost: React.FC<OptimizationCostProps> = ({
  optimizationCost,
  pageCount,
  url,
  onDownloadOptimized,
  isOptimized = false,
  className,
  optimizationItems = [],
  onGeneratePdfReport
}) => {
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<{
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
  } | null>(null);
  
  const isOptimizedState = isOptimized || localIsOptimized;
  
  // Effect to update optimization progress simulation
  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;
    
    if (isOptimizing && !isOptimizedState && optimizationProgress < 100) {
      progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + (Math.random() * 2);
          if (newProgress >= 100) {
            if (progressInterval) clearInterval(progressInterval);
            setTimeout(() => {
              setLocalIsOptimized(true);
              setOptimizationProgress(100);
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
            return 100;
          }
          return newProgress;
        });
      }, 200);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isOptimizing, isOptimizedState, optimizationProgress]);
  
  const handlePayment = () => {
    console.log("Payment completed");
    setIsPaymentComplete(true);
    setIsDialogOpen(false);
  };
  
  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
  };
  
  if (!optimizationCost) return null;
  
  return (
    <div className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}>
      <OptimizationHeading />
      
      <CostSummary pageCount={pageCount} optimizationCost={optimizationCost} />
      
      <CostDetailsTable optimizationItems={optimizationItems} />
      
      {isOptimizing && !isOptimizedState && (
        <OptimizationProcessContainer 
          url={url}
          progress={optimizationProgress}
          setOptimizationResult={setOptimizationResult}
          setLocalIsOptimized={setLocalIsOptimized}
        />
      )}
      
      {optimizationResult && (
        <OptimizationResults 
          url={url}
          optimizationResult={optimizationResult}
          onDownloadOptimized={onDownloadOptimized}
          onGeneratePdfReport={onGeneratePdfReport}
          className="mt-4"
        />
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <OptimizationSummary url={url} />
        
        <OptimizationActions 
          url={url}
          optimizationCost={optimizationCost}
          isOptimized={isOptimizedState}
          isPaymentComplete={isPaymentComplete}
          onDownloadOptimized={onDownloadOptimized}
          onGeneratePdfReport={onGeneratePdfReport}
          onStartOptimization={startOptimization}
          onPayment={handlePayment}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
    </div>
  );
};

export default OptimizationCost;
