
import { 
  Cpu, Server, HardDrive, Activity, TrendingDown, TrendingUp, Database, Monitor, BarChart, Gauge, AlertTriangle, Info 
} from "lucide-react";
import type { StatCard } from "./StatCards";
import type { SystemWarning } from "./SystemWarnings";
import type { SystemStatusItem } from "./SystemStatusGrid";

export const cpuUsageData = [
  { time: '00:00', value: 25 },
  { time: '04:00', value: 15 },
  { time: '08:00', value: 30 },
  { time: '12:00', value: 45 },
  { time: '16:00', value: 60 },
  { time: '20:00', value: 34 },
  { time: '24:00', value: 28 },
];

export const memoryUsageData = [
  { time: '00:00', value: 52 },
  { time: '04:00', value: 48 },
  { time: '08:00', value: 60 },
  { time: '12:00', value: 68 },
  { time: '16:00', value: 74 },
  { time: '20:00', value: 62 },
  { time: '24:00', value: 58 },
];

export const diskUsageData = [
  { name: 'Системные', value: 25 },
  { name: 'Базы данных', value: 35 },
  { name: 'Логи', value: 15 },
  { name: 'Медиа', value: 20 },
  { name: 'Свободно', value: 5 },
];

export const trafficData = [
  { day: 'Пн', входящий: 3200, исходящий: 1800 },
  { day: 'Вт', входящий: 3800, исходящий: 2200 },
  { day: 'Ср', входящий: 4200, исходящий: 3000 },
  { day: 'Чт', входящий: 3600, исходящий: 2400 },
  { day: 'Пт', входящий: 4800, исходящий: 3800 },
  { day: 'Сб', входящий: 2400, исходящий: 1600 },
  { day: 'Вс', входящий: 1800, исходящий: 1000 },
];

export const errorDistributionData = [
  { name: 'Критические', value: 2, color: '#ef4444' },
  { name: 'Предупреждения', value: 8, color: '#f97316' },
  { name: 'Информационные', value: 15, color: '#3b82f6' },
];

export const statCards: StatCard[] = [
  {
    title: "Загрузка CPU",
    value: "34%",
    icon: "cpu",
    description: "Средняя за 15 минут",
    color: "bg-blue-50",
    trend: { value: -3, icon: "trending-down" }
  },
  {
    title: "Использование памяти",
    value: "68%",
    icon: "server",
    description: "8.2 ГБ / 12 ГБ",
    color: "bg-purple-50",
    trend: { value: 5, icon: "trending-up" }
  },
  {
    title: "Диск",
    value: "47%",
    icon: "hard-drive",
    description: "234 ГБ / 500 ГБ",
    color: "bg-emerald-50",
    trend: { value: 2, icon: "trending-up" }
  },
  {
    title: "Активных сессий",
    value: "14",
    icon: "activity",
    description: "Текущие подключения",
    color: "bg-emerald-50",
    trend: { value: -1, icon: "trending-down" }
  },
];

export const systemStatus: SystemStatusItem[] = [
  {
    name: "База данных",
    status: "Online",
    uptime: "99.98%",
    lastRestart: "19.04.2025 02:15",
    icon: "database"
  },
  {
    name: "API сервер",
    status: "Online",
    uptime: "99.95%",
    lastRestart: "18.04.2025 23:42",
    icon: "server"
  },
  {
    name: "Веб-сервер",
    status: "Online",
    uptime: "100%",
    lastRestart: "17.04.2025 08:10",
    icon: "monitor"
  },
  {
    name: "Обработчик задач",
    status: "Warning",
    uptime: "98.5%",
    lastRestart: "19.04.2025 10:30",
    icon: "alert-triangle"
  },
];

export const recentEvents = [
  { time: "19.04.2025 15:42", event: "Автоматическое резервное копирование", type: "info", icon: "info" },
  { time: "19.04.2025 14:15", event: "Обнаружена высокая загрузка CPU (82%)", type: "warning", icon: "alert-triangle" },
  { time: "19.04.2025 12:30", event: "Запуск переиндексации базы данных", type: "info", icon: "database" },
  { time: "19.04.2025 09:12", event: "Вход администратора admin", type: "info", icon: "activity" },
  { time: "19.04.2025 08:51", event: "Обновлены настройки безопасности", type: "info", icon: "server" },
  { time: "19.04.2025 07:44", event: "Выполнена SMS-рассылка", type: "info", icon: "activity" },
  { time: "19.04.2025 05:30", event: "Сбой API запроса к внешнему сервису", type: "error", icon: "alert-triangle" },
];

export const sectionLinks = [
  {
    label: "База данных", 
    description: "Настройки подключения и оптимизации", 
    to: "/admin/system/database",
    icon: "database"
  },
  {
    label: "Безопасность",
    description: "Защита и политики доступа",
    to: "/admin/system/security",
    icon: "server"
  },
  {
    label: "Пользователи",
    description: "Администраторы и права",
    to: "/admin/system/users",
    icon: "activity"
  },
  {
    label: "Уведомления",
    description: "Email, SMS, мониторинг",
    to: "/admin/system/notifications",
    icon: "monitor"
  },
  {
    label: "Аналитика",
    description: "Отчеты и интеграции",
    to: "/admin/system/analytics",
    icon: "bar-chart"
  },
  {
    label: "Производительность",
    description: "Мониторинг и автоматизация",
    to: "/admin/system/performance",
    icon: "gauge"
  }
];

export const systemWarnings: SystemWarning[] = [
  {
    type: "warning",
    message: "Доступно обновление сервера до версии 2.8.1 — рекомендуется установить.",
  },
  {
    type: "error",
    message: "Критическая ошибка: найдено 2 сбоя API за последние сутки.",
  },
  {
    type: "info",
    message: "Подключены все внешние интеграции (Slack, Google Analytics)."
  }
];

export const serverInfoData = [
  { label: "Операционная система", value: "Ubuntu 22.04 LTS" },
  { label: "Версия PHP", value: "8.2.10" },
  { label: "База данных", value: "PostgreSQL 15.2" },
  { label: "Веб-сервер", value: "Nginx 1.22.1" },
  { label: "Ядра CPU", value: "8 (Intel Xeon E5-2686)" },
  { label: "Оперативная память", value: "12 GB DDR4" },
  { label: "Дата установки", value: "12.02.2025" },
  { label: "Время работы", value: "42 дня 8 часов" },
];

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
