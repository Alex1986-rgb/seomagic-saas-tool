
import React, { useState } from 'react';
import { Database, Shield, Users, Bell, BarChart2, Activity } from 'lucide-react';
import TabLayout, { TabItem } from "@/components/ui/tab-layout/TabLayout";
import DatabaseSettings from './DatabaseSettings';
import SecuritySettings from './SecuritySettings';
import UsersManagement from './UsersManagement';
import NotificationsSettings from './NotificationsSettings';
import AnalyticsSettings from './AnalyticsSettings';
import PerformanceSettings from './PerformanceSettings';

const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("database");
  
  const tabs: TabItem[] = [
    {
      id: "database",
      label: "База данных",
      icon: <Database className="h-4 w-4" />,
      content: <DatabaseSettings />,
    },
    {
      id: "security",
      label: "Безопасность",
      icon: <Shield className="h-4 w-4" />,
      content: <SecuritySettings />,
    },
    {
      id: "users",
      label: "Пользователи системы",
      icon: <Users className="h-4 w-4" />,
      content: <UsersManagement />,
    },
    {
      id: "notifications",
      label: "Системные уведомления",
      icon: <Bell className="h-4 w-4" />,
      content: <NotificationsSettings />,
    },
    {
      id: "analytics",
      label: "Аналитика",
      icon: <BarChart2 className="h-4 w-4" />,
      content: <AnalyticsSettings />,
    },
    {
      id: "performance",
      label: "Производительность",
      icon: <Activity className="h-4 w-4" />,
      content: <PerformanceSettings />,
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Системные настройки</h1>
        <p className="text-muted-foreground">Настройки сервера, баз данных и производительности.</p>
      </div>
      
      <TabLayout
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabsListClassName="mb-6"
      />
    </div>
  );
};

export default SystemSettingsPage;
