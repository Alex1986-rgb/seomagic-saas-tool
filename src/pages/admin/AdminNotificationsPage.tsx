
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, ArrowRight, MailCheck, Calendar, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Notification data
const notifications = [
  {
    id: 1,
    title: 'Обновление системы',
    message: 'Запланировано обновление системы до версии 2.8.2 на 25 апреля в 03:00 МСК',
    time: '20 мин назад',
    type: 'system',
    read: false
  },
  {
    id: 2,
    title: 'Высокая нагрузка на сервер',
    message: 'Зафиксирована высокая нагрузка на API. Текущее значение: 543 запросов в минуту',
    time: '1 час назад',
    type: 'warning',
    read: true
  },
  {
    id: 3,
    title: 'Новый пользователь',
    message: 'Зарегистрирован новый пользователь: Алексей Смирнов (alexey@example.com)',
    time: '5 часов назад',
    type: 'user',
    read: true
  },
];

// Channel settings
const channels = [
  { name: 'Email', icon: <Mail className="h-5 w-5" />, enabled: true },
  { name: 'Slack', icon: <MessageSquare className="h-5 w-5" />, enabled: true },
  { name: 'SMS', icon: <MailCheck className="h-5 w-5" />, enabled: false },
];

const AdminNotificationsPage: React.FC = () => (
  <>
    <Helmet>
      <title>Уведомления | Админ панель</title>
    </Helmet>
    
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 text-primary p-1.5 rounded">
              <Bell className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold">Уведомления администратора</h1>
          </div>
          <p className="text-muted-foreground">
            Центр управления уведомлениями и оповещениями системы
          </p>
        </div>
        
        <div>
          <Button className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Настройки уведомлений
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Последние уведомления
                </CardTitle>
                <Badge variant="outline" className="bg-primary/10">
                  1 новое
                </Badge>
              </div>
              <CardDescription>
                Оповещения о системных событиях и активности пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 ${
                      notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'system' ? 'bg-blue-500/10 text-blue-500' :
                        notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {notification.type === 'system' ? <Info className="h-5 w-5" /> :
                         notification.type === 'warning' ? <Bell className="h-5 w-5" /> :
                         <Mail className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm mt-1 text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" className="w-full" size="sm">
                    Показать все уведомления
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Запланированные оповещения
              </CardTitle>
              <CardDescription>
                Предстоящие системные обновления и задачи
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500 text-white">25 апреля</Badge>
                  <span className="text-sm font-medium">03:00 - 05:00 МСК</span>
                </div>
                <h3 className="font-medium mb-1">Плановое обновление системы</h3>
                <p className="text-sm text-muted-foreground">
                  Обновление платформы до версии 2.8.2. Ожидаемое время простоя: до 30 минут.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Каналы уведомлений
              </CardTitle>
              <CardDescription>
                Активные способы доставки уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        {channel.icon}
                      </div>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <Badge variant={channel.enabled ? "default" : "secondary"}>
                      {channel.enabled ? "Активно" : "Отключено"}
                    </Badge>
                  </div>
                ))}
                
                <Button className="w-full mt-2">
                  Настроить каналы
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Мгновенные оповещения
              </CardTitle>
              <CardDescription>
                Получайте оповещения о критических событиях
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Ошибки сервера</span>
                  <Badge className="bg-green-500">Включено</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Попытки взлома</span>
                  <Badge className="bg-green-500">Включено</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span>Высокая нагрузка</span>
                  <Badge className="bg-green-500">Включено</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Новые пользователи</span>
                  <Badge variant="secondary">Отключено</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <b>Возможности:</b> настройка типов уведомлений, резервные контакты, история рассылок.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Мониторинг email, SMS и Slack</li>
          <li>Просмотр истории</li>
          <li>Оповещения о важных событиях</li>
          <li>Персонализация правил и фильтров оповещений</li>
        </ul>
      </div>
    </div>
  </>
);

export default AdminNotificationsPage;
