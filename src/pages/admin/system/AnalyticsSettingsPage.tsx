
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnalyticsSettings from '@/components/admin/system/AnalyticsSettings';

const AnalyticsSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Аналитика | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки аналитики</h1>
        <p className="text-muted-foreground">
          Google Analytics, сбор пользовательских событий и метрики
        </p>
      </div>

      <AnalyticsSettings />
    </div>
  );
};

export default AnalyticsSettingsPage;
