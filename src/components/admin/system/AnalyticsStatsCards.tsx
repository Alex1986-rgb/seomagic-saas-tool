
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

const stats = [
  {
    title: "Посетители",
    value: "24,521",
    icon: <Activity className="h-5 w-5" />,
    trend: "+12.5%",
    trendColor: "text-green-500",
    bg: "text-blue-500 bg-blue-100"
  },
  {
    title: "Просмотры",
    value: "68,147",
    icon: <BarChart3 className="h-5 w-5" />,
    trend: "+18.2%",
    trendColor: "text-green-500",
    bg: "text-purple-500 bg-purple-100"
  },
  {
    title: "Конверсия",
    value: "4.73%",
    icon: <TrendingUp className="h-5 w-5" />,
    trend: "-2.1%",
    trendColor: "text-red-500",
    bg: "text-green-500 bg-green-100"
  },
  {
    title: "Отказы",
    value: "21.4%",
    icon: <PieChartIcon className="h-5 w-5" />,
    trend: "-5.3%",
    trendColor: "text-green-500",
    bg: "text-red-500 bg-red-100"
  }
];

const AnalyticsStatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    {stats.map((stat, i) => (
      <Card key={stat.title} className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-md font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-2 rounded-full`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className={stat.trendColor}>{stat.trend}</span> с прошлого месяца
          </p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default AnalyticsStatsCards;
