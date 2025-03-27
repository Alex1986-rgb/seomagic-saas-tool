
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
  Search,
  Grid3X3,
  Bell
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Панель администратора</h1>
              <p className="text-lg text-muted-foreground">
                Управление сервисом SeoMarket, пользователями и аудитами
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <Server className="h-4 w-4" />
                Состояние системы
              </Button>
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <Bell className="h-4 w-4" />
                Уведомления
              </Button>
              <Button className="flex items-center gap-2" size="sm">
                <Grid3X3 className="h-4 w-4" />
                Панель мониторинга
              </Button>
            </div>
          </div>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 mb-8 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Статистика платформы</CardTitle>
              <CardDescription>Общая информация о платформе за последние 30 дней</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Пользователей</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">1,248</p>
                    <span className="text-xs text-green-500">+12%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Аудитов</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">3,567</p>
                    <span className="text-xs text-green-500">+24%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Доход</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">₽245,890</p>
                    <span className="text-xs text-green-500">+8%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Активные планы</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">578</p>
                    <span className="text-xs text-green-500">+5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="analytics">
            <div className="mb-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 p-1 bg-secondary/40 rounded-lg">
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Аналитика</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Пользователи</span>
                </TabsTrigger>
                <TabsTrigger value="audits" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Аудиты</span>
                </TabsTrigger>
                <TabsTrigger value="positions" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Позиции</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Платежи</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Настройки</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
