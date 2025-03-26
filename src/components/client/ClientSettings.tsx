
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Globe } from 'lucide-react';
import { 
  ClientProfileTab, 
  ClientPasswordTab, 
  ClientNotificationsTab, 
  ClientSitesTab 
} from './settings';

const ClientSettings: React.FC = () => {
  return (
    <div>
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Пароль</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
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
