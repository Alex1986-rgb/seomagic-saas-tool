import React from 'react';
import AdminContactRequests from '@/components/admin/AdminContactRequests';
import PageSeo from '@/components/seo/PageSeo';

const AdminRequestsPage: React.FC = () => {
  return (
    <>
      <PageSeo
        title="Заявки с сайта: обращения и запросы счёта"
        description="Раздел для разбора обращений из формы обратной связи и запросов счёта на оптимизацию: кто написал, по какому сайту и на какую сумму."
        noindex
      />
      <AdminContactRequests />
    </>
  );
};

export default AdminRequestsPage;
