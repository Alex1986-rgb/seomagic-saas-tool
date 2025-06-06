
import React from 'react';
import { Helmet } from 'react-helmet-async';
import DatabaseSettings from '@/components/admin/system/DatabaseSettings';

const DatabaseSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>База данных | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки базы данных</h1>
        <p className="text-muted-foreground">
          Управление подключениями, мониторинг производительности и оптимизация запросов
        </p>
      </div>

      <DatabaseSettings />
    </div>
  );
};

export default DatabaseSettingsPage;
