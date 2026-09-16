import React from "react";
import { Loader2, Activity, AlertTriangle, Timer, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import MonitoringHeader from "./MonitoringHeader";
import EventLog from "./EventLog";
import ErrorDistributionChart from "./ErrorDistributionChart";
import SectionLinks from "./SectionLinks";
import NotCollectedNotice from "@/components/admin/NotCollectedNotice";
import { useApiActivity } from "@/hooks/use-api-activity";
import { usePlatformUsage } from "@/hooks/use-platform-usage";
import { formatDateTime } from "@/lib/admin-stats";

/**
 * Панель мониторинга.
 *
 * До сентября 2026 весь раздел рисовался из файла `monitoringData.ts`:
 * «Загрузка CPU 34 %», «8.2 ГБ / 12 ГБ», трафик по дням недели, uptime
 * компонентов и журнал придуманных событий. Ни одной из этих метрик проект
 * не собирает. Осталось то, что действительно пишется в базу, — вызовы
 * edge-функций из `api_logs` и счётчики работ платформы.
 */

// Ссылки на разделы: навигация, а не показатели.
const sectionLinks = [
  { label: "База данных", description: "Настройки подключения и оптимизации", to: "/admin/system/database", icon: "database" },
  { label: "Безопасность", description: "Защита и политики доступа", to: "/admin/system/security", icon: "server" },
  { label: "Пользователи", description: "Администраторы и права", to: "/admin/system/users", icon: "activity" },
  { label: "Уведомления", description: "Настройки оповещений", to: "/admin/system/notifications", icon: "monitor" },
  { label: "Аналитика", description: "Отчеты и интеграции", to: "/admin/system/analytics", icon: "bar-chart" },
  { label: "Производительность", description: "Мониторинг и автоматизация", to: "/admin/system/performance", icon: "gauge" },
];

interface MetricProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const Metric: React.FC<MetricProps> = ({ title, value, description, icon }) => (
  <Card className="shadow hover:shadow-md transition">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground font-medium">{title}</div>
        <div className="rounded-xl bg-white/80 p-2 shadow-sm">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{description}</div>
    </CardContent>
  </Card>
);

const AdminMonitoringContainer: React.FC = () => {
  const { stats, recent, isLoading, error } = useApiActivity();
  const { usage, isLoading: usageLoading, error: usageError } = usePlatformUsage();

  const hasCalls = stats.total > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl text-black bg-soft-green rounded-xl shadow-lg">
      <MonitoringHeader />

      <NotCollectedNotice
        className="mb-8 bg-white/80"
        title="Метрики сервера не собираются"
        description="Платформа не снимает показания с машины, на которой работает, поэтому здесь нет и не может быть таких цифр:"
        items={[
          "загрузка процессора и оперативной памяти",
          "занятое место на диске и время непрерывной работы (uptime)",
          "сетевой трафик и число открытых сессий",
        ]}
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Не удалось прочитать журнал вызовов: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Считаем вызовы функций за сутки...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Metric
            title="Вызовов функций за 24 часа"
            value={hasCalls ? String(stats.total) : "нет данных"}
            description="Строки в журнале api_logs"
            icon={<Activity className="h-5 w-5 text-emerald-600" />}
          />
          <Metric
            title="Из них с ошибкой"
            value={hasCalls ? String(stats.errors) : "нет данных"}
            description="Ответы с кодом 4xx и 5xx"
            icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          />
          <Metric
            title="Средняя длительность"
            value={stats.averageDuration !== null ? `${stats.averageDuration} мс` : "нет данных"}
            description="По вызовам, где время замерено"
            icon={<Timer className="h-5 w-5 text-blue-500" />}
          />
          <Metric
            title="Последний вызов"
            value={stats.lastCallAt ? formatDateTime(stats.lastCallAt) : "нет данных"}
            description="Свежая запись в журнале"
            icon={<Clock className="h-5 w-5 text-purple-500" />}
          />
        </div>
      )}

      <Card className="mb-8 shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Вызовы функций по часам</h2>
          {hasCalls ? (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.byHour} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="calls" name="Вызовы" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="errors" name="Ошибки" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8">
              За последние сутки функции платформы не вызывались — рисовать нечего.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8 shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium mb-4">Работы платформы</h2>
          {usageLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Считаем...
            </div>
          ) : usageError ? (
            <p className="text-sm text-red-700">Не удалось посчитать записи: {usageError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {[
                { label: "Аудитов", counter: usage.audits },
                { label: "Оптимизаций", counter: usage.optimizations },
                { label: "Проверок позиций", counter: usage.positionChecks },
                { label: "Заявок с сайта", counter: usage.requests },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border p-4 bg-white/70">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-2xl font-bold">{item.counter.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.counter.lastMonth > 0
                      ? `за 30 дней: ${item.counter.lastMonth}`
                      : "за 30 дней записей не было"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 bg-white rounded-xl p-6 shadow-md text-gray-800">
        <EventLog rows={recent} />
        <ErrorDistributionChart statusGroups={stats.statusGroups} />
      </div>

      <SectionLinks sectionLinks={sectionLinks} />
    </div>
  );
};

export default AdminMonitoringContainer;
