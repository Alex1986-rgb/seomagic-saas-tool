
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Palette
} from 'lucide-react';
import GeneralSettings from './settings/GeneralSettings';
import PaymentSettings from './settings/PaymentSettings';
import PricingSettings from './settings/PricingSettings';
import PositionPricingSettings from './PositionPricingSettings';
import EmailSettings from './settings/EmailSettings';
import SecuritySettings from './settings/SecuritySettings';
import SiteManagementSettings from './settings/SiteManagementSettings';

const AdminSettings: React.FC = () => {
  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Общие</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Управление сайтом</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Платежи</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Цены оптимизации</span>
          </TabsTrigger>
          <TabsTrigger value="position-pricing" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Цены мониторинга</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email уведомления</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Безопасность</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="site">
          <SiteManagementSettings />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="pricing">
          <PricingSettings />
        </TabsContent>
        
        <TabsContent value="position-pricing">
          <PositionPricingSettings />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
