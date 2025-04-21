
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent } from "@/components/ui/card";
import { Settings, UserCheck, Globe, Shield, BellRing, Server, Database, Gauge, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const recentChanges = [
  { action: "Изменены настройки SMTP", user: "Анна С.", time: "20 мин назад" },
  { action: "Обновлены параметры кеширования", user: "Василий П.", time: "2 ч назад" },
  { action: "Добавлен новый тариф", user: "Максим К.", time: "вчера, 15:42" },
];

const navSettings = [
  {
    to: "/admin/system-status",
    label: "Безопасность",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    to: "/admin/system/users",
    label: "Пользователи",
    icon: <UserCheck className="h-5 w-5" />,
  },
  {
    to: "/admin/system/database",
    label: "Интеграции",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    to: "/admin/system/performance",
    label: "Сервер",
    icon: <Server className="h-5 w-5" />,
  },
  {
    to: "/admin/system/notifications",
    label: "Уведомления",
    icon: <BellRing className="h-5 w-5" />,
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
      
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/20 text-primary p-2 rounded-lg shadow-md">
                <Settings className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Настройки администратора</h1>
            </div>
            <p className="text-muted-foreground">
              Управление всеми ключевыми настройками и конфигурацией платформы.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {navSettings.map((item) => (
              <Link to={item.to} key={item.to}>
                <Button variant="outline" className="flex items-center gap-2 hover-scale shadow" size="sm">
                  {item.icon}
                  {item.label}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-md bg-gradient-to-br from-card/90 to-secondary/40 border shadow-lg">
              <CardContent className="p-0">
                <AdminSettings />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-7">
            <Card className="bg-gradient-to-br from-green-50 to-white/80 border-green-100 shadow hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BellRing className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Недавние изменения</h3>
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
                  <Button variant="outline" className="w-full mt-4 hover-scale" size="sm">
                    Просмотреть историю изменений
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-white/90 border-blue-100 shadow hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Важные настройки</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {hotSettings.map(link => (
                    <Link key={link.to} to={link.to}>
                      <Button variant="outline" className="w-full justify-start mb-1 hover-scale" size="sm">
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
