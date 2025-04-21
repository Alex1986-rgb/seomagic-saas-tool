
import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity } from "lucide-react";

const AnalyticsMiniDashboard = () => (
  <div className="border rounded-md p-4 bg-gradient-to-r from-green-50 to-emerald-50 my-6">
    <div className="text-md font-medium mb-2">Дашборд аналитики:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Сайтов с аналитикой: <span className="text-foreground font-medium">7</span></div>
      <div>Google Analytics: <span className="text-green-600 font-bold">Активно</span></div>
      <div>Сбор пользовательских запросов: <span className="text-green-600 font-bold">Включено</span></div>
      <div>Среднее время загрузки: <span className="text-foreground font-medium">1.3 сек</span></div>
      <div>Ошибки JS за вчера: <span className="text-orange-600 font-bold">4</span></div>
      <div>Дата последнего обновления дашборда: <span className="text-foreground font-medium">19.04.2025</span></div>
    </div>
  </div>
);

// Мок данные для графиков
const trafficData = [
  { name: '00:00', desktop: 1200, mobile: 800, tablet: 400 },
  { name: '03:00', desktop: 900, mobile: 400, tablet: 200 },
  { name: '06:00', desktop: 600, mobile: 300, tablet: 100 },
  { name: '09:00', desktop: 1800, mobile: 1200, tablet: 600 },
  { name: '12:00', desktop: 2400, mobile: 1800, tablet: 900 },
  { name: '15:00', desktop: 2100, mobile: 1600, tablet: 700 },
  { name: '18:00', desktop: 1800, mobile: 1200, tablet: 600 },
  { name: '21:00', desktop: 1500, mobile: 900, tablet: 500 },
];

const pageViewsData = [
  { name: 'Пн', views: 2400 },
  { name: 'Вт', views: 1398 },
  { name: 'Ср', views: 9800 },
  { name: 'Чт', views: 3908 },
  { name: 'Пт', views: 4800 },
  { name: 'Сб', views: 3800 },
  { name: 'Вс', views: 4300 },
];

const bounceRateData = [
  { name: 'Янв', rate: 30 },
  { name: 'Фев', rate: 25 },
  { name: 'Мар', rate: 20 },
  { name: 'Апр', rate: 18 },
  { name: 'Май', rate: 22 },
  { name: 'Июн', rate: 26 },
];

const deviceData = [
  { name: 'Десктоп', value: 45 },
  { name: 'Мобильный', value: 40 },
  { name: 'Планшет', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <p className="mb-4 text-muted-foreground">Настройки сбора и анализа данных системы, подключение интеграций.</p>
    <AnalyticsMiniDashboard />

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-md font-medium">Посетители</h3>
              <p className="text-2xl font-bold mt-1">24,521</p>
            </div>
            <div className="text-blue-500 bg-blue-100 p-2 rounded-full">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-500">+12.5%</span> с прошлого месяца
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-md font-medium">Просмотры</h3>
              <p className="text-2xl font-bold mt-1">68,147</p>
            </div>
            <div className="text-purple-500 bg-purple-100 p-2 rounded-full">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-500">+18.2%</span> с прошлого месяца
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-md font-medium">Конверсия</h3>
              <p className="text-2xl font-bold mt-1">4.73%</p>
            </div>
            <div className="text-green-500 bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-red-500">-2.1%</span> с прошлого месяца
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-md font-medium">Отказы</h3>
              <p className="text-2xl font-bold mt-1">21.4%</p>
            </div>
            <div className="text-red-500 bg-red-100 p-2 rounded-full">
              <PieChartIcon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="text-green-500">-5.3%</span> с прошлого месяца
          </p>
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="settings" className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="settings">Настройки</TabsTrigger>
        <TabsTrigger value="traffic">Трафик</TabsTrigger>
        <TabsTrigger value="performance">Производительность</TabsTrigger>
        <TabsTrigger value="devices">Устройства</TabsTrigger>
      </TabsList>
      
      <TabsContent value="settings">
        <Card>
          <CardContent className="p-0">
            <AnalyticsSettings />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="traffic">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Трафик по устройствам</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="desktop" stackId="1" stroke="#8884d8" fill="#8884d8" name="Десктоп" />
                  <Area type="monotone" dataKey="mobile" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Мобильный" />
                  <Area type="monotone" dataKey="tablet" stackId="1" stroke="#ffc658" fill="#ffc658" name="Планшет" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="performance">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Просмотры страниц</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" name="Просмотры" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Показатель отказов</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bounceRateData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Показатель отказов %" stroke="#ff7300" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="devices">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Распределение по устройствам</h3>
            <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
      </TabsContent>
    </Tabs>
    
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> Google Analytics, собственная аналитика, хранение данных.</div>
      <ul className="list-disc pl-5">
        <li>Гибкая настройка интеграций</li>
        <li>Сбор важнейшей статистики</li>
        <li>Дашборд текущих показателей</li>
      </ul>
      <div>Обратите внимание: аналитика соответствует требованиям GDPR.</div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;
