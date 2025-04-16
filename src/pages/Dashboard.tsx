
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectSelector from '@/components/dashboard/ProjectSelector';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import DashboardAnalyticsTab from '@/components/dashboard/analytics/DashboardAnalyticsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { user, signOut } = useAuth();

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-2xl font-bold">SEO Аналитика</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {user?.email}
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <ProjectSelector />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="audit">Аудит</TabsTrigger>
          <TabsTrigger value="positions">Позиции</TabsTrigger>
          <TabsTrigger value="keywords">Ключевые слова</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <DashboardAnalyticsTab />
        </TabsContent>
        
        <TabsContent value="audit">
          <div className="p-8 text-center text-muted-foreground">
            Функциональность аудита будет доступна в ближайшем обновлении
          </div>
        </TabsContent>
        
        <TabsContent value="positions">
          <div className="p-8 text-center text-muted-foreground">
            Отслеживание позиций будет доступно в ближайшем обновлении
          </div>
        </TabsContent>
        
        <TabsContent value="keywords">
          <div className="p-8 text-center text-muted-foreground">
            Анализ ключевых слов будет доступен в ближайшем обновлении
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
