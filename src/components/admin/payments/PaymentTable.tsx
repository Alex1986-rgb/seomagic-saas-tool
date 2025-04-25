
import React, { memo } from 'react';
import PaymentTableRow from './PaymentTableRow';
import { Payment } from './types';

interface PaymentTableProps {
  payments: Payment[];
}

const PaymentTable = memo(({ payments }: PaymentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">ID</th>
            <th className="text-left py-3 px-4 font-medium">Пользователь</th>
            <th className="text-left py-3 px-4 font-medium">Сумма</th>
            <th className="text-left py-3 px-4 font-medium">Дата</th>
            <th className="text-left py-3 px-4 font-medium">Статус</th>
            <th className="text-left py-3 px-4 font-medium">Тариф</th>
            <th className="text-left py-3 px-4 font-medium">Метод</th>
            <th className="text-left py-3 px-4 font-medium">Действия</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <PaymentTableRow key={payment.id} payment={payment} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

PaymentTable.displayName = 'PaymentTable';

export default PaymentTable;
