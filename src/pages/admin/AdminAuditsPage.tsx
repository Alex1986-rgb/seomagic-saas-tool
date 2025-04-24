
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminAudits from '@/components/admin/AdminAudits';

const AdminAuditsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Аудиты | Панель администратора</title>
      </Helmet>
      
      <div>
        <h1 className="text-2xl font-bold mb-6">Управление аудитами</h1>
        <AdminAudits />
      </div>
    </>
  );
};

export default AdminAuditsPage;
