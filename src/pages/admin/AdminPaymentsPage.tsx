
import React from 'react';
import AdminPayments from '@/components/admin/AdminPayments';
import PageSeo from '@/components/seo/PageSeo';

const AdminPaymentsPage: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Платежи и подписки: поступления, счета и возвраты средств"
        description="Раздел для контроля оплат: история транзакций, статусы подписок клиентов, выставленные счета и обработка возвратов средств."
        noindex
      />
      <AdminPayments />
    </>
  );
};

export default AdminPaymentsPage;
