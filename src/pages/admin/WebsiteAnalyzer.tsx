
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Search, BarChart3 } from 'lucide-react';

const WebsiteAnalyzer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Анализатор веб-сайтов</h1>
        <p className="text-muted-foreground">
          Комплексный анализ веб-сайтов для SEO оптимизации
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Анализ структуры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Анализ структуры сайта, навигации и внутренних ссылок.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              SEO аудит
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Комплексная проверка SEO факторов и рекомендации.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Аналитика
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Детальная аналитика производительности сайта.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteAnalyzer;
