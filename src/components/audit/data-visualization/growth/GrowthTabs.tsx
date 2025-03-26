
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart } from 'lucide-react';

const GrowthTabs: React.FC = () => {
  return (
    <TabsList className="mb-6 grid grid-cols-3 max-w-md mx-auto">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4" />
        <span>Общий обзор</span>
      </TabsTrigger>
      <TabsTrigger value="seo" className="flex items-center gap-2">
        <LineChart className="h-4 w-4" />
        <span>SEO метрики</span>
      </TabsTrigger>
      <TabsTrigger value="performance" className="flex items-center gap-2">
        <LineChart className="h-4 w-4" />
        <span>Производительность</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default GrowthTabs;
