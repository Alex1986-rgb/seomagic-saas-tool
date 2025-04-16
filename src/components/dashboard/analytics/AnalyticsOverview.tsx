
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart2, TrendingUp, Users } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const mockData = [
  { name: '1 Апр', value: 65 },
  { name: '8 Апр', value: 72 },
  { name: '15 Апр', value: 68 },
  { name: '22 Апр', value: 78 },
  { name: '29 Апр', value: 82 },
  { name: '6 Мая', value: 85 },
  { name: '13 Мая', value: 89 },
];

export const AnalyticsOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Общий рейтинг SEO"
          value="82/100"
          increase="+12%"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Проверенные страницы"
          value="1,284"
          increase="+8%"
          icon={<BarChart2 className="h-4 w-4" />}
        />
        <StatCard
          title="Отслеживаемые позиции"
          value="348"
          increase="+24%"
          icon={<LineChart className="h-4 w-4" />}
        />
        <StatCard
          title="Активные пользователи"
          value="2,842"
          increase="+18%"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Тренд SEO оценок</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Распределение оценок</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { category: '90-100', count: 25 },
                { category: '80-89', count: 42 },
                { category: '70-79', count: 30 },
                { category: '60-69', count: 15 },
                { category: '0-59', count: 8 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  increase: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, increase, icon }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        <span className="text-sm text-green-500">{increase}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </CardContent>
  </Card>
);
