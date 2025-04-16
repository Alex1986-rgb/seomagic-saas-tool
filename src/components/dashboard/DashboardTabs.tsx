
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart2, FileText, Globe } from 'lucide-react';
import DashboardOverviewTab from './overview/DashboardOverviewTab';
import DashboardAnalyticsTab from './analytics/DashboardAnalyticsTab';
import DashboardReportsTab from './reports/DashboardReportsTab';
import DashboardProjectsTab from './projects/DashboardProjectsTab';

interface DashboardTabsProps {
  defaultTab?: string;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ defaultTab = "overview" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue={defaultTab} className="space-y-8">
        <TabsList className="w-full overflow-x-auto scrollbar-none border p-1 rounded-lg">
          <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs sm:text-sm">
            <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 text-xs sm:text-sm">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            Отчеты
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2 text-xs sm:text-sm">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            Проекты
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardOverviewTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <DashboardAnalyticsTab />
        </TabsContent>
        
        <TabsContent value="reports">
          <DashboardReportsTab />
        </TabsContent>
        
        <TabsContent value="projects">
          <DashboardProjectsTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DashboardTabs;
