
import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Palette, 
  Globe,
  Settings,
  Languages
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import TabLayout, { TabItem } from "@/components/ui/tab-layout/TabLayout";
import NavigationSettings from './content/NavigationSettings';
import ButtonsSettings from './content/ButtonsSettings';
import GeneralSiteSettings from './GeneralSiteSettings';
import ThemeSettings from './ThemeSettings';
import LocalizationSettings from './LocalizationSettings';
import SaveContentButton from './content/SaveContentButton';

const SiteManagementSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  
  const tabs: TabItem[] = [
    {
      id: "general",
      label: "Общие настройки",
      icon: <Settings className="h-4 w-4" />,
      content: <GeneralSiteSettings />
    },
    {
      id: "navigation",
      label: "Навигация",
      icon: <LayoutTemplate className="h-4 w-4" />,
      content: <NavigationSettings />
    },
    {
      id: "buttons",
      label: "Кнопки",
      icon: <Settings className="h-4 w-4" />,
      content: <ButtonsSettings />
    },
    {
      id: "theme",
      label: "Тема",
      icon: <Palette className="h-4 w-4" />,
      content: <ThemeSettings />
    },
    {
      id: "localization",
      label: "Локализация",
      icon: <Languages className="h-4 w-4" />,
      content: <LocalizationSettings />
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
        <CardContent className="p-6">
          <TabLayout
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabsListClassName="mb-6"
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <SaveContentButton />
      </div>
    </div>
  );
};

export default SiteManagementSettings;
