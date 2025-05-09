
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DemonstrationCost from './optimization/DemonstrationCost';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DemonstrationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Link to="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            На главную
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Демонстрация системы оптимизации</h1>
        <p className="text-muted-foreground">
          Эта страница демонстрирует процесс формирования сметы и оплаты SEO-оптимизации сайта.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>О сервисе оптимизации</CardTitle>
          <CardDescription>
            Наш сервис предлагает комплексную оптимизацию сайта для улучшения позиций в поисковых системах.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Система автоматически анализирует ваш сайт, находит все ошибки и недоработки, 
            и формирует подробную смету работ по оптимизации. После оплаты, наши специалисты 
            приступают к улучшению технических параметров сайта и оптимизации контента.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Технические улучшения</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Исправление ошибок в коде</li>
                <li>Оптимизация мета-тегов</li>
                <li>Исправление битых ссылок</li>
                <li>Улучшение скорости загрузки</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Контентные улучшения</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Оптимизация текстов для SEO</li>
                <li>Улучшение структуры заголовков</li>
                <li>Добавление ключевых слов</li>
                <li>Повышение читабельности</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Результаты работы</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Повышение позиций в поиске</li>
                <li>Увеличение посещаемости</li>
                <li>Рост конверсии</li>
                <li>Улучшение пользовательского опыта</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DemonstrationCost />
    </div>
  );
};

export default DemonstrationPage;
