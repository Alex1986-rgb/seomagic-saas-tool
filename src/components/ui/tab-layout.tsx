
import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface TabLayoutProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabsListClassName?: string;
  className?: string;
}

export const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  activeTab,
  onTabChange,
  tabsListClassName,
  className
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className={cn("w-full", className)}>
      <TabsList className={cn("grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full", tabsListClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
          >
            {tab.icon}
            <span className="hidden sm:inline truncate">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 md:mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
