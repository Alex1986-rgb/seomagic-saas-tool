
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

  // Legacy props for backwards compatibility
  beforeTitle?: string;
  afterTitle?: string;
  beforeContent?: string;
  afterContent?: string;
  beforeMeta?: { description?: string; keywords?: string };
  afterMeta?: { description?: string; keywords?: string };
  beforeScore?: number;
  afterScore?: number;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  url,
  optimizationResult,
  onDownloadOptimized,
  onGeneratePdfReport,
  className,
  // Legacy props
  beforeTitle,
  afterTitle,
  beforeContent,
  afterContent,
  beforeMeta,
  afterMeta,
  beforeScore,
  afterScore
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check if we have legacy props and construct optimizationResult from them
  let finalOptimizationResult = optimizationResult;
  
  if (beforeScore !== undefined && afterScore !== undefined) {
    finalOptimizationResult = {
      beforeScore,
      afterScore,
      demoPage: {
        title: beforeTitle || "",
        content: beforeContent || "",
        meta: beforeMeta,
        optimized: {
          content: afterContent || "",
          meta: afterMeta,
        },
      }
    };
  }

  if (!finalOptimizationResult) return null;

  const { beforeScore: finalBeforeScore, afterScore: finalAfterScore, demoPage } = finalOptimizationResult;
  const scoreIncrease = finalAfterScore - finalBeforeScore;
  
  return (
    <div className={`border border-green-500/20 rounded-lg p-4 bg-green-50/10 ${className || ''}`}>
      <h4 className="font-semibold text-green-700 mb-2">Оптимизация завершена!</h4>
      
      <div className="flex gap-8 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Было</p>
          <p className="text-xl font-semibold">{finalBeforeScore}/100</p>
        </div>
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Стало</p>
          <p className="text-xl font-semibold text-green-600">{finalAfterScore}/100</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-green-600">+{scoreIncrease} баллов</p>
        </div>
      </div>
      
      {demoPage && (
        <div className="mb-4 p-3 bg-background border rounded-md text-sm">
          <p className="font-semibold">{demoPage.title} - пример оптимизации:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">До оптимизации:</p>
              <p className="line-clamp-3">{demoPage.content}</p>
            </div>
            <div>
              <p className="text-xs text-green-600">После оптимизации:</p>
              <p className="line-clamp-3">{demoPage.optimized?.content}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={onDownloadOptimized}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Скачать оптимизированный сайт
        </button>
        <button 
          onClick={onGeneratePdfReport}
          className="border border-primary px-4 py-2 rounded hover:bg-primary/10"
        >
          Скачать PDF-отчет
        </button>
      </div>
    </div>
  );
};

export default OptimizationResults;
