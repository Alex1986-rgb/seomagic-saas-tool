
import React from 'react';
import { Check, Clock, CreditCard } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface UserSubscription {
  plan: string;
  status: string;
  nextBilling: string;
  price: number;
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  features: {
    auditLimit: number;
    pagesPerAudit: number;
    optimizationLimit: number;
    pdfReports: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  billingHistory: {
    id: string;
    date: string;
    amount: number;
    status: string;
  }[];
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface CurrentSubscriptionProps {
  userSubscription: UserSubscription;
  paymentMethods: PaymentMethod[];
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
}

const CurrentSubscription: React.FC<CurrentSubscriptionProps> = ({
  userSubscription,
  paymentMethods,
  form,
  onSubmit
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Ваша подписка</h2>
      
      <div className="neo-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">
                {userSubscription.plan === 'free' && 'Бесплатный план'}
                {userSubscription.plan === 'basic' && 'Базовый план'}
                {userSubscription.plan === 'pro' && 'Про план'}
                {userSubscription.plan === 'agency' && 'Агентский план'}
              </h3>
              <Badge 
                className="ml-3" 
                variant={userSubscription.status === 'active' ? 'default' : 'outline'}
              >
                {userSubscription.status === 'active' && 'Активна'}
                {userSubscription.status === 'inactive' && 'Неактивна'}
                {userSubscription.status === 'canceled' && 'Отменена'}
              </Badge>
            </div>
            
            <div className="mb-4">
              <div className="text-3xl font-bold mb-1">
                {userSubscription.price} ₽<span className="text-base font-normal text-muted-foreground">/мес</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Следующее списание: {new Date(userSubscription.nextBilling).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>До {userSubscription.features.pagesPerAudit} страниц на аудит</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{userSubscription.features.auditLimit} аудитов в месяц</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{userSubscription.features.optimizationLimit} оптимизаций в месяц</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>PDF и расширенные отчеты</span>
              </div>
              {userSubscription.features.apiAccess && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>API доступ</span>
                </div>
              )}
              {userSubscription.features.prioritySupport && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Приоритетная поддержка</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Button className="w-full">Изменить план</Button>
              <Button variant="outline" className="w-full">Отменить подписку</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Способ оплаты</h3>
            
            <div className="p-4 rounded-lg border border-border mb-6">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5" />
                <div>
                  <div className="font-medium">
                    {userSubscription.paymentMethod.type === 'card' && 'Банковская карта'}
                    {userSubscription.paymentMethod.type === 'paypal' && 'PayPal'}
                    {userSubscription.paymentMethod.type === 'mir' && 'Карта МИР'}
                    {userSubscription.paymentMethod.type === 'sbp' && 'СБП'}
                  </div>
                  {userSubscription.paymentMethod.type === 'card' && (
                    <div className="text-sm text-muted-foreground">
                      •••• {userSubscription.paymentMethod.last4} | 
                      Истекает {userSubscription.paymentMethod.expiry}
                    </div>
                  )}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Обновить</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Обновить способ оплаты</DialogTitle>
                    <DialogDescription>
                      Выберите новый способ оплаты для вашей подписки
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <PaymentMethodSelector form={form} paymentMethods={paymentMethods} />
                      <PaymentDetailsFields form={form} />
                      <DialogFooter>
                        <Button type="submit">Сохранить</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <BillingHistory billingHistory={userSubscription.billingHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BillingHistory: React.FC<{ billingHistory: UserSubscription['billingHistory'] }> = ({ billingHistory }) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">История платежей</h3>
      
      <div className="space-y-3">
        {billingHistory.map((bill) => (
          <div key={bill.id} className="flex items-center justify-between p-3 border-b">
            <div>
              <div className="font-medium">
                {new Date(bill.date).toLocaleDateString('ru-RU')}
              </div>
              <div className="text-sm text-muted-foreground">
                {bill.id}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{bill.amount} ₽</div>
              <div className="text-sm">
                {bill.status === 'paid' && (
                  <span className="text-green-500">Оплачено</span>
                )}
                {bill.status === 'pending' && (
                  <span className="text-amber-500">В обработке</span>
                )}
                {bill.status === 'failed' && (
                  <span className="text-red-500">Ошибка</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export const PaymentMethodSelector: React.FC<{ form: UseFormReturn<any>, paymentMethods: PaymentMethod[] }> = ({ form, paymentMethods }) => {
  return (
    <FormField
      control={form.control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Способ оплаты</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="mb-2 font-medium">Российские платежные системы</div>
              {paymentMethods
                .filter(method => method.type === 'russian')
                .map(method => (
                  <FormItem key={method.id} className="flex items-center space-x-3 space-y-0 p-2 border rounded-md">
                    <FormControl>
                      <RadioGroupItem value={method.id} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex-1">
                      <div>{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </FormLabel>
                  </FormItem>
                ))
              }
              
              <div className="mt-4 mb-2 font-medium">Международные платежные системы</div>
              {paymentMethods
                .filter(method => method.type === 'international')
                .map(method => (
                  <FormItem key={method.id} className="flex items-center space-x-3 space-y-0 p-2 border rounded-md">
                    <FormControl>
                      <RadioGroupItem value={method.id} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer flex-1">
                      <div>{method.name}</div>
                      <div className="text-sm text-muted-foreground">{method.description}</div>
                    </FormLabel>
                  </FormItem>
                ))
              }
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const PaymentDetailsFields: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  const paymentMethod = form.watch("paymentMethod");
  
  return (
    <>
      {paymentMethod === "card" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Номер карты</FormLabel>
                  <FormControl>
                    <Input placeholder="1234 5678 9012 3456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Имя держателя</FormLabel>
                  <FormControl>
                    <Input placeholder="IVAN IVANOV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Срок действия</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
      
      {["yoomoney", "qiwi", "webmoney", "paypal"].includes(paymentMethod) && (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {["sbp", "tinkoff", "sberbank"].includes(paymentMethod) && (
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер телефона</FormLabel>
              <FormControl>
                <Input placeholder="+7 (999) 999-99-99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CurrentSubscription;
