
import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationCostProps {
  url: string;
  optimizationCost: number;
  pageCount: number;
  optimizationItems?: OptimizationItem[];
}

const OptimizationCost: React.FC<OptimizationCostProps> = ({ 
  url, 
  optimizationCost,
  pageCount,
  optimizationItems = []
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-card rounded-lg border p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <OptimizationHeading />
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <MinusCircle className="h-3.5 w-3.5" />
              Скрыть детали
            </>
          ) : (
            <>
              <PlusCircle className="h-3.5 w-3.5" />
              Показать детали
            </>
          )}
        </Button>
      </div>
      
      <OptimizationSummary url={url} />
      
      <CostSummary
        pageCount={pageCount}
        optimizationCost={optimizationCost}
      />
      
      {showDetails && optimizationItems && optimizationItems.length > 0 && (
        <CostDetailsTable items={optimizationItems} />
      )}
    </div>
  );
};

export default OptimizationCost;
