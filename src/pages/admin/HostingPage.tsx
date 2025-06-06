
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Globe, Upload } from 'lucide-react';

const HostingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление хостингом</h1>
        <p className="text-muted-foreground">
          Развертывание и управление веб-сайтами
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Сервер 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
              Активен
            </Badge>
            <p className="text-sm text-muted-foreground">
              example1.com
            </p>
            <Button size="sm" className="mt-2">Управление</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Сервер 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
              Развертывание
            </Badge>
            <p className="text-sm text-muted-foreground">
              example2.com
            </p>
            <Button size="sm" variant="outline" className="mt-2">Просмотр</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Новый сайт
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Развернуть новый веб-сайт
            </p>
            <Button className="w-full">Создать</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostingPage;
