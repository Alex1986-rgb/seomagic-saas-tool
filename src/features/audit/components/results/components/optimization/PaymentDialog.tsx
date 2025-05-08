
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';

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
  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="gap-2"
        variant="default"
      >
        <CreditCard className="h-4 w-4" />
        Оплатить и оптимизировать
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Оплата оптимизации</DialogTitle>
            <DialogDescription>
              Оплата оптимизации сайта {url}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Стоимость оптимизации:</span>
                  <span className="font-bold text-xl">{optimizationCost} ₽</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Оплачивая эту услугу, вы получаете полную SEO-оптимизацию вашего сайта.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="card-number" className="block text-sm font-medium">
                  Номер карты
                </label>
                <input 
                  id="card-number" 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiry" className="block text-sm font-medium">
                    Срок действия
                  </label>
                  <input 
                    id="expiry" 
                    type="text" 
                    placeholder="ММ/ГГ"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cvc" className="block text-sm font-medium">
                    CVC
                  </label>
                  <input 
                    id="cvc" 
                    type="text" 
                    placeholder="123"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={onPayment}>
              Оплатить {optimizationCost} ₽
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentDialog;
