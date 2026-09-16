
import React from 'react';
import { Database, Shield, Users, Bell, BarChart2, Activity } from 'lucide-react';
import SystemInfo from './SystemInfo';
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

// Список разделов системных настроек
const TILES = [
  {
    icon: <Database className="h-5 w-5 text-primary" />,
    label: "База данных",
    desc: "Где смотреть подключения, нагрузку и структуру базы.",
    to: "/admin/system/database",
    badge: undefined,
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    label: "Безопасность",
    desc: "Кто отвечает за защиту входа и где она настраивается.",
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
    desc: "Каналы оповещений администратору (пока не подключены).",
    to: "/admin/system/notifications",
    badge: undefined,
  },
  {
    icon: <BarChart2 className="h-5 w-5 text-primary" />,
    label: "Аналитика",
    desc: "Счётчики работ платформы; посещаемость не измеряется.",
    to: "/admin/system/analytics",
    badge: undefined,
  },
  {
    icon: <Activity className="h-5 w-5 text-primary" />,
    label: "Производительность",
    desc: "Метрики сервера не собираются; вызовы функций — в мониторинге.",
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
        Разделы об инфраструктуре платформы: база данных, безопасность, пользователи, уведомления, аналитика и производительность.
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

      {/*
        Здесь был список «Возможности»: история изменений, резервное копирование,
        детальное логирование, пороговые оповещения. Ничего из этого в админке нет.
      */}
      <div className="mt-10 text-sm text-muted-foreground space-y-2">
        <div>
          Большинство разделов только объясняют, где настраивается та или иная часть платформы
          (Supabase, секреты проекта, сборка сайта): из админки эти параметры не меняются.
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
