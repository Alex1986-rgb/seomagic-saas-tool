
import React from 'react';
import { RouteObject } from 'react-router-dom';
import OpenAISettingsPage from './pages/admin/settings/OpenAISettingsPage';
import WebsiteAnalyzer from './pages/admin/WebsiteAnalyzer';
import AdminLayout from './pages/admin/AdminLayout';

export const additionalRoutes: RouteObject[] = [
  {
    path: '/admin/settings/openai',
    element: (
      <AdminLayout>
        <OpenAISettingsPage />
      </AdminLayout>
    ),
  },
  {
    path: '/admin/website-analyzer',
    element: <WebsiteAnalyzer />
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
