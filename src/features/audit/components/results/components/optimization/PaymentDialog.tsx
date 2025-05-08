
import React, { useState } from 'react';
import { Check, CreditCard, Loader2 } from 'lucide-react';

interface PaymentDialogProps {
  url: string;
  optimizationCost: number;
  onPayment: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  url, 
  optimizationCost, 
  onPayment, 
  isDialogOpen, 
  setIsDialogOpen 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the payment callback
      onPayment();
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Оплата оптимизации</h2>
          <p className="text-muted-foreground mt-1">
            Оптимизация сайта {url} будет выполнена после оплаты
          </p>
        </div>
        
        <div className="mt-4 rounded-lg bg-primary/10 p-4">
          <h4 className="font-medium mb-2 text-center">Что включено:</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Оптимизация всех мета-тегов
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Исправление проблем с изображениями
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Оптимизация контента для SEO
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              Улучшение скорости загрузки
            </li>
          </ul>
        </div>
        
        <div className="flex justify-between items-center p-3 border border-primary/30 mt-4 rounded-lg">
          <span className="font-medium">Итого к оплате:</span>
          <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
        </div>
        
        <div className="flex justify-between mt-6 gap-3">
          <button
            onClick={() => setIsDialogOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Оплатить
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;
