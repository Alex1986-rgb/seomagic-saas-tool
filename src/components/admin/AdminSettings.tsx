
import React, { useState } from 'react';
import { 
  Globe, 
  CreditCard, 
  Mail, 
  Bell, 
  Lock, 
  Tag,
  Search,
  Settings as SettingsIcon,
  Layout,
  FileText,
  Server,
  Shield,
  Database,
  Users,
  BarChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import TabLayout, { TabItem } from "@/components/ui/tab-layout/TabLayout";
import GeneralSettings from './settings/GeneralSettings';
import PaymentSettings from './settings/PaymentSettings';
import PricingSettings from './settings/PricingSettings';
import PositionPricingSettings from './PositionPricingSettings';
import EmailSettings from './settings/EmailSettings';
import SecuritySettings from './settings/SecuritySettings';
import SiteManagementSettings from './settings/SiteManagementSettings';
import ContentManagementSettings from './settings/ContentManagementSettings';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const tabs: TabItem[] = [
    // Content Management Group
    {
      id: "site",
      label: "Управление сайтом",
      icon: <Layout className="h-4 w-4" />,
      content: <SiteManagementSettings />
    },
    {
      id: "content",
      label: "Контент",
      icon: <FileText className="h-4 w-4" />,
      content: <ContentManagementSettings />
    },
    
    // Business Management Group
    {
      id: "general",
      label: "Общие",
      icon: <SettingsIcon className="h-4 w-4" />,
      content: <GeneralSettings />
    },
    {
      id: "payment",
      label: "Платежи",
      icon: <CreditCard className="h-4 w-4" />,
      content: <PaymentSettings />
    },
    {
      id: "pricing",
      label: "Цены оптимизации",
      icon: <Tag className="h-4 w-4" />,
      content: <PricingSettings />
    },
    {
      id: "position-pricing",
      label: "Цены мониторинга",
      icon: <Search className="h-4 w-4" />,
      content: <PositionPricingSettings />
    },
    
    // Communications Group
    {
      id: "email",
      label: "Email уведомления",
      icon: <Mail className="h-4 w-4" />,
      content: <EmailSettings />
    },
    
    // Security & System Group
    {
      id: "security",
      label: "Безопасность",
      icon: <Lock className="h-4 w-4" />,
      content: <SecuritySettings />
    },
    {
      id: "system",
      label: "Система",
      icon: <Server className="h-4 w-4" />,
      content: <SystemSettings />
    }
  ];

  return (
    <div>
      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
        <CardContent className="p-6">
          <TabLayout
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabsListClassName="mb-6 flex flex-wrap gap-2"
          />
        </CardContent>
      </Card>
    </div>
  );
};

// Improved System Settings component with better organization
const SystemSettings: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Системные настройки</h3>
        <p className="text-muted-foreground">Настройки сервера, баз данных и производительности.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="font-medium">База данных</span>
            </div>
            <p className="text-sm text-muted-foreground">Настройки подключения и оптимизации базы данных.</p>
          </div>
          
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Безопасность</span>
            </div>
            <p className="text-sm text-muted-foreground">Настройки защиты и политики безопасности.</p>
          </div>
          
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Пользователи системы</span>
            </div>
            <p className="text-sm text-muted-foreground">Управление администраторами и их правами.</p>
          </div>
          
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="font-medium">Системные уведомления</span>
            </div>
            <p className="text-sm text-muted-foreground">Настройка системных уведомлений и мониторинга.</p>
          </div>
          
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="h-4 w-4 text-primary" />
              <span className="font-medium">Аналитика</span>
            </div>
            <p className="text-sm text-muted-foreground">Настройки сбора и анализа данных о работе системы.</p>
          </div>
          
          <div className="p-4 border rounded-md bg-card hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-4 w-4 text-primary" />
              <span className="font-medium">Производительность</span>
            </div>
            <p className="text-sm text-muted-foreground">Мониторинг и настройка производительности платформы.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminSettings;
