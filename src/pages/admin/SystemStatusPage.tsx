
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Статус системы</h1>
        <p className="text-muted-foreground">
          Мониторинг состояния всех компонентов системы
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Веб-сервер
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Работает
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Время работы: 99.9%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              База данных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Работает
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Задержка: 15ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              API сервис
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Предупреждение
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Повышенная нагрузка
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemStatusPage;
