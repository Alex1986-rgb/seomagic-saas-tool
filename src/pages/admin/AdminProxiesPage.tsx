
import React from 'react';
import { AdminFormContainer, AdminFormTitle } from '@/components/admin/AdminFormStyles';
import ProxyManager from '@/components/admin/proxies/ProxyManager';

const AdminProxiesPage: React.FC = () => {
  return (
    <AdminFormContainer>
      <AdminFormTitle>Управление прокси</AdminFormTitle>
      <ProxyManager />
    </AdminFormContainer>
  );
};

export default AdminProxiesPage;
