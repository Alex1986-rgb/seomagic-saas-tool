
import React from 'react';
import { Database, Shield, Users, Bell, BarChart2, Activity } from 'lucide-react';
import { Link } from "react-router-dom";

const TILES = [
  {
    icon: <Database className="h-4 w-4 text-primary" />,
    label: "База данных",
    desc: "Настройки подключения и оптимизации базы данных.",
    to: "/admin/system/database"
  },
  {
    icon: <Shield className="h-4 w-4 text-primary" />,
    label: "Безопасность",
    desc: "Настройки защиты и политики безопасности.",
    to: "/admin/system/security"
  },
  {
    icon: <Users className="h-4 w-4 text-primary" />,
    label: "Пользователи системы",
    desc: "Управление администраторами и их правами.",
    to: "/admin/system/users"
  },
  {
    icon: <Bell className="h-4 w-4 text-primary" />,
    label: "Системные уведомления",
    desc: "Настройка системных уведомлений и мониторинга.",
    to: "/admin/system/notifications"
  },
  {
    icon: <BarChart2 className="h-4 w-4 text-primary" />,
    label: "Аналитика",
    desc: "Настройки сбора и анализа данных о работе системы.",
    to: "/admin/system/analytics"
  },
  {
    icon: <Activity className="h-4 w-4 text-primary" />,
    label: "Производительность",
    desc: "Мониторинг и настройка производительности платформы.",
    to: "/admin/system/performance"
  }
];

const SystemSettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Системные настройки</h1>
        <p className="text-muted-foreground mb-6">Настройки сервера, баз данных и производительности.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TILES.map(tile => (
          <Link 
            key={tile.label}
            to={tile.to}
            className="p-4 border rounded-md bg-card hover:bg-accent/10 transition-colors block group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex items-center gap-2 mb-1">
              {tile.icon}
              <span className="font-medium text-lg group-hover:text-primary transition-colors">{tile.label}</span>
            </div>
            <div className="text-sm text-muted-foreground">{tile.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SystemSettingsPage;
