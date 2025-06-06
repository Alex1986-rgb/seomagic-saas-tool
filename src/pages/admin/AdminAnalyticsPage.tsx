
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Аналитика | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
          Аналитика и отчеты
        </h1>
        <p className="text-muted-foreground text-lg">
          Детальная статистика использования платформы и метрики производительности
        </p>
      </div>

      <AdminAnalytics />
    </div>
  );
};

export default AdminAnalyticsPage;
