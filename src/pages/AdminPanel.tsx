
import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Search,
  Grid3X3,
  Bell,
  Server
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4">
            <div>
              <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                Версия 2.8.1
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Панель администратора</h1>
              <p className="text-lg text-muted-foreground">
                Централизованное управление сервисом SeoMarket
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link to="/admin">
                <Button variant="outline" className="flex items-center gap-2" size="sm">
                  <BarChart3 className="h-4 w-4" />
                  Дашборд
                </Button>
              </Link>
              <Link to="/admin/notifications">
                <Button variant="outline" className="flex items-center gap-2" size="sm">
                  <Bell className="h-4 w-4" />
                  <span className="relative">
                    Уведомления
                    <span className="absolute -top-1 -right-3 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                    </span>
                  </span>
                </Button>
              </Link>
              <Link to="/admin/monitoring">
                <Button className="flex items-center gap-2" size="sm">
                  <Grid3X3 className="h-4 w-4" />
                  Мониторинг
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Аналитика */}
            <Link to="/admin/analytics">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Аналитика</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Обзор ключевых метрик, статистика использования и бизнес-показатели платформы.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Пользователи */}
            <Link to="/admin/users">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Пользователи</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Управление аккаунтами, подписками, правами доступа и активностью пользователей.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Аудиты */}
            <Link to="/admin/audits">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Аудиты</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    История проведенных аудитов, статусы и результаты, экспорт отчетов.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Позиции */}
            <Link to="/admin/positions">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Search className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Позиции</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Отслеживание позиций сайтов в поисковых системах, динамика и тренды.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Платежи */}
            <Link to="/admin/payments">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Платежи</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    История транзакций, управление подписками, тарифами и методами оплаты.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* Настройки */}
            <Link to="/admin/settings">
              <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Settings className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Настройки</h2>
                  <p className="text-muted-foreground text-sm flex-grow">
                    Конфигурация приложения, интеграции, локализация и другие системные настройки.
                  </p>
                  <div className="text-primary font-medium mt-4 flex items-center text-sm">
                    Перейти в раздел
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="mt-8">
            <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Быстрый доступ к системным настройкам</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                  <Link to="/admin/system-status">
                    <Button variant="outline" className="w-full justify-start">
                      Состояние системы
                    </Button>
                  </Link>
                  <Link to="/admin/system/database">
                    <Button variant="outline" className="w-full justify-start">
                      База данных
                    </Button>
                  </Link>
                  <Link to="/admin/system/security">
                    <Button variant="outline" className="w-full justify-start">
                      Безопасность
                    </Button>
                  </Link>
                  <Link to="/admin/system/performance">
                    <Button variant="outline" className="w-full justify-start">
                      Производительность
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
