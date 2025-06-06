
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Play,
  Search,
  FileText,
  Brain,
  Globe,
  Archive,
  BarChart3
} from 'lucide-react';

const FeaturesStatus: React.FC = () => {
  const features = [
    {
      category: "Сканирование и анализ",
      items: [
        { name: "Рекурсивное сканирование сайта", status: "completed", progress: 100 },
        { name: "Извлечение sitemap.xml", status: "completed", progress: 100 },
        { name: "Анализ структуры сайта", status: "completed", progress: 100 },
        { name: "Проверка доступности страниц", status: "completed", progress: 100 }
      ]
    },
    {
      category: "SEO анализ",
      items: [
        { name: "Анализ мета-тегов", status: "completed", progress: 100 },
        { name: "Проверка alt атрибутов", status: "completed", progress: 100 },
        { name: "Анализ адаптивности", status: "completed", progress: 100 },
        { name: "Проверка скорости загрузки", status: "completed", progress: 100 }
      ]
    },
    {
      category: "ИИ оптимизация",
      items: [
        { name: "Генерация мета-описаний", status: "completed", progress: 100 },
        { name: "Оптимизация заголовков", status: "completed", progress: 100 },
        { name: "Улучшение alt текстов", status: "completed", progress: 100 },
        { name: "Создание Schema markup", status: "in_progress", progress: 75 }
      ]
    },
    {
      category: "Генерация отчетов", 
      items: [
        { name: "PDF отчет по аудиту", status: "completed", progress: 100 },
        { name: "Sitemap генерация", status: "completed", progress: 100 },
        { name: "Экспорт данных", status: "completed", progress: 100 },
        { name: "Статистика позиций", status: "in_progress", progress: 80 }
      ]
    },
    {
      category: "Публикация",
      items: [
        { name: "Упаковка оптимизированного сайта", status: "completed", progress: 100 },
        { name: "FTP загрузка на сервер", status: "completed", progress: 100 },
        { name: "Настройка поддомена", status: "completed", progress: 100 },
        { name: "SSL сертификат", status: "pending", progress: 60 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="text-green-700 bg-green-100">Готово</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-blue-700 bg-blue-100">В работе</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-orange-700 bg-orange-100">Ожидает</Badge>;
      default:
        return <Badge variant="outline">Неопределено</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Общая статистика функций
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">18</div>
              <div className="text-sm text-muted-foreground">Готовых функций</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-muted-foreground">В разработке</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">1</div>
              <div className="text-sm text-muted-foreground">Ожидает</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">90%</div>
              <div className="text-sm text-muted-foreground">Готовность</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {features.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{category.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24">
                      <Progress value={item.progress} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {item.progress}%
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturesStatus;
