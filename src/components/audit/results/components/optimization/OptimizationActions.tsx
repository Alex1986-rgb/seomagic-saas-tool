
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Bot, CreditCard } from 'lucide-react';
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
  onSelectPrompt?: (prompt: string) => void;
}

export const OptimizationActions: React.FC<OptimizationActionsProps> = ({
  url,
  optimizationCost,
  isOptimized,
  isPaymentComplete,
  onDownloadOptimized,
  onGeneratePdfReport,
  onStartOptimization,
  onPayment,
  isDialogOpen,
  setIsDialogOpen,
  onSelectPrompt
}) => {
  const handleOpenPaymentDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        {isOptimized && onDownloadOptimized && (
          <Button
            onClick={onDownloadOptimized}
            variant="default"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Скачать оптимизированный сайт
          </Button>
        )}
        
        {!isOptimized && isPaymentComplete && (
          <Button
            onClick={onStartOptimization}
            variant="default"
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            Запустить оптимизацию
          </Button>
        )}
        
        {!isOptimized && !isPaymentComplete && (
          <Button
            onClick={handleOpenPaymentDialog}
            variant="default"
            className="gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Заказать оптимизацию
          </Button>
        )}

        {onGeneratePdfReport && (
          <Button
            onClick={onGeneratePdfReport}
            variant="outline"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Скачать PDF отчет
          </Button>
        )}
      </div>

      <PaymentDialog
        url={url}
        optimizationCost={optimizationCost}
        onPayment={onPayment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSelectPrompt={onSelectPrompt}
      />
    </>
  );
};

export default OptimizationActions;
