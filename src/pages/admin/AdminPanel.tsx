
import React from 'react';
import { 
  LayoutDashboard,
  Search,
  Monitor,
  Bell,
  Monitor as MonitorIcon,
  Settings,
  Users,
  ChartBar,
  Server,
  Globe
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const adminCards = [
  {
    to: "/admin",
    title: "Главная (Дашборд)",
    icon: <LayoutDashboard className="h-6 w-6" />,
    desc: "Основная панель управления и сводка по работе сервиса."
  },
  {
    to: "/admin/website-analyzer",
    title: "Анализатор веб-сайтов",
    icon: <Search className="h-6 w-6" />,
    desc: "Инструменты для анализа и сканирования сайтов."
  },
  {
    to: "/admin/system-status",
    title: "Статус системы",
    icon: <Monitor className="h-6 w-6" />,
    desc: "Актуальное состояние сервисов и инфраструктуры."
  },
  {
    to: "/admin/notifications",
    title: "Уведомления",
    icon: <Bell className="h-6 w-6" />,
    desc: "Оповещения и важные системные сообщения."
  },
  {
    to: "/admin/monitoring",
    title: "Мониторинг",
    icon: <MonitorIcon className="h-6 w-6" />,
    desc: "Контроль ключевых показателей и событий сервиса."
  },
  {
    to: "/admin/settings",
    title: "Настройки админки",
    icon: <Settings className="h-6 w-6" />,
    desc: "Глобальные и системные параметры платформы."
  },
  {
    to: "/admin/users",
    title: "Пользователи",
    icon: <Users className="h-6 w-6" />,
    desc: "Аккаунты, права, истории активности пользователей."
  },
  {
    to: "/admin/analytics",
    title: "Аналитика",
    icon: <ChartBar className="h-6 w-6" />,
    desc: "Сбор, визуализация и анализ платформенных данных."
  },
  {
    to: "/admin/hosting",
    title: "Хостинг",
    icon: <Server className="h-6 w-6" />,
    desc: "Управление хостингами сайтов."
  },
  {
    to: "/admin/sites",
    title: "Сайты",
    icon: <Globe className="h-6 w-6" />,
    desc: "Работа с сайтами и их настройками."
  },
];

const AdminPanel: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      
      <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div>
            <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              Версия 2.8.1
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Панель администратора</h1>
            <p className="text-lg text-muted-foreground">
              Централизованное управление сервисом SeoMarket
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((item) => (
              <Link key={item.to} to={item.to}>
                <Card className="group h-full backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-12 w-12 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {item.icon}
                    </div>
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                    <p className="text-muted-foreground text-sm flex-grow">{item.desc}</p>
                    <div className="text-primary font-medium mt-4 flex items-center text-sm">
                      Перейти
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;

