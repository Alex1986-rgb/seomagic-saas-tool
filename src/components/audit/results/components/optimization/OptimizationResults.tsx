
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

interface DemoPage {
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
}

interface OptimizationResultsProps {
  url?: string;
  optimizationResult?: {
    beforeScore: number;
    afterScore: number;
    demoPage?: DemoPage;
  } | null;
  onDownloadOptimized?: () => void;
  onGeneratePdfReport?: () => void;
  className?: string;

  // Legacy props for backwards compatibility - all required to match the calling component
  beforeTitle?: string;
  afterTitle?: string;
  beforeContent?: string;
  afterContent?: string;
  beforeMeta?: { description?: string; keywords?: string };
  afterMeta?: { description?: string; keywords?: string };
  beforeScore?: number;
  afterScore?: number;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if we have legacy props and construct optimizationResult from them
  let optimizationResult = props.optimizationResult;
  
  if (props.beforeScore !== undefined && props.afterScore !== undefined) {
    optimizationResult = {
      beforeScore: props.beforeScore,
      afterScore: props.afterScore,
      demoPage: {
        title: props.beforeTitle || "",
        content: props.beforeContent || "",
        meta: props.beforeMeta,
        optimized: {
          content: props.afterContent || "",
          meta: props.afterMeta,
        },
      }
    };
  }

  if (!optimizationResult) return null;

  // Dummy handlers for required props
  const handlePayment = () => {
    console.log("Payment handler called");
  };
  
  const handleStartOptimization = () => {
    console.log("Start optimization handler called");
  };
  
  return (
    <div className={props.className}>
      {/* Simple summary instead of OptimizationDemo */}
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
        <OptimizationSummary url={props.url || ''} />
        <div className="flex gap-2">
          {props.onGeneratePdfReport && (
            <OptimizationActions
              url={props.url || ''}
              optimizationCost={0}
              isOptimized={true}
              isPaymentComplete={true}
              onDownloadOptimized={props.onDownloadOptimized}
              onGeneratePdfReport={props.onGeneratePdfReport}
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
