import React, { useState, useMemo, useCallback } from 'react';
import { Download, Calendar, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PaymentTableRow from './payments/PaymentTableRow';
import PaymentFilters from './payments/PaymentFilters';

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
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);
  
  const filteredPayments = useMemo(() => {
    return mockPayments.filter(payment => {
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end justify-between">
        <PaymentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Фильтр по дате</span>
          </Button>

          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
        </div>
      </div>
      
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
            {filteredPayments.map(payment => (
              <PaymentTableRow key={payment.id} payment={payment} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
