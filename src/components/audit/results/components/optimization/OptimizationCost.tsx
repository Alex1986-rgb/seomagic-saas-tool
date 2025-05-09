
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import OptimizationActions from './OptimizationActions';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import OptimizationProcessContainer from './process/OptimizationProcessContainer';
import OptimizationResults from './OptimizationResults';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationCostProps {
  optimizationCost?: number;
  pageCount: number;
  url: string;
  onDownloadOptimized?: () => void;
  isOptimized?: boolean;
  className?: string;
  optimizationItems?: OptimizationItem[];
  onGeneratePdfReport?: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

const OptimizationCost: React.FC<OptimizationCostProps> = ({
  optimizationCost,
  pageCount,
  url,
  onDownloadOptimized,
  isOptimized = false,
  className,
  optimizationItems = [],
  onGeneratePdfReport,
  onSelectPrompt
}) => {
  const { toast } = useToast();
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
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  
  const isOptimizedState = isOptimized || localIsOptimized;
  
  // Effect to update optimization progress simulation
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isOptimizing && !isOptimizedState && optimizationProgress < 100) {
      progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
          const newProgress = prev + (Math.random() * 2);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
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
              
              toast({
                title: "Оптимизация завершена",
                description: "Сайт был успешно оптимизирован для SEO",
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
  }, [isOptimizing, isOptimizedState, optimizationProgress, toast]);
  
  const handlePayment = () => {
    toast({
      title: "Оплата успешно произведена",
      description: "Теперь вы можете запустить процесс оптимизации",
    });
    
    setIsPaymentComplete(true);
    setIsDialogOpen(false);
  };
  
  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    toast({
      title: "Оптимизация начата",
      description: selectedPrompt 
        ? "Процесс оптимизации сайта запущен с выбранными параметрами" 
        : "Процесс оптимизации сайта запущен",
    });
  };
  
  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
    
    toast({
      title: "Шаблон выбран",
      description: "Параметры оптимизации установлены",
    });
  };
  
  if (!optimizationCost) return null;
  
  return (
    <motion.div 
      className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          onSelectPrompt={handleSelectPrompt}
        />
      </div>
    </motion.div>
  );
};

export default OptimizationCost;
