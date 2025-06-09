
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const ClientNotifications: React.FC = () => {
  const notifications = [
    {
      title: 'Аудит завершен',
      message: 'SEO аудит для example.com завершен',
      time: '2 часа назад',
      unread: true
    },
    {
      title: 'Изменение позиций',
      message: 'Позиция по ключевому слову "seo аудит" улучшилась',
      time: '1 день назад',
      unread: true
    },
    {
      title: 'Платеж обработан',
      message: 'Подписка продлена до 15 января 2025',
      time: '3 дня назад',
      unread: false
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg md:text-xl font-semibold">Уведомления</h3>
      
      <Card>
        <CardHeader>
          <CardTitle>Настройки уведомлений</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email уведомления</p>
                <p className="text-sm text-muted-foreground">Получать важные уведомления на email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push уведомления</p>
                <p className="text-sm text-muted-foreground">Показывать уведомления в браузере</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">SMS уведомления</p>
                <p className="text-sm text-muted-foreground">Критически важные уведомления по SMS</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Последние уведомления</CardTitle>
            <Button size="sm" variant="outline">Отметить все как прочитанные</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border-l-4 ${
                  notification.unread 
                    ? 'border-l-primary bg-primary/5' 
                    : 'border-l-muted bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotifications;
