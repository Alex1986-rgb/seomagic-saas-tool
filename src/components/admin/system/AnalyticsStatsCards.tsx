import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, TrendingUp, Users, Loader2 } from "lucide-react";
import { usePlatformUsage } from "@/hooks/use-platform-usage";

/**
 * Показатели использования платформы.
 *
 * Раньше в этих карточках стояли «Посетители 24 521 (+12.5 %)», «Просмотры
 * 68 147», «Конверсия 4.73 %» и «Отказы 21.4 %». Посещаемость сайта платформа
 * не измеряет — счётчиков и внешней аналитики в проекте нет. Считаем работы,
 * которые реально лежат в базе.
 */
const AnalyticsStatsCards: React.FC = () => {
  const { usage, isLoading, error } = usePlatformUsage();

  const cards = [
    { title: "Аудиты", counter: usage.audits, icon: <Activity className="h-5 w-5" />, bg: "text-blue-500 bg-blue-100" },
    { title: "Оптимизации", counter: usage.optimizations, icon: <BarChart3 className="h-5 w-5" />, bg: "text-purple-500 bg-purple-100" },
    { title: "Проверки позиций", counter: usage.positionChecks, icon: <TrendingUp className="h-5 w-5" />, bg: "text-green-500 bg-green-100" },
    { title: "Пользователи", counter: usage.users, icon: <Users className="h-5 w-5" />, bg: "text-amber-600 bg-amber-100" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Считаем записи в базе...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Не удалось посчитать данные: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title} className="shadow hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-md font-medium">{card.title}</h3>
                <p className="text-2xl font-bold mt-1">{card.counter.total}</p>
              </div>
              <div className={`${card.bg} p-2 rounded-full`}>{card.icon}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              {card.counter.lastMonth > 0
                ? `за 30 дней: ${card.counter.lastMonth}`
                : "за 30 дней новых записей не было"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsStatsCards;
