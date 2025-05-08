import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import OptimizationProgress from '../OptimizationProgress';
import OptimizationDemo from '../OptimizationDemo';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import OptimizationActions from './OptimizationActions';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationResultsProps {
  url: string;
  optimizationResult: {
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
  } | null;
  onDownloadOptimized?: () => void;
  onGeneratePdfReport?: () => void;
  className?: string;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  url,
  optimizationResult,
  onDownloadOptimized,
  onGeneratePdfReport,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  if (!optimizationResult) return null;
  
  // Dummy handlers for required props
  const handlePayment = () => {
    // This function is required but won't be used
    console.log("Payment handler called");
  };
  
  const handleStartOptimization = () => {
    // This function is required but won't be used
    console.log("Start optimization handler called");
  };
  
  return (
    <div className={className}>
      <OptimizationDemo
        beforeTitle={optimizationResult.demoPage?.title || ''}
        afterTitle={optimizationResult.demoPage?.title || ''}
        beforeContent={optimizationResult.demoPage?.content || ''}
        afterContent={optimizationResult.demoPage?.optimized?.content || ''}
        beforeMeta={optimizationResult.demoPage?.meta}
        afterMeta={optimizationResult.demoPage?.optimized?.meta}
        beforeScore={optimizationResult.beforeScore}
        afterScore={optimizationResult.afterScore}
        className="mt-6 mb-4"
      />
      
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <OptimizationSummary url={url} />
        
        <div className="flex gap-2">
          {onGeneratePdfReport && (
            <OptimizationActions
              url={url} 
              optimizationCost={0} // Providing default value
              isOptimized={true}
              isPaymentComplete={true} // Since optimization is complete
              onDownloadOptimized={onDownloadOptimized}
              onGeneratePdfReport={onGeneratePdfReport}
              onStartOptimization={handleStartOptimization}
              onPayment={handlePayment}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizationResults;
