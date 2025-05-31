
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { FullscreenLoader } from '@/components/ui/loading';
import ProtectedDashboard from '@/components/admin/ProtectedDashboard';

// Lazy load all admin pages
const WebsiteAnalyzer = React.lazy(() => import('@/pages/admin/WebsiteAnalyzer'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const SystemStatusPage = React.lazy(() => import('@/pages/admin/SystemStatusPage'));
const AdminNotificationsPage = React.lazy(() => import('@/pages/admin/AdminNotificationsPage'));
const AdminMonitoringPage = React.lazy(() => import('@/pages/admin/AdminMonitoringPage'));
const AdminSettingsPage = React.lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminUsersPage = React.lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminAnalyticsPage = React.lazy(() => import('@/pages/admin/AdminAnalyticsPage'));
const HostingPage = React.lazy(() => import('@/pages/admin/HostingPage'));
const SitesPage = React.lazy(() => import('@/pages/admin/SitesPage'));
const AdminAuditsPage = React.lazy(() => import('@/pages/admin/AdminAuditsPage'));
const AdminPositionsPage = React.lazy(() => import('@/pages/admin/AdminPositionsPage'));
const AdminProxiesPage = React.lazy(() => import('@/pages/admin/AdminProxiesPage'));
const AdminPaymentsPage = React.lazy(() => import('@/pages/admin/AdminPaymentsPage'));

// Lazy load system settings sections
const SystemSettingsPage = React.lazy(() => import('@/pages/admin/system/SystemSettingsPage'));
const DatabaseSettingsPage = React.lazy(() => import('@/pages/admin/system/DatabaseSettingsPage'));
const SecuritySettingsPage = React.lazy(() => import('@/pages/admin/system/SecuritySettingsPage'));
const UsersManagementPage = React.lazy(() => import('@/pages/admin/system/UsersManagementPage'));
const NotificationsSettingsPage = React.lazy(() => import('@/pages/admin/system/NotificationsSettingsPage'));
const AnalyticsSettingsPage = React.lazy(() => import('@/pages/admin/system/AnalyticsSettingsPage'));
const PerformanceSettingsPage = React.lazy(() => import('@/pages/admin/system/PerformanceSettingsPage'));
const BackupSettingsPage = React.lazy(() => import('@/pages/admin/system/BackupSettingsPage'));
const ApiKeysPage = React.lazy(() => import('@/pages/admin/system/ApiKeysPage'));
const EmailSettingsPage = React.lazy(() => import('@/pages/admin/system/EmailSettingsPage'));
const LogSettingsPage = React.lazy(() => import('@/pages/admin/system/LogSettingsPage'));

// New content management pages - lazy loaded
const HomePageEditor = React.lazy(() => import('@/pages/admin/content/HomePageEditor'));
const AboutPageEditor = React.lazy(() => import('@/pages/admin/content/AboutPageEditor'));
const BlogEditor = React.lazy(() => import('@/pages/admin/content/BlogEditor'));
const FeaturesEditor = React.lazy(() => import('@/pages/admin/content/FeaturesEditor'));
const ClientCabinetEditor = React.lazy(() => import('@/pages/admin/content/ClientCabinetEditor'));
const MarketingEditor = React.lazy(() => import('@/pages/admin/content/MarketingEditor'));
const HelpEditor = React.lazy(() => import('@/pages/admin/content/HelpEditor'));

const AdminRoutes: React.FC = () => {
  console.log('AdminRoutes component rendering');
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<ProtectedDashboard />} />
        
        {/* Main admin routes */}
        <Route path="website-analyzer" element={
          <Suspense fallback={<FullscreenLoader text="Загрузка анализатора сайтов..." />}>
            <WebsiteAnalyzer />
          </Suspense>
        } />
        
        <Route path="system-status" element={
          <Suspense fallback={<FullscreenLoader />}>
            <SystemStatusPage />
          </Suspense>
        } />
        <Route path="notifications" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminNotificationsPage />
          </Suspense>
        } />
        <Route path="monitoring" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminMonitoringPage />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminSettingsPage />
          </Suspense>
        } />
        <Route path="users" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminUsersPage />
          </Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminAnalyticsPage />
          </Suspense>
        } />
        <Route path="hosting" element={
          <Suspense fallback={<FullscreenLoader />}>
            <HostingPage />
          </Suspense>
        } />
        <Route path="sites" element={
          <Suspense fallback={<FullscreenLoader />}>
            <SitesPage />
          </Suspense>
        } />
        <Route path="audits" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminAuditsPage />
          </Suspense>
        } />
        <Route path="positions" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminPositionsPage />
          </Suspense>
        } />
        <Route path="proxies" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminProxiesPage />
          </Suspense>
        } />
        <Route path="payments" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AdminPaymentsPage />
          </Suspense>
        } />

        {/* System Settings subroutes */}
        <Route path="system" element={
          <Suspense fallback={<FullscreenLoader />}>
            <SystemSettingsPage />
          </Suspense>
        } />
        <Route path="system/database" element={
          <Suspense fallback={<FullscreenLoader />}>
            <DatabaseSettingsPage />
          </Suspense>
        } />
        <Route path="system/security" element={
          <Suspense fallback={<FullscreenLoader />}>
            <SecuritySettingsPage />
          </Suspense>
        } />
        <Route path="system/backup" element={
          <Suspense fallback={<FullscreenLoader />}>
            <BackupSettingsPage />
          </Suspense>
        } />
        <Route path="system/api-keys" element={
          <Suspense fallback={<FullscreenLoader />}>
            <ApiKeysPage />
          </Suspense>
        } />
        <Route path="system/email" element={
          <Suspense fallback={<FullscreenLoader />}>
            <EmailSettingsPage />
          </Suspense>
        } />
        <Route path="system/logs" element={
          <Suspense fallback={<FullscreenLoader />}>
            <LogSettingsPage />
          </Suspense>
        } />
        <Route path="system/users" element={
          <Suspense fallback={<FullscreenLoader />}>
            <UsersManagementPage />
          </Suspense>
        } />
        <Route path="system/notifications" element={
          <Suspense fallback={<FullscreenLoader />}>
            <NotificationsSettingsPage />
          </Suspense>
        } />
        <Route path="system/analytics" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AnalyticsSettingsPage />
          </Suspense>
        } />
        <Route path="system/performance" element={
          <Suspense fallback={<FullscreenLoader />}>
            <PerformanceSettingsPage />
          </Suspense>
        } />

        {/* Content Management Routes */}
        <Route path="content/home" element={
          <Suspense fallback={<FullscreenLoader />}>
            <HomePageEditor />
          </Suspense>
        } />
        <Route path="content/about" element={
          <Suspense fallback={<FullscreenLoader />}>
            <AboutPageEditor />
          </Suspense>
        } />
        <Route path="content/blog" element={
          <Suspense fallback={<FullscreenLoader />}>
            <BlogEditor />
          </Suspense>
        } />
        <Route path="content/features" element={
          <Suspense fallback={<FullscreenLoader />}>
            <FeaturesEditor />
          </Suspense>
        } />
        <Route path="content/client-cabinet" element={
          <Suspense fallback={<FullscreenLoader />}>
            <ClientCabinetEditor />
          </Suspense>
        } />
        <Route path="content/marketing" element={
          <Suspense fallback={<FullscreenLoader />}>
            <MarketingEditor />
          </Suspense>
        } />
        <Route path="content/help" element={
          <Suspense fallback={<FullscreenLoader />}>
            <HelpEditor />
          </Suspense>
        } />

        <Route path="*" element={
          <Suspense fallback={<FullscreenLoader />}>
            <NotFound />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
