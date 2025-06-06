
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminUsers from '@/components/admin/AdminUsers';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Пользователи | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Управление пользователями
        </h1>
        <p className="text-muted-foreground text-lg">
          Просмотр, редактирование и управление учетными записями пользователей
        </p>
      </div>

      <AdminUsers />
    </div>
  );
};

export default AdminUsersPage;
