
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, CreditCard, CheckCircle, AlertCircle, CircleEllipsis } from 'lucide-react';

interface PaymentTableRowProps {
  payment: {
    id: string;
    user: { name: string; email: string };
    amount: number;
    date: string;
    status: string;
    plan: string;
    method: string;
  };
}

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending': return <CircleEllipsis className="h-4 w-4 text-amber-500" />;
    case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
    default: return null;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PaymentTableRow = memo(({ payment }: PaymentTableRowProps) => {
  return (
    <tr className="border-b">
      <td className="py-4 px-4 font-mono">{payment.id}</td>
      <td className="py-4 px-4">
        <div>
          <div className="font-medium">{payment.user.name}</div>
          <div className="text-sm text-muted-foreground">{payment.user.email}</div>
        </div>
      </td>
      <td className="py-4 px-4 font-medium">
        {formatCurrency(payment.amount)}
      </td>
      <td className="py-4 px-4">
        {new Date(payment.date).toLocaleDateString('ru-RU')}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(payment.status)}
          <Badge 
            variant={
              payment.status === 'completed' ? 'default' : 
              payment.status === 'pending' ? 'secondary' : 'destructive'
            }
          >
            {payment.status === 'completed' && 'Оплачено'}
            {payment.status === 'pending' && 'В обработке'}
            {payment.status === 'failed' && 'Отклонено'}
          </Badge>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge variant="outline">
          {payment.plan === 'basic' && 'Базовый'}
          {payment.plan === 'pro' && 'Про'}
          {payment.plan === 'agency' && 'Агентский'}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>
            {payment.method === 'card' && 'Карта'}
            {payment.method === 'paypal' && 'PayPal'}
            {payment.method === 'bank' && 'Банк. перевод'}
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

PaymentTableRow.displayName = 'PaymentTableRow';

export default PaymentTableRow;
