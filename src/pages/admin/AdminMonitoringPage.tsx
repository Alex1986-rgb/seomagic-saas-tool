
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Activity, 
  Database, 
  Monitor, 
  BarChart, 
  Server, 
  Gauge, 
  Signal,
  Clock,
  HardDrive,
  Memory,
  Cpu,
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import SparkAreaChart from "@/components/charts/SparkAreaChart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Примеры данных для графиков
const cpuUsageData = [
  { time: '00:00', value: 25 },
  { time: '04:00', value: 15 },
  { time: '08:00', value: 30 },
  { time: '12:00', value: 45 },
  { time: '16:00', value: 60 },
  { time: '20:00', value: 34 },
  { time: '24:00', value: 28 },
];

const memoryUsageData = [
  { time: '00:00', value: 52 },
  { time: '04:00', value: 48 },
  { time: '08:00', value: 60 },
  { time: '12:00', value: 68 },
  { time: '16:00', value: 74 },
  { time: '20:00', value: 62 },
  { time: '24:00', value: 58 },
];

const diskUsageData = [
  { name: 'Системные', value: 25 },
  { name: 'Базы данных', value: 35 },
  { name: 'Логи', value: 15 },
  { name: 'Медиа', value: 20 },
  { name: 'Свободно', value: 5 },
];

const trafficData = [
  { day: 'Пн', входящий: 3200, исходящий: 1800 },
  { day: 'Вт', входящий: 3800, исходящий: 2200 },
  { day: 'Ср', входящий: 4200, исходящий: 3000 },
  { day: 'Чт', входящий: 3600, исходящий: 2400 },
  { day: 'Пт', входящий: 4800, исходящий: 3800 },
  { day: 'Сб', входящий: 2400, исходящий: 1600 },
  { day: 'Вс', входящий: 1800, исходящий: 1000 },
];

const errorDistributionData = [
  { name: 'Критические', value: 2, color: '#ef4444' },
  { name: 'Предупреждения', value: 8, color: '#f97316' },
  { name: 'Информационные', value: 15, color: '#3b82f6' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const statCards = [
  {
    title: "Загрузка CPU",
    value: "34%",
    icon: <Cpu className="h-6 w-6 text-blue-500" />,
    description: "Средняя за 15 минут",
    color: "bg-blue-50",
    trend: { value: -3, icon: <TrendingDown className="h-4 w-4" /> }
  },
  {
    title: "Использование памяти",
    value: "68%",
    icon: <Memory className="h-6 w-6 text-purple-500" />,
    description: "8.2 ГБ / 12 ГБ",
    color: "bg-purple-50",
    trend: { value: 5, icon: <TrendingUp className="h-4 w-4" /> }
  },
  {
    title: "Диск",
    value: "47%",
    icon: <HardDrive className="h-6 w-6 text-emerald-600" />,
    description: "234 ГБ / 500 ГБ",
    color: "bg-emerald-50",
    trend: { value: 2, icon: <TrendingUp className="h-4 w-4" /> }
  },
  {
    title: "Активных сессий",
    value: "14",
    icon: <Activity className="h-6 w-6 text-emerald-600" />,
    description: "Текущие подключения",
    color: "bg-emerald-50",
    trend: { value: -1, icon: <TrendingDown className="h-4 w-4" /> }
  },
];

const systemStatus = [
  {
    name: "База данных",
    status: "Online",
    uptime: "99.98%",
    lastRestart: "19.04.2025 02:15",
    icon: <Database className="h-5 w-5 text-green-500" />
  },
  {
    name: "API сервер",
    status: "Online",
    uptime: "99.95%",
    lastRestart: "18.04.2025 23:42",
    icon: <Server className="h-5 w-5 text-green-500" />
  },
  {
    name: "Веб-сервер",
    status: "Online",
    uptime: "100%",
    lastRestart: "17.04.2025 08:10",
    icon: <Monitor className="h-5 w-5 text-green-500" />
  },
  {
    name: "Обработчик задач",
    status: "Warning",
    uptime: "98.5%",
    lastRestart: "19.04.2025 10:30",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
  },
];

const recentEvents = [
  { time: "19.04.2025 15:42", event: "Автоматическое резервное копирование", type: "info", icon: <Info /> },
  { time: "19.04.2025 14:15", event: "Обнаружена высокая загрузка CPU (82%)", type: "warning", icon: <AlertTriangle /> },
  { time: "19.04.2025 12:30", event: "Запуск переиндексации базы данных", type: "info", icon: <Database /> },
  { time: "19.04.2025 09:12", event: "Вход администратора admin", type: "info", icon: <Activity /> },
  { time: "19.04.2025 08:51", event: "Обновлены настройки безопасности", type: "info", icon: <Server /> },
  { time: "19.04.2025 07:44", event: "Выполнена SMS-рассылка", type: "info", icon: <Activity /> },
  { time: "19.04.2025 05:30", event: "Сбой API запроса к внешнему сервису", type: "error", icon: <AlertTriangle /> },
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
  <div className="container mx-auto px-4 py-8 max-w-7xl">
    <h1 className="text-2xl md:text-3xl font-bold mb-3">Панель мониторинга системы</h1>
    <p className="text-muted-foreground mb-6 max-w-2xl">
      Актуальный статус платформы, основные показатели работы, мониторинг ресурсов, 
      быстрые переходы в ключевые разделы управления и критические уведомления.
    </p>
    
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
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : w.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
                )
              }
            >
              {w.type === "error" ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> : 
               w.type === "warning" ? <AlertTriangle className="h-5 w-5 flex-shrink-0" /> : 
               <Info className="h-5 w-5 flex-shrink-0" />}
              <span className="text-sm">{w.message}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Главные показатели и графики реального времени */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, i) => (
        <Card key={card.title} className="shadow hover:shadow-md transition">
          <CardContent className={`p-6 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-white/80 p-3 shadow">
                {card.icon}
              </div>
              <div className="text-xs px-2 py-1 rounded-full flex items-center gap-1 
                              bg-opacity-20 font-medium
                              ${card.trend.value > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                {card.trend.icon}
                <span>{card.trend.value > 0 ? '+' : ''}{card.trend.value}%</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-muted-foreground">{card.title}</div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.description}</div>
            </div>
            <div className="h-20 mt-3">
              {i === 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {i === 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memoryUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {i === 2 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diskUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {diskUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              {i === 3 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuUsageData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Два больших графика */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card className="shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Нагрузка системы за сутки</CardTitle>
          <CardDescription>CPU и использование памяти</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...cpuUsageData, ...memoryUsageData.map(item => ({ ...item, type: 'memory' }))]
                  .map(item => item.type ? { time: item.time, memory: item.value } : { time: item.time, cpu: item.value })
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="memory" name="Память %" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Сетевой трафик</CardTitle>
          <CardDescription>Входящий и исходящий по дням недели</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={trafficData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="входящий" name="Входящий (KB)" fill="#22c55e" />
                <Bar dataKey="исходящий" name="Исходящий (KB)" fill="#f97316" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Статус системных компонентов */}
    <Card className="mb-8 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Статус системных компонентов</CardTitle>
        <CardDescription>Текущее состояние основных сервисов</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemStatus.map((item) => (
            <div key={item.name} className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={item.status === "Online" ? "outline" : "destructive"} 
                           className={item.status === "Online" ? "bg-green-50 text-green-700 hover:bg-green-100" :
                                      item.status === "Warning" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" :
                                      "bg-red-50 text-red-700 hover:bg-red-100"}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Uptime: {item.uptime}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                Последний перезапуск: {item.lastRestart}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Журнал событий и Ошибки системы в сетке */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="shadow lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Журнал событий</CardTitle>
          <CardDescription>Последние действия и системные события</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/30">
            {recentEvents.map((event, idx) => (
              <div key={idx} className="py-3 flex items-center gap-3">
                <div className={`rounded-full p-2 
                    ${event.type === 'error' ? 'bg-red-100 text-red-500' : 
                      event.type === 'warning' ? 'bg-amber-100 text-amber-500' : 
                      'bg-blue-100 text-blue-500'}`}>
                  {event.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{event.event}</div>
                  <div className="text-xs text-muted-foreground">{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Распределение ошибок</CardTitle>
          <CardDescription>За последние 24 часа</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorDistributionData}
                  cx="50%"
                  cy="40%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {errorDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            <span className="font-medium">Всего ошибок:</span> {errorDistributionData.reduce((acc, curr) => acc + curr.value, 0)}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Быстрые переходы в системные разделы */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Быстрый доступ к разделам управления</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sectionLinks.map((section) => (
          <Link key={section.to} to={section.to} className="group">
            <Card className="shadow hover:shadow-lg hover:bg-primary/5 transition-all">
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

    {/* Информация о сервере */}
    <Card className="mb-8 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Информация о сервере</CardTitle>
        <CardDescription>Технические характеристики и версии</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Операционная система</div>
            <div className="font-medium">Ubuntu 22.04 LTS</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Версия PHP</div>
            <div className="font-medium">8.2.10</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">База данных</div>
            <div className="font-medium">PostgreSQL 15.2</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Веб-сервер</div>
            <div className="font-medium">Nginx 1.22.1</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Ядра CPU</div>
            <div className="font-medium">8 (Intel Xeon E5-2686)</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Оперативная память</div>
            <div className="font-medium">12 GB DDR4</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Дата установки</div>
            <div className="font-medium">12.02.2025</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-muted-foreground">Время работы</div>
            <div className="font-medium">42 дня 8 часов</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminMonitoringPage;
