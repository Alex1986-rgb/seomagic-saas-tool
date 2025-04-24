
import React from 'react';
import { RouteObject } from 'react-router-dom';
import OpenAISettingsPage from './pages/admin/settings/OpenAISettingsPage';
import AdminLayout from './pages/admin/AdminLayout';

// Это частичный список маршрутов, который мы добавим к существующим
export const additionalRoutes: RouteObject[] = [
  {
    path: '/admin/settings/openai',
    element: (
      <AdminLayout>
        <OpenAISettingsPage />
      </AdminLayout>
    ),
  }
];

// Если AdminLayout еще не создан, создаем его
export const AdminLayoutComponent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};
