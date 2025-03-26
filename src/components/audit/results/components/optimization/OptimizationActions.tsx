
import React from 'react';
import { Download, FileText, Play } from 'lucide-react';
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
    <div className="flex gap-2">
      {onGeneratePdfReport && (
        <Button 
          onClick={onGeneratePdfReport}
          className="gap-2"
          variant="outline"
        >
          <FileText className="h-4 w-4" />
          Скачать PDF отчет
        </Button>
      )}
      
      {isOptimized ? (
        <Button 
          onClick={onDownloadOptimized}
          className="gap-2"
          variant="default"
        >
          <Download className="h-4 w-4" />
          Скачать оптимизированный сайт
        </Button>
      ) : isPaymentComplete ? (
        <Button 
          onClick={onStartOptimization}
          className="gap-2"
          variant="default"
        >
          <Play className="h-4 w-4" />
          Запустить оптимизацию
        </Button>
      ) : (
        <PaymentDialog
          url={url}
          optimizationCost={optimizationCost}
          onPayment={onPayment}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
    </div>
  );
};

export default OptimizationActions;
