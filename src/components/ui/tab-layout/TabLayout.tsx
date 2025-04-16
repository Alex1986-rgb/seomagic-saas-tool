
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  content: ReactNode;
  badge?: ReactNode;
}

interface TabLayoutProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  tabsClassName?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
}

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'horizontal',
  tabsClassName = '',
  tabsListClassName = '',
  tabsTriggerClassName = '',
  tabsContentClassName = '',
}) => {
  return (
    <Tabs 
      defaultValue={tabs[0]?.id} 
      value={activeTab} 
      onValueChange={onTabChange}
      className={tabsClassName}
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
    >
      <div className={`overflow-x-auto pb-2 ${orientation === 'vertical' ? 'float-left mr-4' : ''}`}>
        <TabsList className={`${tabsListClassName} ${orientation === 'vertical' ? 'flex-col' : 'flex flex-wrap md:flex-nowrap'}`}>
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className={`flex items-center gap-2 text-xs md:text-sm ${tabsTriggerClassName}`}
            >
              {tab.icon && <span className="hidden md:inline-block">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span>{tab.badge}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className={tabsContentClassName}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabLayout;
