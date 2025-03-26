
import React, { useState } from 'react';
import { Check, CreditCard, AlertCircle, Clock, ChevronsUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ClientSubscription: React.FC = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  
  // Мок-данные о подписке пользователя
  const userSubscription = {
    plan: 'pro',
    status: 'active',
    nextBilling: '2023-07-10',
    price: 2900,
    paymentMethod: {
      type: 'card',
      last4: '4242',
      expiry: '05/25',
    },
    features: {
      auditLimit: 100,
      pagesPerAudit: 50,
      optimizationLimit: 20,
      pdfReports: true,
      apiAccess: true,
      prioritySupport: true,
    },
    billingHistory: [
      {
        id: 'INV-001',
        date: '2023-06-10',
        amount: 2900,
        status: 'paid',
      },
      {
        id: 'INV-002',
        date: '2023-05-10',
        amount: 2900,
        status: 'paid',
      },
      {
        id: 'INV-003',
        date: '2023-04-10',
        amount: 2900,
        status: 'paid',
      },
    ],
  };

  // Получаем информацию о доступных планах
  const plans = [
    {
      name: 'Бесплатно',
      price: 0,
      features: [
        '1 страница',
        'Базовый SEO-аудит',
        'PDF-отчет',
        'Без оптимизации',
      ],
      recommended: false,
    },
    {
      name: 'Базовый',
      price: 990,
      features: [
        'До 10 страниц',
        'Полный SEO-аудит',
        'PDF-отчет',
        '3 оптимизации в месяц',
        'Email поддержка',
      ],
      recommended: false,
    },
    {
      name: 'Про',
      price: 2900,
      features: [
        'До 50 страниц',
        'Расширенный SEO-аудит',
        'PDF и CSV отчеты',
        '20 оптимизаций в месяц',
        'Приоритетная поддержка',
        'API доступ',
      ],
      recommended: true,
      current: true,
    },
    {
      name: 'Агентство',
      price: 9900,
      features: [
        'До 1000 страниц',
        'Полный SEO-аудит',
        'Все форматы отчетов',
        'Неограниченные оптимизации',
        'Выделенная поддержка',
        'Белый лейбл',
        'Командный доступ',
      ],
      recommended: false,
    },
  ];

  // Список платежных систем
  const paymentMethods = [
    { id: 'card', name: 'Банковская карта', type: 'international', 
      description: 'Visa, Mastercard, American Express, JCB' },
    { id: 'mir', name: 'Карта МИР', type: 'russian',
      description: 'Российская национальная платежная система' },
    { id: 'sbp', name: 'СБП', type: 'russian',
      description: 'Система быстрых платежей (между российскими банками)' },
    { id: 'yoomoney', name: 'ЮMoney', type: 'russian',
      description: 'Электронный кошелек Яндекса' },
    { id: 'qiwi', name: 'QIWI', type: 'russian',
      description: 'Электронный кошелек QIWI' },
    { id: 'tinkoff', name: 'Тинькофф', type: 'russian',
      description: 'Прямой перевод через Тинькофф' },
    { id: 'sberbank', name: 'СберБанк', type: 'russian',
      description: 'Оплата через СберБанк Онлайн' },
    { id: 'paypal', name: 'PayPal', type: 'international',
      description: 'Международная платежная система' },
    { id: 'webmoney', name: 'WebMoney', type: 'international',
      description: 'Международная электронная платежная система' },
    { id: 'crypto', name: 'Криптовалюта', type: 'international',
      description: 'Bitcoin, Ethereum, USDT' },
    { id: 'alipay', name: 'Alipay', type: 'international',
      description: 'Китайская платежная система' },
    { id: 'applepay', name: 'Apple Pay', type: 'international',
      description: 'Бесконтактная оплата для устройств Apple' },
    { id: 'googlepay', name: 'Google Pay', type: 'international',
      description: 'Бесконтактная оплата для устройств Android' },
  ];

  // Форма оплаты
  const paymentFormSchema = z.object({
    paymentMethod: z.string({ required_error: "Выберите способ оплаты" }),
    cardNumber: z.string().optional(),
    cardHolder: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    email: z.string().email("Введите корректный email").optional(),
    phone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "",
      cardNumber: "",
      cardHolder: "",
      expiry: "",
      cvv: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof paymentFormSchema>) => {
    console.log(values);
    // Здесь был бы код для обработки платежа
    setShowPaymentDialog(false);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.name);
    setShowPaymentDialog(true);
  };

  return (
    <div>
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
                        
                        {form.watch("paymentMethod") === "card" && (
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
                        
                        {["yoomoney", "qiwi", "webmoney", "paypal"].includes(form.watch("paymentMethod")) && (
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
                        
                        {["sbp", "tinkoff", "sberbank"].includes(form.watch("paymentMethod")) && (
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
                        
                        <DialogFooter>
                          <Button type="submit">Сохранить</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <h3 className="text-lg font-medium mb-4">История платежей</h3>
              
              <div className="space-y-3">
                {userSubscription.billingHistory.map((bill) => (
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
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Доступные планы</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`neo-card p-6 border-2 ${
                plan.current 
                  ? 'border-primary' 
                  : plan.recommended 
                    ? 'border-green-500' 
                    : 'border-transparent'
              }`}
            >
              {plan.recommended && !plan.current && (
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                  <Badge className="bg-green-500">Рекомендуемый</Badge>
                </div>
              )}
              {plan.current && (
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                  <Badge>Текущий план</Badge>
                </div>
              )}
              
              <h3 className="text-lg font-medium mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold mb-4">
                {plan.price} ₽<span className="text-sm font-normal text-muted-foreground">/мес</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.current ? "outline" : "default"} 
                className="w-full"
                disabled={plan.current}
                onClick={() => plan.current ? null : handlePlanSelect(plan)}
              >
                {plan.current ? 'Текущий план' : plan.price === 0 ? 'Выбрать бесплатный' : 'Выбрать план'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Оплата тарифа {selectedPlan}</DialogTitle>
            <DialogDescription>
              Выберите способ оплаты для вашей подписки
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              
              {/* Conditionally render payment-specific fields */}
              {form.watch("paymentMethod") === "card" && (
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
              
              {["yoomoney", "qiwi", "webmoney", "paypal"].includes(form.watch("paymentMethod")) && (
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
              
              {["sbp", "tinkoff", "sberbank"].includes(form.watch("paymentMethod")) && (
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
              
              <DialogFooter>
                <Button type="submit">Оплатить</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientSubscription;
