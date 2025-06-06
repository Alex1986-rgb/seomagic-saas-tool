
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminPositions from '@/components/admin/AdminPositions';

const AdminPositionsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Позиции | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
          Мониторинг позиций
        </h1>
        <p className="text-muted-foreground text-lg">
          Отслеживание позиций сайтов в поисковых системах и анализ динамики
        </p>
      </div>

      <AdminPositions />
    </div>
  );
};

export default AdminPositionsPage;
