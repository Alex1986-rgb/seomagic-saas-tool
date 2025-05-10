
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
    <div className="my-4 p-3 bg-muted/30 rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Сайт для оптимизации:</span> {url}
      </div>
      <div className="text-sm mt-1 text-muted-foreground flex items-center gap-1">
        <span>Выберите подходящий тарифный план в зависимости от размера сайта. Чем больше страниц, тем выше скидка на оптимизацию.</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                До 3 страниц - без скидки<br />
                До 50 страниц - скидка 20%<br />
                До 500 страниц - скидка 50%<br />
                От 1000 страниц - скидка 80%
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default OptimizationSummary;
