
import React from 'react';
import { Settings, CreditCard, FileText, BarChart, Bell, History, ShieldCheck } from 'lucide-react';
import { TabLayout, TabItem } from '@/components/ui/tab-layout';
import ClientAudits from './ClientAudits';
import ClientSettings from './ClientSettings';
import ClientSubscription from './ClientSubscription';
import ClientReports from './ClientReports';
import ClientPositionTracker from './ClientPositionTracker';
import ClientNotifications from './ClientNotifications';
import ClientSecurityTab from './settings/ClientSecurityTab';

interface ProfileContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    {
      id: 'audits',
      label: 'История аудитов',
      icon: <History className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientAudits />
    },
    {
      id: 'positions',
      label: 'Позиции сайта',
      icon: <BarChart className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientPositionTracker />
    },
    {
      id: 'reports',
      label: 'Отчеты',
      icon: <FileText className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientReports />
    },
    {
      id: 'subscription',
      label: 'Подписка',
      icon: <CreditCard className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientSubscription />
    },
    {
      id: 'notifications',
      label: 'Уведомления',
      icon: <Bell className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientNotifications />
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: <Settings className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientSettings />
    },
    {
      id: 'security',
      label: 'Безопасность',
      icon: <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />,
      content: <ClientSecurityTab />
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <TabLayout 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabsListClassName="mb-6 bg-background/50 p-1 rounded-lg"
      />
    </div>
  );
};

export default ProfileContent;
