
import React from "react";
import UsersManagement from "@/components/admin/system/UsersManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { Users, UserPlus, Activity, UserCheck } from "lucide-react";

const registrationData = [
  { month: 'Янв', count: 4 },
  { month: 'Фев', count: 6 },
  { month: 'Мар', count: 8 },
  { month: 'Апр', count: 5 },
  { month: 'Май', count: 12 },
  { month: 'Июн', count: 8 },
  { month: 'Июл', count: 15 },
  { month: 'Авг', count: 18 },
  { month: 'Сен', count: 10 },
  { month: 'Окт', count: 11 },
  { month: 'Ноя', count: 14 },
  { month: 'Дек', count: 16 },
];

const userTypeData = [
  { name: 'Пользователи', value: 72 },
  { name: 'Администраторы', value: 5 },
  { name: 'Модераторы', value: 12 },
  { name: 'Аналитики', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const activeUsersData = [
  { day: 'Пн', active: 32 },
  { day: 'Вт', active: 38 },
  { day: 'Ср', active: 35 },
  { day: 'Чт', active: 42 },
  { day: 'Пт', active: 45 },
  { day: 'Сб', active: 20 },
  { day: 'Вс', active: 15 },
];

const UsersActivity = () => (
  <div className="border rounded-md p-4 bg-gradient-to-r from-indigo-50 to-blue-50 mb-6">
    <div className="text-md font-medium mb-2">Активность пользователей:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Всего администраторов: <span className="text-foreground font-medium">3</span></div>
      <div>Активных пользователей: <span className="text-foreground font-medium">11</span></div>
      <div>Последний вход: <span className="text-foreground font-medium">Петр Иванов — 18.04.2025, 10:19</span></div>
      <div>Новых за месяц: <span className="text-foreground font-medium">1</span></div>
      <div>Временная блокировка: <span className="text-green-600 font-bold">Нет</span></div>
    </div>
  </div>
);

const UsersManagementPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <h2 className="text-2xl font-bold mb-3">Пользователи системы</h2>
    <UsersActivity />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Всего пользователей</h3>
          </div>
          <p className="text-3xl font-bold">97</p>
          <p className="text-sm text-muted-foreground">Активных: 82 (85%)</p>
        </CardContent>
      </Card>
      
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Новых за месяц</h3>
          </div>
          <p className="text-3xl font-bold">14</p>
          <p className="text-sm text-muted-foreground">+22% от прошлого месяца</p>
        </CardContent>
      </Card>
      
      <Card className="shadow hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-medium">Авторизаций сегодня</h3>
          </div>
          <p className="text-3xl font-bold">28</p>
          <p className="text-sm text-muted-foreground">Среднее время сессии: 24 мин</p>
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="users" className="mb-6">
      <TabsList className="mb-4">
        <TabsTrigger value="users">Пользователи</TabsTrigger>
        <TabsTrigger value="stats">Статистика</TabsTrigger>
        <TabsTrigger value="activity">Активность</TabsTrigger>
      </TabsList>
      
      <TabsContent value="users">
        <Card>
          <CardContent className="p-0">
            <UsersManagement />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="stats">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Регистрации по месяцам</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={registrationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Регистрации" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Распределение ролей пользователей</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="activity">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Активность пользователей по дням недели</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeUsersData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" name="Активные пользователи" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> список пользователей, управление правами, журнал активности.</div>
      <ul className="list-disc pl-5">
        <li>Добавление, блокировка, удаление пользователей</li>
        <li>Изменение ролей и ограничений</li>
        <li>Отображение истории входов</li>
        <li>Статистика действий</li>
      </ul>
      <div>Внимание: все действия администраторов фиксируются для истории.</div>
    </div>
  </div>
);

export default UsersManagementPage;
