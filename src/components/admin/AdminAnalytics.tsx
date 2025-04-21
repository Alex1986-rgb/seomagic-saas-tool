
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { Users, Activity, ChartBar, Server, Calendar } from "lucide-react";

// Карточки дашборда
const dashboardStats = [
  { label: "Аудитов", value: "1,248", icon: <ChartBar className="h-5 w-5 text-blue-600" />, trend: 24 },
  { label: "Активных пользователей", value: "347", icon: <Users className="h-5 w-5 text-green-600" />, trend: 12 },
  { label: "Клонов сайтов", value: "856", icon: <Server className="h-5 w-5 text-purple-600" />, trend: 18 },
  { label: "Доход", value: "₽284,500", icon: <Calendar className="h-5 w-5 text-orange-600" />, trend: -3 },
];

// Demo data для графиков
const auditData = [ { name: '01.01', value: 12 }, { name: '02.01', value: 19 }, { name: '03.01', value: 15 }, { name: '04.01', value: 27 }, { name: '05.01', value: 32 }, { name: '06.01', value: 24 }, { name: '07.01', value: 38 } ];
const usersGrowth = [ { month: "Янв", users: 120 }, { month: "Фев", users: 132 }, { month: "Мар", users: 141 }, { month: "Апр", users: 145 }, { month: "Май", users: 148 }, { month: "Июн", users: 153 }, ];
const deviceUsage = [ { name: "Компьютер", value: 658 }, { name: "Мобильный", value: 340 }, { name: "Планшет", value: 93 } ];
const COLORS = ['#8B5CF6', '#36CFFF', '#00C49F'];

const AdminAnalytics: React.FC = () => (
  <div className="space-y-8">
    {/* Карточки */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {dashboardStats.map(stat => (
        <Card key={stat.label} className="shadow hover:shadow-md transition">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <div>{stat.icon}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.label}
              <span className={`ml-2 ${stat.trend > 0 ? "text-green-500" : "text-red-500"}`}>
                {stat.trend > 0 ? "+" : ""}{stat.trend}%
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Графики */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <div className="font-medium mb-2">Аудиты по дням</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={auditData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="font-medium mb-2">Рост пользователей по месяцам</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usersGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#8B5CF6" fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <div className="font-medium mb-2">Распределение устройств</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceUsage} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8B5CF6" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {deviceUsage.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="font-medium mb-2">Активных пользователей по времени</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#36CFFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminAnalytics;
