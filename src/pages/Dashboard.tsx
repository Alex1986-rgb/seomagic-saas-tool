
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart2, FileText, Globe, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverviewTab from '@/components/dashboard/overview/DashboardOverviewTab';
import DashboardAnalyticsTab from '@/components/dashboard/analytics/DashboardAnalyticsTab';
import DashboardReportsTab from '@/components/dashboard/reports/DashboardReportsTab';
import DashboardProjectsTab from '@/components/dashboard/projects/DashboardProjectsTab';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container py-10">
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
              <p className="text-muted-foreground">Добро пожаловать в вашу панель управления SeoMarket</p>
            </div>
            <Button 
              onClick={() => navigate('/audit')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Новый аудит
            </Button>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="w-full md:w-auto border p-1 rounded-lg">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Аналитика
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Отчеты
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
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
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
