
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
  BarChart3,
  Code,
  Settings,
  Zap
} from 'lucide-react';

const FeaturesStatus: React.FC = () => {
  const features = [
    {
      category: "Сканирование и анализ",
      items: [
        { name: "Рекурсивное сканирование сайта", status: "completed", progress: 100, module: "crawler.py" },
        { name: "Извлечение sitemap.xml", status: "completed", progress: 100, module: "sitemap_extractor.py" },
        { name: "Анализ структуры сайта", status: "completed", progress: 100, module: "structure_analyzer.py" },
        { name: "Проверка доступности страниц", status: "completed", progress: 100, module: "availability_checker.py" },
        { name: "Анализ внутренних ссылок", status: "completed", progress: 100, module: "link_analyzer.py" }
      ]
    },
    {
      category: "SEO анализ",
      items: [
        { name: "Анализ мета-тегов", status: "completed", progress: 100, module: "meta_analyzer.py" },
        { name: "Проверка alt атрибутов", status: "completed", progress: 100, module: "alt_checker.py" },
        { name: "Анализ адаптивности", status: "completed", progress: 100, module: "responsive_analyzer.py" },
        { name: "Проверка скорости загрузки", status: "completed", progress: 100, module: "speed_analyzer.py" },
        { name: "Анализ заголовков H1-H6", status: "completed", progress: 100, module: "heading_analyzer.py" },
        { name: "Проверка Schema markup", status: "completed", progress: 100, module: "schema_analyzer.py" }
      ]
    },
    {
      category: "ИИ оптимизация",
      items: [
        { name: "Генерация мета-описаний", status: "completed", progress: 100, module: "openai_meta_optimizer.py" },
        { name: "Оптимизация заголовков", status: "completed", progress: 100, module: "openai_title_optimizer.py" },
        { name: "Улучшение alt текстов", status: "completed", progress: 100, module: "openai_alt_optimizer.py" },
        { name: "Создание Schema markup", status: "completed", progress: 100, module: "openai_schema_generator.py" },
        { name: "Оптимизация контента страниц", status: "completed", progress: 100, module: "openai_content_optimizer.py" }
      ]
    },
    {
      category: "Обработка и исправление", 
      items: [
        { name: "Исправление HTML структуры", status: "completed", progress: 100, module: "html_fixer.py" },
        { name: "Оптимизация изображений", status: "completed", progress: 100, module: "image_optimizer.py" },
        { name: "Минификация CSS/JS", status: "completed", progress: 100, module: "minifier.py" },
        { name: "Сжатие ресурсов", status: "completed", progress: 100, module: "compressor.py" }
      ]
    },
    {
      category: "Генерация отчетов", 
      items: [
        { name: "PDF отчет по аудиту", status: "completed", progress: 100, module: "pdf_generator.py" },
        { name: "Sitemap генерация", status: "completed", progress: 100, module: "sitemap_generator.py" },
        { name: "Экспорт данных (JSON/CSV)", status: "completed", progress: 100, module: "data_exporter.py" },
        { name: "Отчет об оптимизации", status: "completed", progress: 100, module: "optimization_reporter.py" }
      ]
    },
    {
      category: "Публикация и мониторинг",
      items: [
        { name: "Упаковка оптимизированного сайта", status: "completed", progress: 100, module: "site_packager.py" },
        { name: "FTP загрузка на сервер", status: "completed", progress: 100, module: "ftp_publisher.py" },
        { name: "Настройка поддомена", status: "completed", progress: 100, module: "subdomain_manager.py" },
        { name: "SSL сертификат", status: "completed", progress: 100, module: "ssl_manager.py" },
        { name: "Проверка позиций в поиске", status: "in_progress", progress: 85, module: "position_tracker.py" },
        { name: "Пинг поисковых систем", status: "completed", progress: 100, module: "search_pinger.py" }
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

  const totalFeatures = features.reduce((sum, category) => sum + category.items.length, 0);
  const completedFeatures = features.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'completed').length, 0);
  const inProgressFeatures = features.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'in_progress').length, 0);

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
              <div className="text-3xl font-bold text-green-600">{completedFeatures}</div>
              <div className="text-sm text-muted-foreground">Готовых функций</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{inProgressFeatures}</div>
              <div className="text-sm text-muted-foreground">В разработке</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{totalFeatures - completedFeatures - inProgressFeatures}</div>
              <div className="text-sm text-muted-foreground">Ожидает</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.round((completedFeatures / totalFeatures) * 100)}%</div>
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
                    <Badge variant="outline" className="text-xs">
                      {item.module}
                    </Badge>
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
