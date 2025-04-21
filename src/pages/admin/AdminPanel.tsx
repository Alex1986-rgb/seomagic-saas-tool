
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
    title: "Главная",
    icon: <LayoutDashboard className="h-6 w-6" />,
    desc: "Панель управления сервисом SeoMarket.",
    group: "Общее"
  },
  {
    to: "/admin/users",
    title: "Пользователи",
    icon: <Users className="h-6 w-6" />,
    desc: "Управление и права пользователей.",
    group: "Данные"
  },
  {
    to: "/admin/analytics",
    title: "Аналитика",
    icon: <BarChart className="h-6 w-6" />,
    desc: "Визуализация и анализ платформенных данных.",
    group: "Данные"
  },
  {
    to: "/admin/audits",
    title: "Аудиты",
    icon: <ChartBar className="h-6 w-6" />,
    desc: "История проведенных аудитов.",
    group: "Данные"
  },
  {
    to: "/admin/hosting",
    title: "Хостинг",
    icon: <Server className="h-6 w-6" />,
    desc: "Управление хостинг-аккаунтами.",
    group: "Сайты"
  },
  {
    to: "/admin/sites",
    title: "Сайты",
    icon: <Globe className="h-6 w-6" />,
    desc: "Список сайтов платформы.",
    group: "Сайты"
  },
  {
    to: "/admin/website-analyzer",
    title: "Анализатор сайтов",
    icon: <Search className="h-6 w-6" />,
    desc: "Анализ и сканирование сайтов.",
    group: "Технологии"
  },
  {
    to: "/admin/system-status",
    title: "Статус системы",
    icon: <ChartBar className="h-6 w-6" />,
    desc: "Текущее состояние сервисов.",
    group: "Технологии"
  },
  {
    to: "/admin/monitoring",
    title: "Мониторинг",
    icon: <Monitor className="h-6 w-6" />,
    desc: "Контроль ключевых событий.",
    group: "Технологии"
  },
  {
    to: "/admin/notifications",
    title: "Уведомления",
    icon: <Bell className="h-6 w-6" />,
    desc: "Системные оповещения.",
    group: "Технологии"
  },
  {
    to: "/admin/settings",
    title: "Настройки",
    icon: <Settings className="h-6 w-6" />,
    desc: "Системные параметры платформы.",
    group: "Настройки"
  },
];

const groupOrder = [
  "Общее",
  "Данные",
  "Сайты",
  "Технологии",
  "Настройки"
];

// Эффектные цветовые и градиентные фоны
const groupBg: Record<string, string> = {
  "Общее": "bg-gradient-to-tr from-[#1A1F2C] to-[#403E43]",
  "Данные": "bg-gradient-to-tr from-[#24194B] via-[#7E69AB] to-[#1A2239]",
  "Сайты": "bg-gradient-to-tr from-[#0EA5E9] via-[#9b87f5] to-[#3B254C]",
  "Технологии": "bg-gradient-to-tr from-[#F97316] via-[#D946EF] to-[#1A1F2C]",
  "Настройки": "bg-gradient-to-tr from-[#1A1F2C] via-[#8B5CF6] to-[#403E43]",
};

const AdminPanel: React.FC = () => {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-10">
      <Helmet>
        <title>Панель администратора | SeoMarket</title>
      </Helmet>
      <div className="space-y-8">
        <div className="inline-block mb-2 px-4 py-1 bg-gradient-to-r from-[#8B5CF6]/40 to-[#0EA5E9]/60 text-white text-xs rounded-full shadow-md uppercase tracking-widest">
          Версия 2.8.1
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-[#9b87f5] via-[#F97316] to-[#0EA5E9] bg-clip-text text-transparent tracking-tight drop-shadow-2xl">Панель администратора</h1>
          <div className="text-base md:text-lg text-white/60 mb-8 font-inter">
            Управление платформой SeoMarket и всеми сервисами: быстро, удобно, современно.
            <span className="inline-block ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-[#D946EF]/70 to-[#0EA5E9]/70 text-white text-xs font-semibold">Модный · Цветной · Интуитивный</span>
          </div>
        </div>
        {groupOrder.map(group => {
          const cards = adminCards.filter(card => card.group === group);
          if (!cards.length) return null;
          return (
            <section key={group} className="mb-6 animate-fade-in">
              {group !== "Общее" && (
                <div className="mb-5 mt-10 flex items-center gap-2">
                  <div className="h-5 w-2 rounded-xl bg-gradient-to-b from-[#D946EF] to-[#0EA5E9]/70" />
                  <h2 className="uppercase font-bold text-xs tracking-widest text-[#9b87f5]">{group}</h2>
                  <div className="flex-1 h-0.5 rounded bg-gradient-to-r from-[#403E43] via-[#1A1F2C]/80 to-transparent ml-2" />
                </div>
              )}
              <div className={`grid sm:grid-cols-2 md:grid-cols-3 gap-5 p-6 rounded-2xl shadow-xl ${groupBg[group]} bg-blend-multiply bg-opacity-60`}>
                {cards.map((item) => (
                  <Link key={item.to} to={item.to} className="hover-scale group hover:no-underline focus:outline-none">
                    <Card className={`group/card h-full relative border-0 glassmorphic transition-all duration-200 outline-none
                      bg-[#23263B]/60 hover:scale-[1.035] shadow-lg hover:shadow-2xl after:absolute after:inset-0 after:bg-gradient-to-br after:opacity-0 group-hover/card:after:opacity-25 after:from-[#8B5CF6]/40 after:to-[#0EA5E9]/40 after:rounded-2xl`}>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="h-12 w-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#8B5CF6]/70 to-[#0EA5E9]/90 text-white shadow group-hover:bg-[#F97316] transition-all duration-150">
                          {item.icon}
                        </div>
                        <div className="font-semibold text-white text-base mb-2 tracking-tight">{item.title}</div>
                        <p className="text-sm text-white/70 flex-grow">{item.desc}</p>
                        <div className="mt-4 flex items-center gap-1 text-xs text-gradient-primary font-semibold tracking-wide group-hover:ml-1 transition-all">
                          Перейти
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-gradient-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
