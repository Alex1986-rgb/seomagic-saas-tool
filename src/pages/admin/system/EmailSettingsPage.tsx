
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, TestTube, Settings } from 'lucide-react';

const EmailSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Настройки почты | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Настройки почты</h1>
        <p className="text-muted-foreground">
          Конфигурация SMTP сервера и управление шаблонами писем
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                SMTP настройки
              </div>
              <Badge className="bg-green-100 text-green-800">Подключено</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">SMTP сервер</label>
                <Input defaultValue="smtp.gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Порт</label>
                <Input defaultValue="587" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Имя пользователя</label>
                <Input defaultValue="noreply@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Пароль</label>
                <Input type="password" defaultValue="••••••••" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Сохранить настройки
              </Button>
              <Button variant="outline">
                <TestTube className="h-4 w-4 mr-2" />
                Тестировать соединение
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Шаблоны писем</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Регистрация пользователя',
                'Восстановление пароля',
                'Уведомление о завершении аудита',
                'Отчет по мониторингу позиций'
              ].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{template}</span>
                  <Button variant="outline" size="sm">
                    Редактировать
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailSettingsPage;
