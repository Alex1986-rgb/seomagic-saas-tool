
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/layouts/AdminLayout';

const AdminPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Статистика</h2>
            <p className="text-muted-foreground">Общая статистика использования сервиса</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
            <p className="text-muted-foreground">Управление пользователями системы</p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Настройки</h2>
            <p className="text-muted-foreground">Системные настройки приложения</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
