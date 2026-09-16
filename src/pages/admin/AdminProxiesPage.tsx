
import React from 'react';
import { AdminFormContainer, AdminFormTitle } from '@/components/admin/AdminFormStyles';
import ProxyManager from '@/components/admin/proxies/ProxyManager';
import PageSeo from '@/components/seo/PageSeo';

const AdminProxiesPage: React.FC = () => {
  return (
    <AdminFormContainer>
      <PageSeo
        title="Прокси-серверы: список адресов, проверка и ротация"
        description="Управление пулом прокси для сканирования и съёма выдачи: добавление адресов, проверка доступности и отключение нерабочих."
        noindex
      />
      <AdminFormTitle>Управление прокси</AdminFormTitle>
      <ProxyManager />
    </AdminFormContainer>
  );
};

export default AdminProxiesPage;
