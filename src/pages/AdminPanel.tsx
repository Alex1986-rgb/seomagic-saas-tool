
import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  User, 
  Globe, 
  Server, 
  MessageSquare,
  Search
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminAudits from '@/components/admin/AdminAudits';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminPositions from '@/components/admin/AdminPositions';

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Панель администратора</h1>
            <p className="text-lg text-muted-foreground">
              Управление сервисом SeoMarket, пользователями и аудитами
            </p>
          </div>
          
          <Tabs defaultValue="analytics">
            <div className="mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span>Аналитика</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Пользователи</span>
                </TabsTrigger>
                <TabsTrigger value="audits" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Аудиты</span>
                </TabsTrigger>
                <TabsTrigger value="positions" className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  <span>Позиции</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Платежи</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Настройки</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="neo-card p-6">
              <TabsContent value="analytics">
                <AdminAnalytics />
              </TabsContent>
              
              <TabsContent value="users">
                <AdminUsers />
              </TabsContent>
              
              <TabsContent value="audits">
                <AdminAudits />
              </TabsContent>
              
              <TabsContent value="positions">
                <AdminPositions />
              </TabsContent>
              
              <TabsContent value="payments">
                <AdminPayments />
              </TabsContent>
              
              <TabsContent value="settings">
                <AdminSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
