import React from 'react';
import { CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminFormContainer, AdminFormTitle } from './AdminFormStyles';

/**
 * Платежи.
 *
 * Приёма платежей в продукте нет: ни платёжной системы, ни таблиц заказов,
 * подписок и счетов. Раньше раздел показывал выдуманный список транзакций с
 * суммами и именами — по нему легко было решить, что деньги уже ходят.
 * Пока приём оплаты не подключён, честнее показывать положение дел.
 */
const AdminPayments: React.FC = () => {
  return (
    <AdminFormContainer>
      <AdminFormTitle>Управление платежами</AdminFormTitle>

      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertTitle>Приём оплаты не подключён</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            В системе нет ни платёжного провайдера, ни таблиц заказов и подписок,
            поэтому показывать здесь пока нечего.
          </p>
          <p className="text-muted-foreground">
            Раздел заработает, когда появятся приём оплаты и хранение операций.
            Тарифы на сайте сейчас носят справочный характер.
          </p>
        </AlertDescription>
      </Alert>
    </AdminFormContainer>
  );
};

export default AdminPayments;
