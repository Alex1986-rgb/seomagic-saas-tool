
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Layout from '@/components/Layout';
import ClientPositionTracker from '@/components/client/ClientPositionTracker';
import ClientAudits from '@/components/client/ClientAudits';
import ClientReports from '@/components/client/ClientReports';
import ClientSettings from '@/components/client/ClientSettings';
import ClientNotifications from '@/components/client/ClientNotifications';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UrlForm from '@/components/url-form/UrlForm';

// Import refactored components
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/overview/DashboardOverview';
import { SitesTab } from '@/components/dashboard/sites/SitesTab';
import { AccountTab } from '@/components/dashboard/account/AccountTab';
import { NotificationsTab } from '@/components/dashboard/notifications/NotificationsTab';
import { mockAudits } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewAuditDialogOpen, setIsNewAuditDialogOpen] = useState(false);
  const [isNotificationsSettingsOpen, setIsNotificationsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDeepCrawlComplete = (pageCount: number) => {
    toast({
      title: "Глубокий аудит завершен",
      description: `Обнаружено ${pageCount} страниц на сайте`,
    });
  };

  const handleStartNewAudit = () => {
    setIsNewAuditDialogOpen(true);
  };

  const handleAddSite = () => {
    navigate('/add-site');
    toast({
      title: "Добавление сайта",
      description: "Открыта форма добавления нового сайта для оптимизации",
    });
  };

  const handleCreateReport = () => {
    navigate('/reports/create');
    toast({
      title: "Создание отчета",
      description: "Открыта форма создания нового отчета",
    });
  };

  const handleNotificationSettings = () => {
    setIsNotificationsSettingsOpen(true);
  };

  const handleNavigateToAudits = () => {
    navigate('/audits');
  };

  const handleNavigateToSites = () => {
    navigate('/sites');
  };

  const handleNavigateToReports = () => {
    navigate('/reports');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Панель управления</h1>
          <p className="text-lg text-muted-foreground">
            Управляйте вашими SEO-аудитами и отслеживайте позиции сайта
          </p>
        </div>
        
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              onStartNewAudit={handleStartNewAudit}
              onAddSite={handleAddSite}
              onCreateReport={handleCreateReport}
            />
          )}
        
          {activeTab === 'positions' && (
            <ClientPositionTracker />
          )}
        
          {activeTab === 'audits' && (
            <ClientAudits onStartNewAudit={handleStartNewAudit} />
          )}
          
          {activeTab === 'sites' && (
            <SitesTab onAddSite={handleAddSite} />
          )}
          
          {activeTab === 'reports' && (
            <ClientReports onCreateReport={handleCreateReport} />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationsTab onOpenSettings={handleNotificationSettings} />
          )}
          
          {activeTab === 'account' && (
            <AccountTab />
          )}
          
          {activeTab === 'settings' && (
            <ClientSettings />
          )}
        </DashboardLayout>
      </div>

      <Dialog open={isNewAuditDialogOpen} onOpenChange={setIsNewAuditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Новый SEO аудит</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <UrlForm />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isNotificationsSettingsOpen} onOpenChange={setIsNotificationsSettingsOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Настройки уведомлений</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <ClientNotifications />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
