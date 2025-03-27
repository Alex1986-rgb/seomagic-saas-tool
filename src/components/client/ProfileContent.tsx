
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, CreditCard, FileText, BarChart, Bell, History, ShieldCheck } from 'lucide-react';
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
  return (
    <div className="p-4 md:p-6">
      <Tabs 
        defaultValue="audits" 
        value={activeTab} 
        onValueChange={onTabChange}
      >
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-6 flex flex-wrap md:flex-nowrap bg-background/50 p-1 rounded-lg">
            <TabsTrigger value="audits" className="flex items-center gap-2 text-xs md:text-sm">
              <History className="h-3 w-3 md:h-4 md:w-4" />
              <span>История аудитов</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2 text-xs md:text-sm">
              <BarChart className="h-3 w-3 md:h-4 md:w-4" />
              <span>Позиции сайта</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 text-xs md:text-sm">
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span>Отчеты</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2 text-xs md:text-sm">
              <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
              <span>Подписка</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs md:text-sm">
              <Bell className="h-3 w-3 md:h-4 md:w-4" />
              <span>Уведомления</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-xs md:text-sm">
              <Settings className="h-3 w-3 md:h-4 md:w-4" />
              <span>Настройки</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 text-xs md:text-sm">
              <ShieldCheck className="h-3 w-3 md:h-4 md:w-4" />
              <span>Безопасность</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="audits">
          <ClientAudits />
        </TabsContent>
        
        <TabsContent value="positions">
          <ClientPositionTracker />
        </TabsContent>
        
        <TabsContent value="reports">
          <ClientReports />
        </TabsContent>
        
        <TabsContent value="subscription">
          <ClientSubscription />
        </TabsContent>
        
        <TabsContent value="notifications">
          <ClientNotifications />
        </TabsContent>
        
        <TabsContent value="settings">
          <ClientSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <ClientSecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
