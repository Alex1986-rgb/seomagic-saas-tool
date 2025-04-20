import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Database, Monitor, BarChart, Server, Gauge, Signal } from "lucide-react";

const statCards = [
  {
    title: "Загрузка CPU",
    value: "34%",
    icon: <Gauge className="h-6 w-6 text-blue-500" />,
    description: "Нагрузка на процессор",
    color: "bg-blue-50",
  },
  {
    title: "Использование памяти",
    value: "68%",
    icon: <Signal className="h-6 w-6 text-purple-500" />,
    description: "Физическая/виртуальная",
    color: "bg-purple-50",
  },
  {
    title: "Баз данных",
    value: "Подключено",
    icon: <Database className="h-6 w-6 text-green-600" />,
    description: "Основная база данных",
    color: "bg-emerald-50",
  },
  {
    title: "Онлайн-юзеров",
    value: "14",
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    description: "Текущие подключения",
    color: "bg-emerald-50",
  },
  {
    title: "Рассылки/оповещения",
    value: "12 / 2",
    icon: <Monitor className="h-6 w-6 text-teal-600" />,
    description: "Email / Критические",
    color: "bg-teal-50",
  },
  {
    title: "Ошибки и сбои",
    value: "2",
    icon: <Server className="h-6 w-6 text-orange-600" />,
    description: "За 24 часа",
    color: "bg-orange-50",
  },
  {
    title: "Последний аудит",
    value: "19.04.2025",
    icon: <BarChart className="h-6 w-6 text-sky-600" />,
    description: "Дата проверки",
    color: "bg-sky-50",
  },
  {
    title: "Доход (месяц)",
    value: "₽284,500",
    icon: <Gauge className="h-6 w-6 text-green-700" />,
    description: "Финансовые показатели",
    color: "bg-green-50",
  },
];

const sectionLinks = [
  {
    label: "База данных", 
    description: "Настройки подключения и оптимизации", 
    to: "/admin/system/database",
    icon: <Database className="h-6 w-6" />
  },
  {
    label: "Безопасность",
    description: "Защита и политики доступа",
    to: "/admin/system/security",
    icon: <Server className="h-6 w-6" />
  },
  {
    label: "Пользователи",
    description: "Администраторы и права",
    to: "/admin/system/users",
    icon: <Activity className="h-6 w-6" />
  },
  {
    label: "Уведомления",
    description: "Email, SMS, мониторинг",
    to: "/admin/system/notifications",
    icon: <Monitor className="h-6 w-6" />
  },
  {
    label: "Аналитика",
    description: "Отчеты и интеграции",
    to: "/admin/system/analytics",
    icon: <BarChart className="h-6 w-6" />
  },
  {
    label: "Производительность",
    description: "Мониторинг и автоматизация",
    to: "/admin/system/performance",
    icon: <Gauge className="h-6 w-6" />
  }
];

const systemWarnings = [
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

const AdminMonitoringPage: React.FC = () => (
  <div className="container mx-auto px-4 py-12 max-w-7xl">
    <h1 className="text-2xl md:text-3xl font-bold mb-5">Панель мониторинга системы</h1>
    <p className="text-muted-foreground mb-7 max-w-2xl">Актуальный статус платформы, основные показатели работы, быстрые переходы в ключевые разделы управления и критические уведомления.</p>
    
    {/* Важные системные предупреждения */}
    {systemWarnings.length > 0 && (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {systemWarnings.map((w, i) => (
            <div 
              key={i} 
              className={
                "rounded-lg p-4 flex items-center gap-3 " +
                (w.type === "warning"
                  ? "bg-amber-50 text-amber-800"
                  : w.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-900"
                )
              }
            >
              {w.type === "error" ? <Server className="h-5 w-5" /> : w.type === "warning" ? <Gauge className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              <span className="text-sm">{w.message}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Главные показатели */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
      {statCards.slice(0, 4).map((card, i) => (
        <Card className="shadow hover:shadow-md transition" key={card.title}>
          <CardContent className={`flex items-center gap-5 py-6 ${card.color}`}>
            <div className="rounded-xl bg-white/80 p-3 shadow">{card.icon}</div>
            <div>
              <div className="text-xs text-muted-foreground">{card.title}</div>
              <div className="text-xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.description}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Быстрые переходы в системные разделы */}
    <div>
      <h2 className="text-xl font-semibold mb-3">Основные разделы управления</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {sectionLinks.map((section) => (
          <Link key={section.to} to={section.to} className="group">
            <Card className="shadow hover:shadow-lg hover:bg-primary/10 transition-all group">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="rounded-xl p-3 bg-secondary/80 group-hover:bg-primary/10">{section.icon}</div>
                <div>
                  <div className="text-lg font-bold">{section.label}</div>
                  <div className="text-xs text-muted-foreground">{section.description}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>

    {/* Расширенный мониторинг */}
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">Расширенный мониторинг и статистика</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {statCards.slice(4).map((card) => (
          <Card className="shadow" key={card.title}>
            <CardContent className={`flex items-center gap-5 py-6 ${card.color}`}>
              <div className="rounded-xl bg-white/80 p-3 shadow">{card.icon}</div>
              <div>
                <div className="text-xs text-muted-foreground">{card.title}</div>
                <div className="text-xl font-bold">{card.value}</div>
                <div className="text-xs text-muted-foreground">{card.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    {/* Логи действий администратора */}
    <div>
      <h2 className="text-xl font-semibold mb-3">Журнал событий</h2>
      <Card className="mb-8">
        <CardContent className="py-5">
          <ul className="divide-y divide-border/30 text-sm">
            <li className="py-2 flex justify-between">
              <span className="text-muted-foreground">[19.04.2025 09:12]</span>
              <span>Вход администратора <b>admin</b></span>
              <span className="text-emerald-600">Успех</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="text-muted-foreground">[19.04.2025 08:51]</span>
              <span>Изменены настройки безопасности</span>
              <span className="text-blue-600">Обновление</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="text-muted-foreground">[19.04.2025 07:44]</span>
              <span>Выполнена SMS-рассылка</span>
              <span className="text-yellow-600">Оповещение</span>
            </li>
            <li className="py-2 flex justify-between">
              <span className="text-muted-foreground">[18.04.2025 19:33]</span>
              <span>Автоматическая проверка системы</span>
              <span className="text-sky-600">Мониторинг</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminMonitoringPage;
