
import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, Server, BarChart, Bell, Gauge, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    to: "/admin/monitoring",
    label: "Мониторинг",
    icon: <Monitor className="h-5 w-5" />,
    desc: "Графики и счетчики загрузки",
  },
  {
    to: "/admin/users",
    label: "Пользователи",
    icon: <Users className="h-5 w-5" />,
    desc: "Управление пользователями",
  },
  {
    to: "/admin/analytics",
    label: "Аналитика",
    icon: <BarChart className="h-5 w-5" />,
    desc: "Статистика платформы",
  },
  {
    to: "/admin/system-status",
    label: "Состояние системы",
    icon: <Server className="h-5 w-5" />,
    desc: "Загрузка и база данных",
  },
  {
    to: "/admin/notifications",
    label: "Уведомления",
    icon: <Bell className="h-5 w-5" />,
    desc: "Системные сообщения",
  },
  {
    to: "/admin/settings",
    label: "Настройки",
    icon: <Gauge className="h-5 w-5" />,
    desc: "Все параметры системы",
  },
];

const stats = [
  {
    title: "Пользователи",
    value: "847",
    icon: <Users className="h-7 w-7 text-blue-500" />,
    color: "bg-blue-50",
  },
  {
    title: "Активные сессии",
    value: "36",
    icon: <Monitor className="h-7 w-7 text-green-500" />,
    color: "bg-green-50",
  },
  {
    title: "API запросы/мин",
    value: "542",
    icon: <Server className="h-7 w-7 text-purple-500" />,
    color: "bg-purple-50",
  },
  {
    title: "Ошибки (24ч)",
    value: "3",
    icon: <Bell className="h-7 w-7 text-red-500" />,
    color: "bg-red-50",
  }
];

const AdminDashboard = () => (
  <>
    <Helmet>
      <title>Главная | Админ панель</title>
    </Helmet>
    <div className="container max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 px-6 py-8 rounded-2xl bg-gradient-to-br from-primary/5 via-white/60 to-blue-50 shadow-lg flex flex-col md:flex-row items-center gap-8 border border-primary/10 animate-fade-in">
        <div className="flex-shrink-0 bg-primary/10 text-primary rounded-full p-4">
          <LayoutDashboard className="h-10 w-10" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            Админ-панель платформы
          </h1>
          <p className="text-muted-foreground text-lg">
            Добро пожаловать! Здесь вы управляете системой, пользователями, настройками, следите за мониторингом и статистикой в реальном времени.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-fade-in">
        {stats.map((stat, i) => (
          <Card key={i} className={`shadow border-0 hover:shadow-lg transition ${stat.color}`}>
            <CardContent className="flex flex-col items-center gap-2 py-7">
              <div className="rounded-xl p-3 bg-white shadow">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Быстрый доступ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8 animate-fade-in">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className="group">
            <Card className="shadow-md border-0 hover:shadow-xl hover:bg-primary/5 transition-all h-full">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl p-3 bg-secondary/80 group-hover:bg-primary/10">
                  {link.icon}
                </div>
                <div>
                  <div className="text-lg font-bold">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.desc}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  </>
)

export default AdminDashboard;
