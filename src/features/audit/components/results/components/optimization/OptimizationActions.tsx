
import React from 'react';
import { Button } from "@/components/ui/button";
import PaymentDialog from './PaymentDialog';

interface OptimizationActionsProps {
  url: string;
  optimizationCost: number;
  isOptimized: boolean;
  isPaymentComplete: boolean;
  onDownloadOptimized?: () => void;
  onGeneratePdfReport?: () => void;
  onStartOptimization: () => void;
  onPayment: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const OptimizationActions: React.FC<OptimizationActionsProps> = ({
  url,
  optimizationCost,
  isOptimized,
  isPaymentComplete,
  onDownloadOptimized,
  onGeneratePdfReport,
  onStartOptimization,
  onPayment,
  isDialogOpen,
  setIsDialogOpen
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {isOptimized ? (
        <>
          <Button 
            onClick={onDownloadOptimized} 
            variant="default"
          >
            Скачать оптимизированный сайт
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onGeneratePdfReport}
          >
            Скачать PDF отчет
          </Button>
        </>
      ) : isPaymentComplete ? (
        <Button 
          onClick={onStartOptimization}
          variant="default"
        >
          Запустить оптимизацию
        </Button>
      ) : (
        <>
          <Button 
            variant="default" 
            onClick={() => setIsDialogOpen(true)}
          >
            Оплатить и оптимизировать
          </Button>
          
          <PaymentDialog 
            isOpen={isDialogOpen} 
            onClose={() => setIsDialogOpen(false)}
            onPayment={onPayment}
            cost={optimizationCost}
            url={url}
          />
        </>
      )}
    </div>
  );
};

export default OptimizationActions;
