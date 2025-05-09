
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OptimizationCost from './optimization/OptimizationCost';
import OptimizationProcessContainer from './optimization/process/OptimizationProcessContainer';
import OptimizationResults from './optimization/OptimizationResults';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface AuditOptimizationSectionProps {
  optimizationCost: number;
  optimizationItems: OptimizationItem[];
  isOptimized: boolean;
  contentPrompt: string;
  url: string;
  pageCount: number;
  showPrompt: boolean;
  onTogglePrompt: () => void;
  onOptimize: () => Promise<any>;
  onDownloadOptimizedSite: () => Promise<void>;
  onGeneratePdfReport: () => void;
  setContentOptimizationPrompt: (prompt: string) => void;
}

const AuditOptimizationSection: React.FC<AuditOptimizationSectionProps> = ({
  optimizationCost,
  optimizationItems,
  isOptimized,
  contentPrompt,
  url,
  pageCount,
  showPrompt,
  onTogglePrompt,
  onOptimize,
  onDownloadOptimizedSite,
  onGeneratePdfReport,
  setContentOptimizationPrompt,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  // Demo result for visualization
  const demoResult = {
    beforeScore: 65,
    afterScore: 89,
    demoPage: {
      title: "Главная страница",
      content: "Добро пожаловать на наш сайт. Мы предлагаем лучшие решения для вашего бизнеса.",
      meta: {
        description: "Компания предлагающая услуги по оптимизации сайтов.",
        keywords: "оптимизация, сайт, SEO"
      },
      optimized: {
        content: "Добро пожаловать на наш сайт! Мы специализируемся на высококачественных решениях для развития вашего бизнеса в цифровой среде. Наши эксперты помогут достичь максимальных результатов.",
        meta: {
          description: "Профессиональные услуги по оптимизации и продвижению сайтов. Увеличим конверсию и привлечем целевых клиентов.",
          keywords: "оптимизация сайта, SEO продвижение, улучшение конверсии, аудит сайта"
        }
      }
    }
  };

  const handlePayment = () => {
    setIsPaymentComplete(true);
    setIsDialogOpen(false);
  };

  const handleStartOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    const intervalId = setInterval(() => {
      setOptimizationProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setTimeout(() => {
            setIsOptimizing(false);
            setOptimizationResult(demoResult);
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    
    try {
      await onOptimize();
    } catch (error) {
      console.error("Error during optimization:", error);
      clearInterval(intervalId);
      setIsOptimizing(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    if (setContentOptimizationPrompt) {
      setContentOptimizationPrompt(prompt);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <h2 className="text-xl font-semibold mb-4">Оптимизация сайта</h2>
      
      {!isOptimized && !isOptimizing && (
        <OptimizationCost 
          url={url} 
          optimizationCost={optimizationCost}
          pageCount={pageCount}
          optimizationItems={optimizationItems}
        />
      )}
      
      {isOptimizing && (
        <OptimizationProcessContainer 
          progress={optimizationProgress} 
        />
      )}
      
      {(isOptimized || optimizationResult) && (
        <OptimizationResults 
          url={url}
          optimizationResult={optimizationResult || demoResult}
          onDownloadOptimized={onDownloadOptimizedSite}
          onGeneratePdfReport={onGeneratePdfReport}
          className="mb-4"
        />
      )}
      
      {!isOptimizing && !optimizationResult && (
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
          <div></div>
          <div>
            {/* Pass all required props to OptimizationActions */}
            <OptimizationActions 
              url={url}
              optimizationCost={optimizationCost}
              isOptimized={isOptimized}
              isPaymentComplete={isPaymentComplete}
              onDownloadOptimized={onDownloadOptimizedSite}
              onGeneratePdfReport={onGeneratePdfReport}
              onStartOptimization={handleStartOptimization}
              onPayment={handlePayment}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onSelectPrompt={handleSelectPrompt}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuditOptimizationSection;
