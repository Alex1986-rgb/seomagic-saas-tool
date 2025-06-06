
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminPayments from '@/components/admin/AdminPayments';

const AdminPaymentsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Платежи | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-rose-600 bg-clip-text text-transparent">
          Управление платежами
        </h1>
        <p className="text-muted-foreground text-lg">
          Мониторинг транзакций, обработка платежей и финансовая отчетность
        </p>
      </div>

      <AdminPayments />
    </div>
  );
};

export default AdminPaymentsPage;
