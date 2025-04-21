
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Users, Activity, ChartBar, Server, Calendar, ArrowUpRight, CreditCard, Globe, TrendingUp, Clock } from "lucide-react";

// Статистика платформы
const platformStats = [
  { label: "Всего аудитов", value: "3,842", icon: <ChartBar className="h-5 w-5 text-blue-600" />, trend: "+24%" },
  { label: "Активные пользователи", value: "642", icon: <Users className="h-5 w-5 text-green-600" />, trend: "+12%" },
  { label: "Запросов в минуту", value: "483", icon: <Clock className="h-5 w-5 text-purple-600" />, trend: "+18%" },
  { label: "Доход за месяц", value: "₽512,400", icon: <CreditCard className="h-5 w-5 text-orange-600" />, trend: "+8%" },
];

// Данные по трафику
const trafficData = [
  { date: '01.04', органический: 4000, платный: 2400, реферальный: 1200 },
  { date: '05.04', органический: 3000, платный: 1398, реферальный: 900 },
  { date: '10.04', органический: 2000, платный: 3800, реферальный: 1500 },
  { date: '15.04', органический: 2780, платный: 3908, реферальный: 2100 },
  { date: '20.04', органический: 1890, платный: 4800, реферальный: 2500 },
  { date: '25.04', органический: 2390, платный: 3800, реферальный: 1800 },
  { date: '30.04', органический: 3490, платный: 4300, реферальный: 2100 },
];

// Данные для конверсии
const conversionData = [
  { month: 'Янв', значение: 65 },
  { month: 'Фев', значение: 68 },
  { month: 'Мар', значение: 72 },
  { month: 'Апр', значение: 75 },
  { month: 'Май', значение: 70 },
  { month: 'Июн', значение: 73 },
];

// Данные для устройств
const deviceData = [
  { name: 'Компьютер', value: 58 },
  { name: 'Смартфон', value: 32 },
  { name: 'Планшет', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Данные для активных пользователей
const activeUserData = [
  { date: '01.04', активные: 3200 },
  { date: '02.04', активные: 3400 },
  { date: '03.04', активные: 3100 },
  { date: '04.04', активные: 3600 },
  { date: '05.04', активные: 3800 },
  { date: '06.04', активные: 3200 },
  { date: '07.04', активные: 2800 },
  { date: '08.04', активные: 3100 },
  { date: '09.04', активные: 3400 },
  { date: '10.04', активные: 3700 },
  { date: '11.04', активные: 3900 },
  { date: '12.04', активные: 4100 },
  { date: '13.04', активные: 4300 },
  { date: '14.04', активные: 4400 },
];

// Даннные для географии
const regionData = [
  { name: 'Москва', value: 42 },
  { name: 'Санкт-Петербург', value: 28 },
  { name: 'Екатеринбург', value: 12 },
  { name: 'Новосибирск', value: 10 },
  { name: 'Другие', value: 8 },
];

const REGION_COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const AdminAnalytics: React.FC = () => (
  <div className="space-y-8">
    {/* Системные показатели */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {platformStats.map((stat, index) => (
        <Card key={index} className="shadow hover:shadow-md transition">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div>{stat.icon}</div>
              <span className="text-xs font-medium text-green-500">{stat.trend}</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Трафик и показатели */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" /> 
            Трафик по источникам
          </CardTitle>
          <CardDescription>Последние 30 дней</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorОрганический" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorПлатный" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorРеферальный" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="органический" stroke="#8884d8" fillOpacity={1} fill="url(#colorОрганический)" />
                <Area type="monotone" dataKey="платный" stroke="#82ca9d" fillOpacity={1} fill="url(#colorПлатный)" />
                <Area type="monotone" dataKey="реферальный" stroke="#ffc658" fillOpacity={1} fill="url(#colorРеферальный)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" /> 
            Показатель конверсии
          </CardTitle>
          <CardDescription>Процент посетителей, совершивших целевое действие</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[50, 80]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="значение" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Конверсия (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Мониторинг системы и распределение устройств */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" /> 
            Активные пользователи
          </CardTitle>
          <CardDescription>Количество активных пользователей за последние 14 дней</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="активные" fill="#8884d8" name="Активные пользователи" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-orange-500" /> 
            Типы устройств
          </CardTitle>
          <CardDescription>Распределение пользователей по устройствам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* География пользователей */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" /> 
          География пользователей
        </CardTitle>
        <CardDescription>Распределение пользователей по регионам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={regionData}
              margin={{
                top: 5,
                right: 30,
                left: 40,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Процент пользователей">
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={REGION_COLORS[index % REGION_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AdminAnalytics;
