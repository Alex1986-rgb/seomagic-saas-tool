
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Globe, 
  Zap,
  Code2,
  Brain,
  Archive,
  Upload
} from 'lucide-react';

const TechnicalArchitecture: React.FC = () => {
  const modules = [
    {
      name: "crawler.py",
      description: "Рекурсивно обходит сайт, сохраняет URLs",
      icon: Globe,
      status: "готов"
    },
    {
      name: "sitemap.py", 
      description: "Генерирует sitemap.xml, site-map.html",
      icon: Archive,
      status: "готов"
    },
    {
      name: "html_downloader.py",
      description: "Скачивает HTML страниц и ресурсы", 
      icon: Code2,
      status: "готов"
    },
    {
      name: "seo_analyzer.py",
      description: "Анализирует теги, alt, адаптивность",
      icon: Zap,
      status: "готов"
    },
    {
      name: "report_generator.py",
      description: "Генерация PDF-отчётов",
      icon: Archive,
      status: "готов"
    },
    {
      name: "openai_optimizer.py",
      description: "Обращение к OpenAI для оптимизации",
      icon: Brain,
      status: "готов"
    },
    {
      name: "site_packager.py",
      description: "Архивация всех исправленных HTML",
      icon: Archive,
      status: "готов"
    },
    {
      name: "publisher.py",
      description: "Загрузка на поддомен Beget (через API/FTP)",
      icon: Upload,
      status: "готов"
    },
    {
      name: "positions_checker.py",
      description: "Получение позиций из поисковиков",
      icon: Server,
      status: "готов"
    },
    {
      name: "pinger.py",
      description: "Пинг Google/Bing через curl/API",
      icon: Globe,
      status: "готов"
    },
    {
      name: "task_pipeline.py",
      description: "Celery / async FastAPI задачи и статусы",
      icon: Database,
      status: "готов"
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Серверные модули системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <Badge variant="secondary">{module.status}</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{module.name}</h4>
                  <p className="text-xs text-muted-foreground">{module.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Архитектура системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Процесс обработки</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">Сканирование</h4>
                  <p className="text-sm text-muted-foreground">Обход всех страниц сайта</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-semibold mb-1">Анализ</h4>
                  <p className="text-sm text-muted-foreground">SEO аудит всех элементов</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1">Оптимизация</h4>
                  <p className="text-sm text-muted-foreground">ИИ улучшение контента</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Публикация</h4>
                  <p className="text-sm text-muted-foreground">Размещение на сервере</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Технические характеристики</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Обработка запросов</span>
                    <Badge>Async FastAPI</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Очереди задач</span>
                    <Badge>Celery + Redis</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>База данных</span>
                    <Badge>PostgreSQL</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ИИ интеграция</span>
                    <Badge>OpenAI API</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Хостинг</span>
                    <Badge>Beget VPS</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Контейнеризация</span>
                    <Badge>Docker</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalArchitecture;
