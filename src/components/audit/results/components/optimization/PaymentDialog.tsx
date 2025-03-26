
import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">Оплатить и оптимизировать</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оплата оптимизации</DialogTitle>
          <DialogDescription>
            Оптимизация сайта {url} будет выполнена после оплаты
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-lg bg-primary/10 p-4">
            <h4 className="font-medium mb-2">Что включено:</h4>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Оптимизация всех мета-тегов
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Исправление проблем с изображениями
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Оптимизация контента для SEO
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Улучшение скорости загрузки
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Исправление технических проблем
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Удаление дублей и создание уникального контента
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Исправление URL (замена подчеркиваний на дефисы)
              </li>
            </ul>
          </div>
          
          <div className="flex justify-between items-center p-3 border border-border rounded-lg">
            <span className="font-medium">Итого к оплате:</span>
            <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Отмена
          </Button>
          <Button onClick={onPayment} className="gap-2">
            <CreditCard className="h-4 w-4" />
            Оплатить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
