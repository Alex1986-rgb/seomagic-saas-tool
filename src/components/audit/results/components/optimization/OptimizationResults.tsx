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
      {/* Вместо OptimizationDemo просто краткое summary */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold">{optimizationResult.demoPage?.title || 'Демо-страница'}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">До оптимизации:</div>
            <div>{optimizationResult.demoPage?.content || ''}</div>
          </div>
          <div>
            <div className="text-green-600 text-xs mb-1">После оптимизации:</div>
            <div>{optimizationResult.demoPage?.optimized?.content || ''}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <OptimizationSummary url={url} />
        <div className="flex gap-2">
          {onGeneratePdfReport && (
            <OptimizationActions
              url={url}
              optimizationCost={0}
              isOptimized={true}
              isPaymentComplete={true}
              onDownloadOptimized={onDownloadOptimized}
              onGeneratePdfReport={onGeneratePdfReport}
              onStartOptimization={() => {}}
              onPayment={() => {}}
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
