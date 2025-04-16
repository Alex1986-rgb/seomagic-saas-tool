
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuditTabsListProps {
  activeTab: string;
}

export const AuditTabsList: React.FC<AuditTabsListProps> = ({ activeTab }) => {
  return (
    <TabsList className="mb-4 sm:mb-6 grid grid-cols-2 md:grid-cols-4 gap-1">
      <TabsTrigger 
        value="seo" 
        className={`text-xs sm:text-sm ${activeTab === 'seo' ? 'font-medium' : ''}`}
      >
        SEO
      </TabsTrigger>
      <TabsTrigger 
        value="performance" 
        className={`text-xs sm:text-sm ${activeTab === 'performance' ? 'font-medium' : ''}`}
      >
        Производительность
      </TabsTrigger>
      <TabsTrigger 
        value="content" 
        className={`text-xs sm:text-sm ${activeTab === 'content' ? 'font-medium' : ''}`}
      >
        Контент
      </TabsTrigger>
      <TabsTrigger 
        value="technical" 
        className={`text-xs sm:text-sm ${activeTab === 'technical' ? 'font-medium' : ''}`}
      >
        Технические аспекты
      </TabsTrigger>
    </TabsList>
  );
};

export default AuditTabsList;
