
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PerformanceSettings from '@/components/admin/system/PerformanceSettings';

const PerformanceSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Производительность | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Мониторинг производительности</h1>
        <p className="text-muted-foreground">
          Системные ресурсы, автоматизация оповещений и оптимизация
        </p>
      </div>

      <PerformanceSettings />
    </div>
  );
};

export default PerformanceSettingsPage;
