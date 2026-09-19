
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Bot, Receipt, CheckCircle } from 'lucide-react';
import PaymentDialog from './PaymentDialog';

interface OptimizationActionsProps {
  url: string;
  /** Аудит, к которому относится смета: уходит в заявку на счёт. */
  taskId?: string | null;
  optimizationCost: number;
  isOptimized: boolean;
  /** Заявка на счёт уже отправлена. */
  isInvoiceRequested: boolean;
  /** Оптимизация идёт — повторно запускать нельзя. */
  isOptimizing?: boolean;
  onDownloadOptimized?: () => void;
  onGeneratePdfReport?: () => void;
  /** Запуск оптимизации. Нет обработчика — нет и кнопки. */
  onStartOptimization?: () => void;
  /** Заявка на счёт принята. */
  onInvoiceRequested: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSelectPrompt?: (prompt: string) => void;
}

/**
 * Кнопки раздела оптимизации.
 *
 * Раньше запуск был спрятан за «оплатой»: кнопка «Заказать оптимизацию»
 * открывала окно заявки на счёт, а после заявки работа запускалась сама —
 * без счёта и без оплаты, хотя окно обещало сначала прислать счёт. Теперь это
 * два отдельных действия: заявка на счёт только оставляет заявку, а
 * оптимизация запускается своей кнопкой.
 */
export const OptimizationActions: React.FC<OptimizationActionsProps> = ({
  url,
  taskId,
  optimizationCost,
  isOptimized,
  isInvoiceRequested,
  isOptimizing = false,
  onDownloadOptimized,
  onGeneratePdfReport,
  onStartOptimization,
  onInvoiceRequested,
  isDialogOpen,
  setIsDialogOpen,
  onSelectPrompt
}) => {
  const handleOpenInvoiceDialog = () => {
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

        {!isOptimized && onStartOptimization && (
          <Button
            onClick={onStartOptimization}
            variant="default"
            className="gap-2"
            disabled={isOptimizing}
          >
            <Bot className="h-4 w-4" />
            {isOptimizing ? 'Оптимизация идёт…' : 'Запустить оптимизацию'}
          </Button>
        )}

        {optimizationCost > 0 && (
          isInvoiceRequested ? (
            <Button variant="outline" className="gap-2" disabled>
              <CheckCircle className="h-4 w-4" />
              Счёт запрошен
            </Button>
          ) : (
            <Button
              onClick={handleOpenInvoiceDialog}
              variant="outline"
              className="gap-2"
            >
              <Receipt className="h-4 w-4" />
              Запросить счёт
            </Button>
          )
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
        taskId={taskId}
        optimizationCost={optimizationCost}
        onPayment={onInvoiceRequested}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onSelectPrompt={onSelectPrompt}
      />
    </>
  );
};

export default OptimizationActions;
