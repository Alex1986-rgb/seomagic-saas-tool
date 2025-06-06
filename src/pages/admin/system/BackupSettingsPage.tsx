
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatabaseBackup, Download, Calendar, Settings } from 'lucide-react';

const BackupSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Резервное копирование | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Резервное копирование</h1>
        <p className="text-muted-foreground">
          Управление резервными копиями базы данных и файлов системы
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseBackup className="h-5 w-5 text-primary" />
              Автоматическое резервное копирование
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Статус:</span>
              <Badge className="bg-green-100 text-green-800">Активно</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Частота:</span>
              <span>Ежедневно в 03:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Последнее копирование:</span>
              <span>Сегодня в 03:00</span>
            </div>
            <Button className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Настроить расписание
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Ручное создание копии
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Создать резервную копию базы данных прямо сейчас
            </p>
            <Button className="w-full">
              <DatabaseBackup className="h-4 w-4 mr-2" />
              Создать копию
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              История копий
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['2025-06-06', '2025-06-05', '2025-06-04'].map((date) => (
                <div key={date} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Резервная копия от {date}</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Скачать
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

export default BackupSettingsPage;
