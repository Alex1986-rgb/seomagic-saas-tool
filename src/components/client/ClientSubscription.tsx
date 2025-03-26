
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SubscriptionPlans, CurrentSubscription, PaymentDialog } from './subscription';

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
      <CurrentSubscription 
        userSubscription={userSubscription}
        paymentMethods={paymentMethods}
        form={form}
        onSubmit={onSubmit}
      />
      
      <SubscriptionPlans 
        plans={plans}
        onPlanSelect={handlePlanSelect}
      />
      
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedPlan={selectedPlan}
        paymentMethods={paymentMethods}
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ClientSubscription;
