
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  CreditCard, 
  FileText, 
  Bell, 
  History, 
  BarChart 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientAudits from '@/components/client/ClientAudits';
import ClientSettings from '@/components/client/ClientSettings';
import ClientSubscription from '@/components/client/ClientSubscription';
import ClientReports from '@/components/client/ClientReports';

const ClientProfile: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Личный кабинет</h1>
            <p className="text-lg text-muted-foreground">
              Управляйте вашими SEO-аудитами, подпиской и настройками
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="neo-card p-6 text-center mb-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Иван Петров</h3>
                <p className="text-muted-foreground">Pro план</p>
                <p className="text-sm text-muted-foreground mt-1">Участник с Мая 2023</p>
              </div>
              
              <nav className="neo-card p-4 space-y-1">
                <NavButton 
                  active={true} 
                  icon={<History size={18} />} 
                  onClick={() => {}}
                >
                  История аудитов
                </NavButton>
                <NavButton 
                  active={false} 
                  icon={<BarChart size={18} />} 
                  onClick={() => {}}
                >
                  Статистика
                </NavButton>
                <NavButton 
                  active={false} 
                  icon={<FileText size={18} />} 
                  onClick={() => {}}
                >
                  Отчеты
                </NavButton>
                <NavButton 
                  active={false} 
                  icon={<CreditCard size={18} />} 
                  onClick={() => {}}
                >
                  Подписка
                </NavButton>
                <NavButton 
                  active={false} 
                  icon={<Bell size={18} />} 
                  onClick={() => {}}
                >
                  Уведомления
                </NavButton>
                <NavButton 
                  active={false} 
                  icon={<Settings size={18} />} 
                  onClick={() => {}}
                >
                  Настройки
                </NavButton>
              </nav>
            </div>
            
            <div className="md:col-span-3">
              <Tabs defaultValue="audits">
                <TabsList className="mb-6">
                  <TabsTrigger value="audits" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>История аудитов</span>
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Отчеты</span>
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Подписка</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Настройки</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="neo-card p-6">
                  <TabsContent value="audits">
                    <ClientAudits />
                  </TabsContent>
                  
                  <TabsContent value="reports">
                    <ClientReports />
                  </TabsContent>
                  
                  <TabsContent value="subscription">
                    <ClientSubscription />
                  </TabsContent>
                  
                  <TabsContent value="settings">
                    <ClientSettings />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const NavButton: React.FC<{
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ children, icon, active, onClick }) => (
  <button
    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'text-foreground hover:bg-secondary'
    }`}
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{children}</span>
  </button>
);

export default ClientProfile;
