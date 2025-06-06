
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Globe, Upload, Settings, Monitor, Database } from 'lucide-react';

const HostingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Хостинг | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Управление хостингом
        </h1>
        <p className="text-muted-foreground text-lg">
          Управление серверами, развертывание сайтов и мониторинг производительности
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Активные серверы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">3</div>
            <p className="text-sm text-muted-foreground">Работают без ошибок</p>
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
              Стабильно
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Развернутые сайты
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <p className="text-sm text-muted-foreground">Активных проектов</p>
            <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
              Онлайн
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-purple-600" />
              Нагрузка системы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">45%</div>
            <p className="text-sm text-muted-foreground">Средняя загрузка CPU</p>
            <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">
              Норма
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Развертывание сайтов
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Загрузите архив с сайтом или подключите Git-репозиторий для автоматического развертывания.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Загрузить архив
              </Button>
              <Button variant="outline" className="flex-1">
                <Database className="w-4 h-4 mr-2" />
                Git репозиторий
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Настройки хостинга
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Конфигурация серверов, SSL-сертификаты и настройки безопасности.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                SSL настройки
              </Button>
              <Button variant="outline" className="flex-1">
                Конфигурация
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostingPage;
