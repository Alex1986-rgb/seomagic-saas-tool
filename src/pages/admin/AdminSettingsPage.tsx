
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Настройки | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Настройки системы
        </h1>
        <p className="text-muted-foreground text-lg">
          Управление конфигурацией платформы и системными параметрами
        </p>
      </div>

      <AdminSettings />
    </div>
  );
};

export default AdminSettingsPage;
