
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash2, Filter } from 'lucide-react';

const LogSettingsPage: React.FC = () => {
  const logs = [
    {
      id: 1,
      type: 'System',
      level: 'INFO',
      message: 'Application started successfully',
      timestamp: '2025-06-06 10:30:25'
    },
    {
      id: 2,
      type: 'Security',
      level: 'WARNING',
      message: 'Failed login attempt from IP 192.168.1.100',
      timestamp: '2025-06-06 10:25:15'
    },
    {
      id: 3,
      type: 'Database',
      level: 'ERROR',
      message: 'Connection timeout to database server',
      timestamp: '2025-06-06 10:20:00'
    }
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INFO':
        return <Badge className="bg-blue-100 text-blue-800">INFO</Badge>;
      case 'WARNING':
        return <Badge className="bg-yellow-100 text-yellow-800">WARNING</Badge>;
      case 'ERROR':
        return <Badge className="bg-red-100 text-red-800">ERROR</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Логирование | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Логирование событий</h1>
        <p className="text-muted-foreground">
          Просмотр системных логов и настройка уровней логирования
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Системные логи
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Очистить
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.type}</Badge>
                      {getLevelBadge(log.level)}
                    </div>
                    <span className="text-sm text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="font-mono text-sm">{log.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки логирования</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">Уровень логирования</h3>
                <Badge className="bg-blue-100 text-blue-800">INFO</Badge>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">Хранение логов</h3>
                <span>30 дней</span>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">Размер файла</h3>
                <span>10 MB</span>
              </div>
            </div>
            <Button className="w-full">
              Обновить настройки
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogSettingsPage;
