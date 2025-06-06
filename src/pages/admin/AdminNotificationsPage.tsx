
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, MessageSquare } from 'lucide-react';

const AdminNotificationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Уведомления</h1>
        <p className="text-muted-foreground">
          Управление системными уведомлениями и оповещениями
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Системные
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Уведомления о состоянии системы и сервисов.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Настройка email уведомлений для пользователей.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Push
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Управление push-уведомлениями в браузере.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
