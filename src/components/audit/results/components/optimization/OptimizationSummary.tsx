
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OptimizationSummaryProps {
  url: string;
}

const OptimizationSummary: React.FC<OptimizationSummaryProps> = ({ url }) => {
  return (
    <div className="text-sm text-muted-foreground">
      Полная оптимизация SEO для {url} включает исправление всех ошибок
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 inline-block ml-1 cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Включает оптимизацию мета-тегов, заголовков, изображений, 
              исправление дублей, оптимизацию URL, создание SEO-описаний
              и переписывание контента согласно SEO-правилам
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default OptimizationSummary;
