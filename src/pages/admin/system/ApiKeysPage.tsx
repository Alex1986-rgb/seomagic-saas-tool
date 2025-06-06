
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Copy, Trash2 } from 'lucide-react';

const ApiKeysPage: React.FC = () => {
  const apiKeys = [
    {
      id: 1,
      name: 'Основной ключ',
      key: 'sk_live_***************************',
      status: 'active',
      created: '2025-01-15'
    },
    {
      id: 2,
      name: 'Тестовый ключ',
      key: 'sk_test_***************************',
      status: 'active',
      created: '2025-02-01'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>API ключи | Системные настройки</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API ключи и доступ</h1>
        <p className="text-muted-foreground">
          Управление ключами доступа для интеграции с внешними сервисами
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Активные API ключи
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать ключ
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      {apiKey.status === 'active' ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Input value={apiKey.key} readOnly className="font-mono" />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Создан: {apiKey.created}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Создание нового ключа</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название ключа</label>
              <Input placeholder="Введите название ключа" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Input placeholder="Для чего будет использоваться ключ" />
            </div>
            <Button className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Создать API ключ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeysPage;
