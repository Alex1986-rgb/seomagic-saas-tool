
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { PaymentMethodSelector, PaymentDetailsFields } from './CurrentSubscription';
import { UseFormReturn } from "react-hook-form";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: string;
  paymentMethods: PaymentMethod[];
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  selectedPlan,
  paymentMethods,
  form,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
        <DialogHeader>
          <DialogTitle>Оплата тарифа {selectedPlan}</DialogTitle>
          <DialogDescription>
            Выберите способ оплаты для вашей подписки
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PaymentMethodSelector form={form} paymentMethods={paymentMethods} />
            <PaymentDetailsFields form={form} />
            <DialogFooter>
              <Button type="submit">Оплатить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
