
import React from 'react';
import PaymentDialog from './PaymentDialog';

interface OptimizationActionsProps {
  url: string;
  /** Аудит, к которому относится смета: без него заявка на счёт уходит без привязки. */
  taskId?: string | null;
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
  taskId,
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
          <button 
            onClick={onDownloadOptimized} 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Скачать оптимизированный сайт
          </button>
          
          <button 
            className="border border-primary px-4 py-2 rounded hover:bg-primary/10" 
            onClick={onGeneratePdfReport}
          >
            Скачать PDF отчет
          </button>
        </>
      ) : isPaymentComplete ? (
        <button 
          onClick={onStartOptimization}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Запустить оптимизацию
        </button>
      ) : (
        <>
          <button 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90" 
            onClick={() => setIsDialogOpen(true)}
          >
            Оплатить и оптимизировать
          </button>
          
          <PaymentDialog 
            isDialogOpen={isDialogOpen} 
            setIsDialogOpen={setIsDialogOpen}
            onPayment={onPayment}
            optimizationCost={optimizationCost}
            url={url}
            taskId={taskId}
          />
        </>
      )}
    </div>
  );
};

export default OptimizationActions;
