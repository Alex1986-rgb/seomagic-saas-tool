
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Globe, ShieldCheck } from 'lucide-react';
import { 
  ClientProfileTab, 
  ClientPasswordTab, 
  ClientNotificationsTab, 
  ClientSitesTab 
} from './settings';
import ClientSecurityTab from './settings/ClientSecurityTab';

const ClientSettings: React.FC = () => {
  return (
    <div>
      <Tabs defaultValue="profile">
        <TabsList className="mb-6 border-b pb-px flex space-x-4 overflow-x-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            <User className="h-4 w-4" />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            <Lock className="h-4 w-4" />
            <span>Пароль</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Безопасность</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
            <Globe className="h-4 w-4" />
            <span>Мои сайты</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ClientProfileTab />
        </TabsContent>
        
        <TabsContent value="password">
          <ClientPasswordTab />
        </TabsContent>
        
        <TabsContent value="security">
          <ClientSecurityTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <ClientNotificationsTab />
        </TabsContent>
        
        <TabsContent value="sites">
          <ClientSitesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientSettings;
