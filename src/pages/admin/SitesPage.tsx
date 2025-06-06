
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, Settings } from 'lucide-react';

const SitesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Сайты</h1>
          <p className="text-muted-foreground">
            Управление оптимизированными сайтами и поддоменами
          </p>
        </div>
        <Button>
          <Globe className="w-4 h-4 mr-2" />
          Добавить сайт
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>example1.com</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Активен
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              SEO оценка: 95/100
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                Открыть
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>test.example.com</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Тестирование
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              SEO оценка: 78/100
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                Открыть
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>blog.example.com</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Требует внимания
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              SEO оценка: 45/100
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                Открыть
              </Button>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-1" />
                Настройки
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SitesPage;
