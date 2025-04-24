
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Database, Shield, DatabaseBackup, Key, Mail, FileText, Users, Bell, BarChart2, Activity } from 'lucide-react';

export const SYSTEM_MODULES = [
  {
    icon: <Database className="h-5 w-5 text-primary" />,
    label: "База данных",
    desc: "Параметры подключения, мониторинг и оптимизация работы БД.",
    to: "/admin/system/database",
    badge: <Badge variant="outline" className="ml-2">В работе</Badge>,
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    label: "Безопасность",
    desc: "Параметры безопасности, двухфакторная аутентификация, политики и аудит.",
    to: "/admin/system/security",
    badge: undefined,
  },
  {
    icon: <DatabaseBackup className="h-5 w-5 text-primary" />,
    label: "Резервное копирование",
    desc: "Управление резервными копиями, автоматическое резервирование.",
    to: "/admin/system/backup",
    badge: undefined,
  },
  {
    icon: <Key className="h-5 w-5 text-primary" />,
    label: "API ключи и доступ",
    desc: "Управление API ключами для интеграции сервисов.",
    to: "/admin/system/api-keys",
    badge: undefined,
  },
  {
    icon: <Mail className="h-5 w-5 text-primary" />,
    label: "Настройки почты",
    desc: "Настройка SMTP, шаблоны писем, тестирование отправки.",
    to: "/admin/system/email",
    badge: undefined,
  },
  {
    icon: <FileText className="h-5 w-5 text-primary" />,
    label: "Логирование событий",
    desc: "Просмотр и настройка системных логов, мониторинг.",
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
    badge: <Badge variant="destructive" className="ml-2">ALERT</Badge>,
  }
];
