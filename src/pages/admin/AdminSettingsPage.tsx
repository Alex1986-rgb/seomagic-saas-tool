
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent } from "@/components/ui/card";
import { Settings, User, UserCheck, Globe, Shield, BellRing, Server, BarChart2, Gauge, ArrowRight, Monitor, BarChart, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Единая цветовая палитра блоков для яркого современного впечатления
const recentChanges = [
  { action: "Изменены настройки SMTP", user: "Анна С.", time: "20 мин назад" },
  { action: "Обновлены параметры кеширования", user: "Василий П.", time: "2 ч назад" },
  { action: "Добавлен новый тариф", user: "Максим К.", time: "вчера, 15:42" },
];

const navSettings = [
  {
    to: "/admin",
    label: "Главная",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    to: "/admin/monitoring",
    label: "Мониторинг",
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    to: "/admin/users",
    label: "Пользователи",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    to: "/admin/analytics",
    label: "Аналитика",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    to: "/admin/website-analyzer",
    label: "Анализатор сайтов",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    to: "/admin/system-status",
    label: "Статус системы",
    icon: <Shield className="h-5 w-5" />,
  }
];

const hotSettings = [
  { to: "/admin/system/security", label: "Параметры безопасности" },
  { to: "/admin/system/backup", label: "Резервное копирование" },
  { to: "/admin/system/api", label: "API ключи и доступ" },
  { to: "/admin/system/email", label: "Настройки почты" },
  { to: "/admin/system/logging", label: "Логирование событий" },
];

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Настройки | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white/80 to-purple-50 shadow-2xl flex flex-col md:flex-row items-center gap-8 border border-primary/15 animate-fade-in">
          <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 glass-morphism shadow-lg">
            <Settings className="h-12 w-12" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gradient-primary">Настройки администратора</h1>
            <p className="text-muted-foreground text-lg">
              Управление всеми ключевыми настройками и конфигурацией платформы с интеграцией мониторинга, аналитики и системы безопасности.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {navSettings.map((nav) => (
                <Link key={nav.to} to={nav.to}>
                  <Button variant="outline" className="hover-scale glass-button font-semibold gap-2">
                    <span>{nav.icon}</span>
                    <span>{nav.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6 md:mt-0 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-orange-50/80 text-orange-700 rounded-xl border border-orange-200 shadow px-5 py-3">
              <Gauge className="h-5 w-5 mr-1" />
              <div className="text-sm">
                <div className="font-medium">Мониторинг сервера</div>
                <div className="text-xs text-orange-500">CPU 32%, RAM 68%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-primary/5 rounded-xl border border-primary/10 shadow px-4 py-2">
              <BarChart2 className="h-5 w-5 mr-1 text-primary" />
              <span>Трафик: 72 тыс/мес</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-blue-50 via-white/80 to-indigo-50 border-0 shadow-2xl transition-transform hover:scale-105 duration-200">
              <CardContent className="p-0">
                <AdminSettings />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-green-50 to-white/90 border-0 shadow hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Недавние изменения</h3>
                </div>
                <div className="space-y-4">
                  {recentChanges.map((change, index) => (
                    <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{change.action}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                          <span>{change.user}</span>
                          <span>•</span>
                          <span>{change.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/admin/history">
                  <Button variant="outline" className="w-full mt-4 hover-scale glass-button" size="sm">
                    Просмотреть историю изменений
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-white/90 border-0 shadow hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Важные настройки</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {hotSettings.map(link => (
                    <Link key={link.to} to={link.to}>
                      <Button variant="outline" className="w-full justify-start mb-1 hover-scale glass-button shadow gap-2" size="sm">
                        <Monitor className="h-4 w-4 text-blue-700" />
                        {link.label}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
          <p className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <b>Возможности:</b> расширенное управление платформой, пользователи, интеграции, безопасность, уведомления.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Автоматическое логирование изменений</li>
            <li>Подтверждение для критичных операций</li>
            <li>Регулярное резервное копирование</li>
            <li>Гибкое восстановление из бэкапа для администраторов</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminSettingsPage;

