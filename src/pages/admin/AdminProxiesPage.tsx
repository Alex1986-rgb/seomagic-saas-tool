
import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProxyManager from '@/components/admin/proxies/ProxyManager';

const AdminProxiesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Прокси | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
          Управление прокси
        </h1>
        <p className="text-muted-foreground text-lg">
          Настройка и мониторинг прокси-серверов для парсинга и аналитики
        </p>
      </div>

      <ProxyManager />
    </div>
  );
};

export default AdminProxiesPage;
