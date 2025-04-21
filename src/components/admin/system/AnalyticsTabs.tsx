
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";

// --- Mock data (for tabs)
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

const AnalyticsTabs: React.FC = () => (
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
);

export default AnalyticsTabs;
