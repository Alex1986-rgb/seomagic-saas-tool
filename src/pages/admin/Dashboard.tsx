
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Дашборд | Админ панель</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Дашборд</h1>
          <p className="text-muted-foreground">
            Обзор активности и статистики сервиса
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Проведенных аудитов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,324</div>
              <p className="text-xs text-muted-foreground mt-1">+22% с прошлого месяца</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Пользователей</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground mt-1">+12% с прошлого месяца</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Созданных сайтмапов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground mt-1">+8% с прошлого месяца</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Активных подписок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243</div>
              <p className="text-xs text-muted-foreground mt-1">+5% с прошлого месяца</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Посещения сайта</CardTitle>
              <CardDescription>Количество посещений за последние 7 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Новые пользователи</CardTitle>
              <CardDescription>Количество новых пользователей за последние 7 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" />
                  </BarChart>
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
