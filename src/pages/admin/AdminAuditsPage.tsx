
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminAudits from '@/components/admin/AdminAudits';

const AdminAuditsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Аудиты | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
          История аудитов
        </h1>
        <p className="text-muted-foreground text-lg">
          Просмотр и анализ всех проведенных SEO аудитов сайтов
        </p>
      </div>

      <AdminAudits />
    </div>
  );
};

export default AdminAuditsPage;
