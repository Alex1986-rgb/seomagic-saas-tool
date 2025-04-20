import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import WebsiteAnalyzer from '@/pages/admin/WebsiteAnalyzer';
import NotFound from '@/pages/NotFound';
import SystemStatusPage from '@/pages/admin/SystemStatusPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import AdminMonitoringPage from '@/pages/admin/AdminMonitoringPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="website-analyzer" element={<WebsiteAnalyzer />} />
        <Route path="system-status" element={<SystemStatusPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="monitoring" element={<AdminMonitoringPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
