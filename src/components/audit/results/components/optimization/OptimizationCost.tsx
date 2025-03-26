
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import CostSummary from './CostSummary';
import CostDetailsTable, { OptimizationItem } from './CostDetailsTable';
import OptimizationActions from './OptimizationActions';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import OptimizationProcess from './OptimizationProcess';
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
  const { toast } = useToast();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [localIsOptimized, setLocalIsOptimized] = useState(isOptimized);
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
      
      {isOptimizing && (
        <OptimizationProcess 
          url={url}
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
    </motion.div>
  );
};

export default OptimizationCost;
