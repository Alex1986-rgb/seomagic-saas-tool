
import React from 'react';
import { Database, Shield, Users, Bell, BarChart2, Activity } from 'lucide-react';
import SystemInfo from './SystemInfo';
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Список разделов системных настроек
const TILES = [
  {
    icon: <Database className="h-5 w-5 text-primary" />,
    label: "База данных",
    desc: "Параметры подключения, мониторинг и оптимизация работы БД.",
    to: "/admin/system/database",
    badge: undefined,
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    label: "Безопасность",
    desc: "Двухфакторная аутентификация, политики и аудит.",
    to: "/admin/system/security",
    badge: undefined,
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    label: "Пользователи",
    desc: "Список пользователей, настройка ролей и ограничений.",
    to: "/admin/system/users",
    badge: undefined,
  },
  {
    icon: <Bell className="h-5 w-5 text-primary" />,
    label: "Уведомления",
    desc: "Системные email и SMS-оповещения, интеграция со Slack.",
    to: "/admin/system/notifications",
    badge: undefined,
  },
  {
    icon: <BarChart2 className="h-5 w-5 text-primary" />,
    label: "Аналитика",
    desc: "Google Analytics, сбор пользовательских событий.",
    to: "/admin/system/analytics",
    badge: undefined,
  },
  {
    icon: <Activity className="h-5 w-5 text-primary" />,
    label: "Производительность",
    desc: "Мониторинг ресурсов и автоматизация оповещений.",
    to: "/admin/system/performance",
    badge: undefined,
  }
];

const SystemSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTileClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Системные настройки</h1>
      <p className="text-muted-foreground mb-3 max-w-2xl">
        Управление инфраструктурой платформы: база данных, безопасность, пользователи, аналитика и мониторинг. Используйте быстрые переходы для настройки модулей — доступ к каждому разделу можно получить ниже.
      </p>

      <SystemInfo />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TILES.map(tile => (
          <Card 
            key={tile.label}
            className="cursor-pointer group hover:scale-[1.03] transition-transform shadow border bg-gradient-to-br from-blue-600/5 to-indigo-600/5"
            onClick={() => handleTileClick(tile.to)}
            tabIndex={0}
            role="button"
            aria-label={`Перейти на страницу ${tile.label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTileClick(tile.to);
              }
            }}
          >
            <CardContent className="py-5 px-4 flex items-start gap-4">
              <div className="rounded-lg bg-secondary/80 p-3">{tile.icon}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-md group-hover:text-primary transition">{tile.label}</span>
                  {tile.badge}
                </div>
                <div className="text-sm text-muted-foreground">{tile.desc}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> гибкая настройка платформы, мониторинг состояния модулей, расширенные интеграции, история изменений.</div>
        <ul className="list-disc pl-5">
          <li>Безопасное хранение данных и резервное копирование</li>
          <li>Детальное логирование действий</li>
          <li>Пороговые оповещения и автоматизация событий</li>
        </ul>
        <div>Для критических изменений система может потребовать подтверждение администратора.</div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
