
import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Palette, 
  Globe,
  Settings,
  Languages,
  Chrome
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import TabLayout, { TabItem } from "@/components/ui/tab-layout/TabLayout";
import NavigationSettings from './content/NavigationSettings';
import ButtonsSettings from './content/ButtonsSettings';
import GeneralSiteSettings from './GeneralSiteSettings';
import ThemeSettings from './ThemeSettings';
import LocalizationSettings from './LocalizationSettings';
import SaveContentButton from './content/SaveContentButton';
import { Alert, AlertDescription } from "@/components/ui/alert";

const SiteManagementSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const handleSave = () => {
    // Here you would implement the actual save logic
    setLastSaved(new Date());
  };
  
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
      id: "theme",
      label: "Тема",
      icon: <Palette className="h-4 w-4" />,
      content: <ThemeSettings />
    },
    {
      id: "buttons",
      label: "Кнопки",
      icon: <Chrome className="h-4 w-4" />,
      content: <ButtonsSettings />
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
      {lastSaved && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">
            Настройки сохранены: {lastSaved.toLocaleTimeString()}
          </AlertDescription>
        </Alert>
      )}
      
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
        <SaveContentButton onSave={handleSave} />
      </div>
    </div>
  );
};

export default SiteManagementSettings;
