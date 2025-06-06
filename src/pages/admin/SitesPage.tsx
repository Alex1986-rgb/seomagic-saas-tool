
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Search, Filter, ExternalLink, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SitesPage: React.FC = () => {
  const sites = [
    {
      id: 1,
      name: 'example.com',
      status: 'active',
      lastOptimized: '2 дня назад',
      score: 92,
      pages: 45
    },
    {
      id: 2,
      name: 'demo-site.ru',
      status: 'optimizing',
      lastOptimized: 'В процессе',
      score: 78,
      pages: 23
    },
    {
      id: 3,
      name: 'test-project.com',
      status: 'pending',
      lastOptimized: '1 неделю назад',
      score: 65,
      pages: 12
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Активен</Badge>;
      case 'optimizing':
        return <Badge className="bg-blue-100 text-blue-800">Оптимизация</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Ожидание</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Сайты | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
          Управление сайтами
        </h1>
        <p className="text-muted-foreground text-lg">
          Мониторинг и управление оптимизированными сайтами и поддоменами
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Поиск по названию или домену..."
            className="w-full"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить сайт
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Card key={site.id} className="border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="truncate">{site.name}</span>
                </div>
                {getStatusBadge(site.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">SEO балл</p>
                  <p className="font-semibold text-lg">{site.score}/100</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Страниц</p>
                  <p className="font-semibold text-lg">{site.pages}</p>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground text-sm">Последняя оптимизация</p>
                <p className="font-medium">{site.lastOptimized}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SitesPage;
