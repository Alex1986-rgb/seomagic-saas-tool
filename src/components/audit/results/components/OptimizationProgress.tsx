
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface OptimizationProgressProps {
  progress: number;
  stage: string;
  className?: string;
}

const OptimizationProgress: React.FC<OptimizationProgressProps> = ({
  progress,
  stage,
  className
}) => {
  return (
    <div className={`bg-card p-4 rounded-lg border border-border ${className || ''}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Оптимизация сайта</h3>
        <div className="flex items-center text-primary">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
        </div>
      </div>
      
      <Progress value={progress} className="h-2 mb-3" />
      
      <p className="text-sm text-muted-foreground">{stage}</p>
    </div>
  );
};

export default OptimizationProgress;
