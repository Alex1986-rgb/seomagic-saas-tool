
import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Users, Server, BarChart, Bell, Gauge, Monitor, Info, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const highlightedStats = [
  {
    title: "Пользователи",
    value: "847",
    icon: <Users className="h-7 w-7 text-blue-600" />,
    desc: "Всего зарегистрировано",
    color: "bg-blue-50",
    badge: "+15% за месяц",
  },
  {
    title: "Сессии онлайн",
    value: "36",
    icon: <Monitor className="h-7 w-7 text-green-500" />,
    desc: "В реальном времени",
    color: "bg-green-50",
    badge: "4 новых",
  },
  {
    title: "API активность",
    value: "542",
    icon: <Server className="h-7 w-7 text-purple-600" />,
    desc: "Запросов / минута",
    color: "bg-purple-50",
    badge: <TrendingUp className="h-4 w-4 text-green-500 ml-1" />,
  },
  {
    title: "Ошибки (24ч)",
    value: "3",
    icon: <Bell className="h-7 w-7 text-red-500" />,
    desc: "Критические сбои",
    color: "bg-red-50",
    badge: <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />,
  }
];

const quickLinks = [
  {
    to: "/admin/monitoring",
    label: "Мониторинг",
    icon: <Monitor className="h-6 w-6" />,
    desc: "Графики и счетчики состояния",
    color: "from-blue-200 to-violet-100"
  },
  {
    to: "/admin/users",
    label: "Пользователи",
    icon: <Users className="h-6 w-6" />,
    desc: "Управление правами и доступом",
    color: "from-cyan-200 to-emerald-100"
  },
  {
    to: "/admin/analytics",
    label: "Аналитика",
    icon: <BarChart className="h-6 w-6" />,
    desc: "Статистика и метрики платформы",
    color: "from-yellow-100 to-pink-50"
  },
  {
    to: "/admin/system-status",
    label: "Статус системы",
    icon: <Server className="h-6 w-6" />,
    desc: "Текущее состояние инфраструктуры",
    color: "from-green-100 to-blue-50"
  },
  {
    to: "/admin/notifications",
    label: "Уведомления",
    icon: <Bell className="h-6 w-6" />,
    desc: "Оповещения и рассылки",
    color: "from-orange-100 to-yellow-50"
  },
  {
    to: "/admin/settings",
    label: "Настройки",
    icon: <Settings className="h-6 w-6" />,
    desc: "Все параметры управления",
    color: "from-gray-100 to-blue-50"
  },
];

const importantAlerts = [
  {
    title: "Высокая нагрузка API",
    desc: "543 запроса/мин, рекомендуется увеличить лимиты",
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
    color: "bg-orange-50 border-orange-300 text-orange-700"
  }
];

const AdminDashboard = () => (
  <>
    <Helmet>
      <title>Главная | Админ панель</title>
    </Helmet>
    <div className="container max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-primary/10 via-white/60 to-blue-50 shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-primary/20 animate-fade-in">
        <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 glass-morphism shadow-lg">
          <LayoutDashboard className="h-12 w-12" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gradient-primary">Панель управления</h1>
          <p className="text-muted-foreground text-lg">
            Добро пожаловать, администратор! Управляйте платформой, получайте аналитику, мониторьте стабильность и реагируйте на важные события в один клик.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/admin/settings">
              <Button variant="default" className="hover-scale">Перейти к настройкам</Button>
            </Link>
            <Link to="/admin/monitoring">
              <Button variant="outline" className="hover-scale">
                <Monitor className="h-4 w-4 mr-1" /> Мониторинг
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="hover-scale">
                <BarChart className="h-4 w-4 mr-1" /> Аналитика
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 animate-fade-in">
        {highlightedStats.map((stat, i) => (
          <Card key={i} className={`shadow border-0 hover:shadow-lg transition-all ${stat.color}`}>
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <div className="rounded-xl p-3 bg-white/90 shadow">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
              <div className="text-xs text-green-600 font-semibold">{stat.badge}</div>
              <div className="text-xs text-muted-foreground">{stat.desc}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {importantAlerts.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {importantAlerts.map((a, i) => (
            <div key={i} className={`rounded-lg border shadow flex items-center gap-3 p-4 ${a.color}`}>
              {a.icon}
              <div className="flex-1">
                <div className="font-medium">{a.title}</div>
                <div className="text-sm">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 mt-10">Быстрый доступ к разделам</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mb-10 animate-fade-in">
        {quickLinks.map((link) => (
          <Link key={link.to} to={link.to} className="group">
            <Card className={`shadow-lg border-0 hover:shadow-2xl bg-gradient-to-br ${link.color} glass-morphism group-hover:scale-105 transition-all duration-200`}>
              <CardContent className="flex items-center gap-5 py-8 cursor-pointer">
                <div className="rounded-xl p-3 bg-white/90 group-hover:bg-primary/10 transition">
                  {link.icon}
                </div>
                <div>
                  <div className="text-lg font-bold group-hover:text-primary">{link.label}</div>
                  <div className="text-xs text-muted-foreground">{link.desc}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <b>Возможности:</b> современная статистика, мониторинг, быстрые действия и журнал событий.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Реалтайм анализ производительности</li>
          <li>Уведомления о сбоях и активности</li>
          <li>Управление доступом и аналитикой</li>
        </ul>
      </div>
    </div>
  </>
)

export default AdminDashboard;
