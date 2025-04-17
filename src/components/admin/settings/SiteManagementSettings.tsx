
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutTemplate, 
  Palette, 
  Globe,
  Settings
} from 'lucide-react';
import NavigationSettings from './content/NavigationSettings';
import ButtonsSettings from './content/ButtonsSettings';
import GeneralSiteSettings from './GeneralSiteSettings';
import ThemeSettings from './ThemeSettings';

const SiteManagementSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Общие настройки</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span>Навигация</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Кнопки</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Тема</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSiteSettings />
        </TabsContent>
        
        <TabsContent value="navigation">
          <NavigationSettings />
        </TabsContent>
        
        <TabsContent value="buttons">
          <ButtonsSettings />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteManagementSettings;
