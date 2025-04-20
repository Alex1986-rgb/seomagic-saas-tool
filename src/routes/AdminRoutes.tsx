
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import WebsiteAnalyzer from '@/pages/admin/WebsiteAnalyzer';
import NotFound from '@/pages/NotFound';
import SystemStatusPage from '@/pages/admin/SystemStatusPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import AdminMonitoringPage from '@/pages/admin/AdminMonitoringPage';

// system settings sections
import DatabaseSettingsPage from '@/pages/admin/system/DatabaseSettingsPage';
import SecuritySettingsPage from '@/pages/admin/system/SecuritySettingsPage';
import UsersManagementPage from '@/pages/admin/system/UsersManagementPage';
import NotificationsSettingsPage from '@/pages/admin/system/NotificationsSettingsPage';
import AnalyticsSettingsPage from '@/pages/admin/system/AnalyticsSettingsPage';
import PerformanceSettingsPage from '@/pages/admin/system/PerformanceSettingsPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="website-analyzer" element={<WebsiteAnalyzer />} />
        <Route path="system-status" element={<SystemStatusPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="monitoring" element={<AdminMonitoringPage />} />

        {/* System Settings subroutes */}
        <Route path="system/database" element={<DatabaseSettingsPage />} />
        <Route path="system/security" element={<SecuritySettingsPage />} />
        <Route path="system/users" element={<UsersManagementPage />} />
        <Route path="system/notifications" element={<NotificationsSettingsPage />} />
        <Route path="system/analytics" element={<AnalyticsSettingsPage />} />
        <Route path="system/performance" element={<PerformanceSettingsPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
