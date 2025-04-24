import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Settings, 
  UserCheck, 
  Globe, 
  Shield, 
  BellRing, 
  Gauge, 
  BarChart2, 
  Monitor, 
  LayoutDashboard,
  FileText,
  Palette,
  Layout,
  User,
  Home,
  Newspaper,
  Briefcase,
  Megaphone,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  { to: "/admin/system/api-keys", label: "API ключи и доступ" },
  { to: "/admin/system/email", label: "Настройки почты" },
  { to: "/admin/system/logs", label: "Логирование событий" },
];

const managedPages = [
  {
    to: "/admin/content/home",
    label: "Главная страница",
    icon: <Home className="h-5 w-5" />,
    description: "Редактирование контента главной страницы"
  },
  {
    to: "/admin/content/about",
    label: "О нас",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Управление информацией о компании"
  },
  {
    to: "/admin/content/blog",
    label: "Блог",
    icon: <Newspaper className="h-5 w-5" />,
    description: "Управление статьями и постами"
  },
  {
    to: "/admin/content/features",
    label: "Возможности",
    icon: <Layout className="h-5 w-5" />,
    description: "Редактирование функций и возможностей"
  },
  {
    to: "/admin/content/client-cabinet",
    label: "Кабинет клиента",
    icon: <User className="h-5 w-5" />,
    description: "Настройка интерфейса кабинета"
  },
  {
    to: "/admin/content/marketing",
    label: "Маркетинг",
    icon: <Megaphone className="h-5 w-5" />,
    description: "Управление маркетинговыми материалами"
  },
  {
    to: "/admin/content/help",
    label: "Помощь",
    icon: <HelpCircle className="h-5 w-5" />,
    description: "Редактирование справочных материалов"
  }
];

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Настройки | Админ панель</title>
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl text-white">
        <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#222222] to-[#1a1a1a] text-white shadow-lg flex flex-col md:flex-row items-center gap-8 border border-white/10">
          <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full p-6 shadow-inner border border-primary/20">
            <Settings className="h-12 w-12" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Управление контентом
            </h1>
            <p className="text-gray-400 text-lg">
              Редактируйте и настраивайте контент всех страниц сайта, SEO-параметры и элементы интерфейса.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {navSettings.map((nav) => (
                <Link key={nav.to} to={nav.to}>
                  <Button variant="outline" className="hover:bg-white/5 border-white/10 text-white hover:text-primary font-semibold gap-2">
                    <span>{nav.icon}</span>
                    <span>{nav.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-6 md:mt-0 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-sm px-5 py-3">
              <Gauge className="h-5 w-5 mr-1 text-primary" />
              <div className="text-sm">
                <div className="font-medium text-white">Мониторинг сервера</div>
                <div className="text-xs text-gray-400">CPU 32%, RAM 68%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-sm px-4 py-2">
              <BarChart2 className="h-5 w-5 mr-1 text-primary" />
              <span className="text-gray-300">Трафик: 72 тыс/мес</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {managedPages.map((page) => (
            <Link key={page.to} to={page.to}>
              <Card className="hover:scale-[1.02] transition-all duration-200 bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg text-white h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/20 text-primary">
                      {page.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{page.label}</h3>
                      <p className="text-sm text-gray-400">{page.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg">
              <CardContent className="p-0">
                <AdminSettings />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Недавние изменения</h3>
                </div>
                <div className="space-y-4">
                  {recentChanges.map((change, index) => (
                    <div key={index} className="flex items-start gap-3 py-2 border-b last:border-0 border-white/10">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-200">{change.action}</p>
                        <div className="flex items-center text-xs text-gray-400 mt-1 gap-1">
                          <span>{change.user}</span>
                          <span>•</span>
                          <span>{change.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/admin/history">
                  <Button variant="outline" className="w-full mt-4 border-white/10 text-white hover:bg-white/5" size="sm">
                    Просмотреть историю изменений
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#222222] to-[#1a1a1a] border border-white/10 shadow-lg text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Важные настройки</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {hotSettings.map(link => (
                    <Link key={link.to} to={link.to}>
                      <Button variant="outline" className="w-full justify-start mb-1 border-white/10 text-white hover:bg-white/5" size="sm">
                        <Monitor className="h-4 w-4 text-primary mr-2" />
                        {link.label}
                        <ArrowRight className="h-4 w-4 ml-auto" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 text-sm text-gray-400 space-y-3 max-w-3xl">
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
