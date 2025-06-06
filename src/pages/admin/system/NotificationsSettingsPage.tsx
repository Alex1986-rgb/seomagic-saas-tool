
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NotificationsSettings from '@/components/admin/system/NotificationsSettings';

const NotificationsSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Уведомления | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки уведомлений</h1>
        <p className="text-muted-foreground">
          Email и SMS оповещения, интеграция с внешними сервисами
        </p>
      </div>

      <NotificationsSettings />
    </div>
  );
};

export default NotificationsSettingsPage;
