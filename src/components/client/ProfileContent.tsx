
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, CreditCard, FileText, BarChart, Bell, History } from 'lucide-react';
import ClientAudits from './ClientAudits';
import ClientSettings from './ClientSettings';
import ClientSubscription from './ClientSubscription';
import ClientReports from './ClientReports';
import ClientPositionTracker from './ClientPositionTracker';
import ClientNotifications from './ClientNotifications';

interface ProfileContentProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="md:col-span-3">
      <Tabs 
        defaultValue="audits" 
        value={activeTab} 
        onValueChange={onTabChange}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="audits" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>История аудитов</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Позиции сайта</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Отчеты</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Подписка</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="neo-card p-6">
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
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
