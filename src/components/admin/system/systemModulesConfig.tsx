
import React from 'react';
import { Database, Shield, DatabaseBackup, Key, Mail, FileText, Users, Bell, BarChart2, Activity } from 'lucide-react';

export const SYSTEM_MODULES = [
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
    icon: <DatabaseBackup className="h-5 w-5 text-primary" />,
    label: "Резервное копирование",
    desc: "Из админки не управляется: копии базы делает Supabase.",
    to: "/admin/system/backup",
    badge: undefined,
  },
  {
    icon: <Key className="h-5 w-5 text-primary" />,
    label: "API ключи и доступ",
    desc: "Выдачи ключей нет; ключи поставщиков — в секретах проекта.",
    to: "/admin/system/api-keys",
    badge: undefined,
  },
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    label: "Настройки почты",
    desc: "Как отправляются письма и проверка отправки.",
    to: "/admin/system/email",
    badge: undefined,
  },
  {
    icon: <FileText className="h-5 w-5 text-primary" />,
    label: "Логирование событий",
    desc: "Последние вызовы серверных функций из журнала.",
    to: "/admin/system/logs",
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
