
import React, { useState } from 'react';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const { toast } = useToast();
  
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
      
      toast({
        title: "Оплата прошла успешно",
        description: "Ваш платеж был обработан, оптимизация будет запущена.",
        variant: "default",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка платежа",
        description: "Не удалось обработать платеж. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">Оплатить и оптимизировать</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95%]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">Оплата оптимизации</DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Оптимизация сайта {url} будет выполнена после оплаты
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-primary/10 p-4">
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
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Исправление технических проблем
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Удаление дублей и создание уникального контента
              </li>
            </ul>
          </div>
          
          <div className="flex justify-between items-center p-3 border border-primary/30 rounded-lg">
            <span className="font-medium">Итого к оплате:</span>
            <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handlePayment} className="gap-2" disabled={isProcessing}>
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
