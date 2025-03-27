
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface OrderDialogProps {
  open: boolean;
  orderType: 'audit' | 'position' | 'optimization';
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

const OrderDialog: React.FC<OrderDialogProps> = ({ 
  open, 
  orderType, 
  onOpenChange, 
  onSubmit 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {orderType === 'audit' ? 'Заказ аудита сайта' : 
             orderType === 'position' ? 'Заказ проверки позиций' : 
             'Заказ оптимизации сайта'}
          </DialogTitle>
          <DialogDescription>
            Заполните форму для оформления заказа на 
            {orderType === 'audit' ? ' SEO аудит вашего сайта' : 
             orderType === 'position' ? ' проверку позиций сайта в поисковых системах' : 
             ' комплексную оптимизацию вашего сайта'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="font-medium">Выбранный сайт:</div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>example.com</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <div className="font-medium">Тариф:</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer bg-primary/5">
                <div className="font-medium">Базовый</div>
                <div className="text-sm text-muted-foreground">
                  {orderType === 'audit' ? '5,900₽' : 
                   orderType === 'position' ? '2,900₽' : 
                   '19,900₽'}
                </div>
              </div>
              <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer hover:bg-muted/50">
                <div className="font-medium">Расширенный</div>
                <div className="text-sm text-muted-foreground">
                  {orderType === 'audit' ? '11,900₽' : 
                   orderType === 'position' ? '5,900₽' : 
                   '39,900₽'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
          <Button onClick={onSubmit}>Оформить заказ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
