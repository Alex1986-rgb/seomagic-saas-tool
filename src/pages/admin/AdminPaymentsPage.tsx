
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminPayments from '@/components/admin/AdminPayments';

const AdminPaymentsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Платежи | Админ-панель</title>
      </Helmet>
      <AdminPayments />
    </>
  );
};

export default AdminPaymentsPage;
