
import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Palette, 
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
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';

/**
 * Управление сайтом.
 *
 * Внизу была кнопка «Сохранить настройки контента»: она ставила текущее время в
 * плашку «Настройки сохранены: ЧЧ:ММ» и через 0,8 секунды показывала тост
 * «Изменения содержимого сайта успешно сохранены». Ни одна вкладка при этом
 * ничего не записывала — хранилища настроек сайта нет, всё сбрасывается при
 * перезагрузке. Кнопка убрана, вместо неё — предупреждение.
 */
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
      <NotCollectedNotice
        title="Эти настройки не сохраняются"
        description="Хранилища настроек сайта нет: навигация, тема, кнопки и локализация задаются в коде, а правки на вкладках пропадут после перезагрузки страницы."
      />
      
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
    </div>
  );
};

export default SiteManagementSettings;
