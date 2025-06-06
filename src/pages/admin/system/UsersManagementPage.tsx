
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UsersManagement from '@/components/admin/system/UsersManagement';

const UsersManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Пользователи | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление пользователями</h1>
        <p className="text-muted-foreground">
          Администрирование учетных записей, ролей и прав доступа
        </p>
      </div>

      <UsersManagement />
    </div>
  );
};

export default UsersManagementPage;
