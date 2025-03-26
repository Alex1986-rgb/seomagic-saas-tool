
import React, { useState } from 'react';
import { Search, Download, CreditCard, CheckCircle, AlertCircle, CircleEllipsis } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Мок-данные платежей
const mockPayments = [
  {
    id: 'INV-001',
    user: { name: 'Иван Петров', email: 'ivan@example.com' },
    amount: 2900,
    date: '2023-06-05T10:30:00Z',
    status: 'completed',
    plan: 'pro',
    method: 'card',
  },
  {
    id: 'INV-002',
    user: { name: 'Анна Сидорова', email: 'anna@example.com' },
    amount: 990,
    date: '2023-06-02T14:15:00Z',
    status: 'completed',
    plan: 'basic',
    method: 'card',
  },
  {
    id: 'INV-003',
    user: { name: 'Петр Иванов', email: 'petr@example.com' },
    amount: 990,
    date: '2023-06-01T09:45:00Z',
    status: 'failed',
    plan: 'basic',
    method: 'card',
  },
  {
    id: 'INV-004',
    user: { name: 'Ольга Смирнова', email: 'olga@example.com' },
    amount: 2900,
    date: '2023-05-28T16:20:00Z',
    status: 'completed',
    plan: 'pro',
    method: 'paypal',
  },
  {
    id: 'INV-005',
    user: { name: 'Алексей Козлов', email: 'alex@example.com' },
    amount: 9900,
    date: '2023-05-25T11:10:00Z',
    status: 'pending',
    plan: 'agency',
    method: 'bank',
  },
];

const AdminPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  
  // Фильтрация платежей
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesPlan = planFilter === 'all' || payment.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <CircleEllipsis className="h-4 w-4 text-amber-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по ID или клиенту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус платежа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершены</SelectItem>
              <SelectItem value="pending">В обработке</SelectItem>
              <SelectItem value="failed">Отклонены</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Тариф" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все тарифы</SelectItem>
              <SelectItem value="basic">Базовый</SelectItem>
              <SelectItem value="pro">Про</SelectItem>
              <SelectItem value="agency">Агентский</SelectItem>
            </SelectContent>
          </Select>

          <Button className="gap-2">
            <Download className="h-4 w-4" />
            <span>Скачать отчет</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">ID</th>
              <th className="text-left py-3 px-4 font-medium">Клиент</th>
              <th className="text-left py-3 px-4 font-medium">Сумма</th>
              <th className="text-left py-3 px-4 font-medium">Дата</th>
              <th className="text-left py-3 px-4 font-medium">Статус</th>
              <th className="text-left py-3 px-4 font-medium">Тариф</th>
              <th className="text-left py-3 px-4 font-medium">Метод</th>
              <th className="text-left py-3 px-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="border-b">
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
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
