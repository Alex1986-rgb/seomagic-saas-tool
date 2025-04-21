
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserStatsCards from '@/components/admin/UserStatsCards';
import UserCharts from '@/components/admin/UserCharts';
import { 
  Activity, 
  Users, 
  BarChart3, 
  Globe, 
  Server, 
  Bell, 
  Grid3X3,
  FileText,
  CreditCard,
  ArrowUpRight,
  Info,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Link } from "react-router-dom";

// Mock data for charts
const visitsData = [
  { name: 'Янв', visits: 400 },
  { name: 'Фев', visits: 300 },
  { name: 'Мар', visits: 500 },
  { name: 'Апр', visits: 280 },
  { name: 'Май', visits: 590 },
  { name: 'Июн', visits: 390 },
  { name: 'Июл', visits: 490 },
];

const usersData = [
  { name: 'Янв', users: 100 },
  { name: 'Фев', users: 120 },
  { name: 'Мар', users: 170 },
  { name: 'Апр', users: 190 },
  { name: 'Май', users: 250 },
  { name: 'Июн', users: 220 },
  { name: 'Июл', users: 350 },
];

const revenueData = [
  { name: 'Янв', value: 12400 },
  { name: 'Фев', value: 14800 },
  { name: 'Мар', value: 18600 },
  { name: 'Апр', value: 17900 },
  { name: 'Май', value: 23500 },
  { name: 'Июн', value: 21200 },
  { name: 'Июл', value: 25800 },
];

const planDistribution = [
  { name: 'Базовый', value: 320 },
  { name: 'Про', value: 180 },
  { name: 'Корпоративный', value: 73 },
];

const COLORS = ['#8884d8', '#36CFFF', '#14CC8C', '#FFBB28'];

// Recent activity mock data
const recentActivity = [
  { user: 'Анна С.', action: 'запустила аудит', target: 'example.com', time: '14 мин назад', status: 'success' },
  { user: 'Василий П.', action: 'обновил настройки', target: 'SEO отслеживания', time: '36 мин назад', status: 'info' },
  { user: 'Максим К.', action: 'оформил подписку', target: 'Про', time: '2 ч назад', status: 'success' },
  { user: 'Елена Р.', action: 'создала отчет', target: 'по аналитике', time: '5 ч назад', status: 'warning' },
];

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Дашборд | Админ панель</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Дашборд</h1>
            <p className="text-muted-foreground">
              Общая статистика и мониторинг платформы
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/system-status">
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <Server className="h-4 w-4" />
                Система
              </Button>
            </Link>
            <Link to="/admin/monitoring">
              <Button variant="outline" className="flex items-center gap-2" size="sm">
                <Grid3X3 className="h-4 w-4" />
                Мониторинг
              </Button>
            </Link>
            <Link to="/admin/notifications">
              <Button className="flex items-center gap-2" size="sm">
                <Bell className="h-4 w-4" />
                <span className="relative">
                  Уведомления
                  <span className="absolute -top-1 -right-3 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                  </span>
                </span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Server Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Server className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="bg-green-500/10 text-green-500 gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Стабильно
                </Badge>
              </div>
              <h3 className="mt-3 text-xl font-bold">Сервер</h3>
              <div className="mt-1 text-sm text-muted-foreground">Нагрузка: 23%</div>
              <div className="mt-3 h-1.5 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="bg-green-500/10 text-green-500 gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Активно
                </Badge>
              </div>
              <h3 className="mt-3 text-xl font-bold">Базы данных</h3>
              <div className="mt-1 text-sm text-muted-foreground">Активные запросы: 12</div>
              <div className="mt-3 h-1.5 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Globe className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Высокая активность
                </Badge>
              </div>
              <h3 className="mt-3 text-xl font-bold">API</h3>
              <div className="mt-1 text-sm text-muted-foreground">543 запр/мин</div>
              <div className="mt-3 h-1.5 w-full bg-muted overflow-hidden rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Info className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Версия: 2.8.1
                </Badge>
              </div>
              <h3 className="mt-3 text-xl font-bold">Система</h3>
              <div className="mt-1 text-sm text-muted-foreground">Обновлено: 19.04.2025</div>
              <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                <span>Последнее резервное копирование: 20.04.2025 01:14</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Business & User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="py-6 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Всего пользователей</p>
                  <h3 className="text-2xl font-bold mt-1">1,248</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-3 gap-1 text-xs font-medium text-green-500">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12.5%</span>
                <span className="text-muted-foreground ml-1">за 30 дней</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="py-6 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Выполнено аудитов</p>
                  <h3 className="text-2xl font-bold mt-1">3,567</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-3 gap-1 text-xs font-medium text-green-500">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+24.8%</span>
                <span className="text-muted-foreground ml-1">за 30 дней</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="py-6 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Доход</p>
                  <h3 className="text-2xl font-bold mt-1">₽245,890</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-3 gap-1 text-xs font-medium text-green-500">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+8.3%</span>
                <span className="text-muted-foreground ml-1">за 30 дней</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="py-6 px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Активные планы</p>
                  <h3 className="text-2xl font-bold mt-1">578</h3>
                </div>
                <div className="p-2 rounded-full bg-primary/10">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-3 gap-1 text-xs font-medium text-amber-500">
                <Clock className="h-3.5 w-3.5" />
                <span>12 истекают</span>
                <span className="text-muted-foreground ml-1">через 7 дней</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* User Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Доход по месяцам
              </CardTitle>
              <CardDescription>
                Рост дохода за последние 7 месяцев
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₽${value.toLocaleString()}`, 'Доход']}
                      contentStyle={{
                        borderRadius: '8px',
                        background: '#282830',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      activeDot={{ r: 8 }}
                      name="Доход"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Распределение планов
              </CardTitle>
              <CardDescription>
                Активные подписки по типам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [value, 'Пользователей']}
                      contentStyle={{
                        borderRadius: '8px',
                        background: '#282830',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity and Trends */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Последние активности
              </CardTitle>
              <CardDescription>
                Действия пользователей и системы
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      item.status === 'success' ? 'bg-green-500' : 
                      item.status === 'warning' ? 'bg-amber-500' : 
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{item.user}</span>{' '}
                        {item.action}{' '}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Показать все активности
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Пользовательская активность
              </CardTitle>
              <CardDescription>
                Посещаемость и регистрации по месяцам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={usersData.map((item, index) => ({
                      ...item,
                      visits: visitsData[index].visits
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        background: '#282830',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#36CFFF" 
                      strokeWidth={2} 
                      name="Новые пользователи" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#14CC8C" 
                      strokeWidth={2} 
                      name="Посещения" 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
