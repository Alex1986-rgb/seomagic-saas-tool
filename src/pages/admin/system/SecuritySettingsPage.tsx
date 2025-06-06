
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SecuritySettings from '@/components/admin/system/SecuritySettings';

const SecuritySettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Безопасность | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки безопасности</h1>
        <p className="text-muted-foreground">
          Двухфакторная аутентификация, политики доступа и аудит безопасности
        </p>
      </div>

      <SecuritySettings />
    </div>
  );
};

export default SecuritySettingsPage;
