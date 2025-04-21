
import React from 'react';
import { 
  LayoutDashboard,
  Search,
  ChartBar,
  Bell,
  Monitor,
  Settings,
  Users,
  BarChart,
  Server,
  Globe,
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

type AdminCardItem = {
  to: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
  group: string;
};

const adminCards: AdminCardItem[] = [
  {
    to: "/admin",
    title: "Главная (Дашборд)",
    icon: <LayoutDashboard className="h-6 w-6" />,
    desc: "Основная панель управления и сводка по работе сервиса.",
    group: "Главное"
  },
  {
    to: "/admin/users",
    title: "Пользователи",
    icon: <Users className="h-6 w-6" />,
    desc: "Аккаунты, права, истории активности пользователей.",
    group: "Ключевые разделы"
  },
  {
    to: "/admin/analytics",
    title: "Аналитика",
    icon: <BarChart className="h-6 w-6" />,
    desc: "Сбор, визуализация и анализ платформенных данных.",
    group: "Ключевые разделы"
  },
  {
    to: "/admin/audits",
    title: "Аудиты",
    icon: <ChartBar className="h-6 w-6" />,
    desc: "История и результаты проведенных аудитов.",
    group: "Ключевые разделы"
  },
  {
    to: "/admin/hosting",
    title: "Хостинг",
    icon: <Server className="h-6 w-6" />,
    desc: "Управление хостингами сайтов.",
    group: "Ключевые разделы"
  },
  {
    to: "/admin/sites",
    title: "Сайты",
    icon: <Globe className="h-6 w-6" />,
    desc: "Работа с сайтами и их настройками.",
    group: "Ключевые разделы"
  },
  {
    to: "/admin/website-analyzer",
    title: "Анализатор веб-сайтов",
    icon: <Search className="h-6 w-6" />,
    desc: "Инструменты для анализа и сканирования сайтов.",
    group: "Технологии и сервисы"
  },
  {
    to: "/admin/system-status",
    title: "Статус системы",
    icon: <ChartBar className="h-6 w-6" />,
    desc: "Актуальное состояние сервисов и инфраструктуры.",
    group: "Технологии и сервисы"
  },
  {
    to: "/admin/monitoring",
    title: "Мониторинг",
    icon: <Monitor className="h-6 w-6" />,
    desc: "Контроль ключевых показателей и событий сервиса.",
    group: "Технологии и сервисы"
  },
  {
    to: "/admin/notifications",
    title: "Уведомления",
    icon: <Bell className="h-6 w-6" />,
    desc: "Оповещения и важные системные сообщения.",
    group: "Технологии и сервисы"
  },
  {
    to: "/admin/settings",
    title: "Настройки админки",
    icon: <Settings className="h-6 w-6" />,
    desc: "Глобальные и системные параметры платформы.",
    group: "Системные разделы"
  },
];

const groupOrder = [
  "Главное",
  "Ключевые разделы",
  "Технологии и сервисы",
  "Системные разделы"
];

const groupBg: Record<string, string> = {
  "Главное": "from-primary/15 to-gray-100/0",
  "Ключевые разделы": "from-blue-50 to-indigo-50",
  "Технологии и сервисы": "from-sky-50 to-green-50",
  "Системные разделы": "from-yellow-50 to-orange-50"
};

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 py-8">
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="inline-block mb-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
          Версия 2.8.1
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-1 tracking-tight">Панель администратора</h1>
          <div className="text-lg text-muted-foreground mb-6">
            Централизованное управление сервисом SeoMarket. <span className="inline-block ml-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">Интуитивно · Современно</span>
          </div>
        </div>
        {groupOrder.map(group => {
          const cards = adminCards.filter(card => card.group === group);
          if (!cards.length) return null;
          return (
            <section key={group} className="mb-6">
              {group !== "Главное" && (
                <div className="mb-4 mt-8 flex items-center gap-2">
                  <div className="h-5 w-2 rounded bg-primary/30" />
                  <h2 className="uppercase font-semibold text-sm tracking-widest">{group}</h2>
                  <div className="flex-1 h-px bg-primary/10 ml-2" />
                </div>
              )}
              {/* Responsive cards */}
              <div className={`grid sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in bg-gradient-to-tr ${groupBg[group]} rounded-xl p-4`}>
                {cards.map((item) => (
                  <Link key={item.to} to={item.to}>
                    <Card className="group h-full backdrop-blur-sm bg-white/60 border border-primary/10 shadow-sm hover:shadow-lg hover:border-primary/20 hover:scale-[1.025] transition-all duration-200">
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="h-11 w-11 mb-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                          {item.icon}
                        </div>
                        <div className="font-semibold text-base mb-1">{item.title}</div>
                        <p className="text-muted-foreground text-sm flex-grow leading-snug">{item.desc}</p>
                        <div className="text-primary font-medium mt-4 flex items-center text-xs group-hover:ml-1 transition-all">
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
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanel;
