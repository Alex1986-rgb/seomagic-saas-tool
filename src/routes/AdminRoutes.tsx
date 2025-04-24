import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';

import Dashboard from '@/pages/admin/Dashboard';
import WebsiteAnalyzer from '@/pages/admin/WebsiteAnalyzer';
import NotFound from '@/pages/NotFound';
import SystemStatusPage from '@/pages/admin/SystemStatusPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import AdminMonitoringPage from '@/pages/admin/AdminMonitoringPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import HostingPage from '@/pages/admin/HostingPage';
import SitesPage from '@/pages/admin/SitesPage';
import AdminAuditsPage from '@/pages/admin/AdminAuditsPage';
import AdminPositionsPage from '@/pages/admin/AdminPositionsPage';

// system settings sections
import DatabaseSettingsPage from '@/pages/admin/system/DatabaseSettingsPage';
import SecuritySettingsPage from '@/pages/admin/system/SecuritySettingsPage';
import UsersManagementPage from '@/pages/admin/system/UsersManagementPage';
import NotificationsSettingsPage from '@/pages/admin/system/NotificationsSettingsPage';
import AnalyticsSettingsPage from '@/pages/admin/system/AnalyticsSettingsPage';
import PerformanceSettingsPage from '@/pages/admin/system/PerformanceSettingsPage';
import AdminPaymentsPage from '@/pages/admin/AdminPaymentsPage';
import BackupSettingsPage from '@/pages/admin/system/BackupSettingsPage';
import ApiKeysPage from '@/pages/admin/system/ApiKeysPage';
import EmailSettingsPage from '@/pages/admin/system/EmailSettingsPage';
import LogSettingsPage from '@/pages/admin/system/LogSettingsPage';

// New content management pages
import HomePageEditor from '@/pages/admin/content/HomePageEditor';
import AboutPageEditor from '@/pages/admin/content/AboutPageEditor';
import BlogEditor from '@/pages/admin/content/BlogEditor';
import FeaturesEditor from '@/pages/admin/content/FeaturesEditor';
import ClientCabinetEditor from '@/pages/admin/content/ClientCabinetEditor';
import MarketingEditor from '@/pages/admin/content/MarketingEditor';
import HelpEditor from '@/pages/admin/content/HelpEditor';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="website-analyzer" element={<WebsiteAnalyzer />} />
        <Route path="system-status" element={<SystemStatusPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="monitoring" element={<AdminMonitoringPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="hosting" element={<HostingPage />} />
        <Route path="sites" element={<SitesPage />} />
        <Route path="audits" element={<AdminAuditsPage />} />
        <Route path="positions" element={<AdminPositionsPage />} />

        {/* System Settings subroutes */}
        <Route path="system/database" element={<DatabaseSettingsPage />} />
        <Route path="system/security" element={<SecuritySettingsPage />} />
        <Route path="system/backup" element={<BackupSettingsPage />} />
        <Route path="system/api-keys" element={<ApiKeysPage />} />
        <Route path="system/email" element={<EmailSettingsPage />} />
        <Route path="system/logs" element={<LogSettingsPage />} />
        <Route path="system/users" element={<UsersManagementPage />} />
        <Route path="system/notifications" element={<NotificationsSettingsPage />} />
        <Route path="system/analytics" element={<AnalyticsSettingsPage />} />
        <Route path="system/performance" element={<PerformanceSettingsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />

        {/* Content Management Routes */}
        <Route path="content/home" element={<HomePageEditor />} />
        <Route path="content/about" element={<AboutPageEditor />} />
        <Route path="content/blog" element={<BlogEditor />} />
        <Route path="content/features" element={<FeaturesEditor />} />
        <Route path="content/client-cabinet" element={<ClientCabinetEditor />} />
        <Route path="content/marketing" element={<MarketingEditor />} />
        <Route path="content/help" element={<HelpEditor />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
