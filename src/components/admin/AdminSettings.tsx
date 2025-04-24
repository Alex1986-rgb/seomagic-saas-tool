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
  Server
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
import SystemSettings from './SystemSettings';
import AISettings from './settings/AISettings';

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
      id: "ai",
      label: "Настройки ИИ",
      icon: <SettingsIcon className="h-4 w-4" />,
      content: <AISettings />
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

export default AdminSettings;
