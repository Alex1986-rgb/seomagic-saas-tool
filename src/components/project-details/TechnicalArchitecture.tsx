
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
  Upload,
  FileText,
  Search,
  Settings,
  BarChart3
} from 'lucide-react';

const TechnicalArchitecture: React.FC = () => {
  const coreModules = [
    {
      name: "crawler.py",
      description: "Рекурсивно обходит сайт, сохраняет URLs и структуру",
      icon: Globe,
      status: "готов",
      features: ["Robots.txt парсинг", "Sitemap обработка", "Глубокое сканирование"]
    },
    {
      name: "seo_analyzer.py", 
      description: "Анализирует SEO параметры всех страниц",
      icon: Search,
      status: "готов",
      features: ["Мета-теги", "Alt атрибуты", "Заголовки H1-H6", "Schema markup"]
    },
    {
      name: "html_processor.py",
      description: "Загружает и обрабатывает HTML страниц", 
      icon: Code2,
      status: "готов",
      features: ["HTML парсинг", "Структурный анализ", "Валидация кода"]
    },
    {
      name: "openai_optimizer.py",
      description: "ИИ оптимизация контента через OpenAI API",
      icon: Brain,
      status: "готов",
      features: ["Генерация мета-тегов", "Улучшение контента", "Schema создание"]
    },
    {
      name: "html_fixer.py",
      description: "Исправляет HTML код на основе анализа и ИИ",
      icon: Settings,
      status: "готов",
      features: ["Автоисправление", "Оптимизация кода", "Структурные улучшения"]
    },
    {
      name: "report_generator.py",
      description: "Генерация PDF-отчётов и аналитики",
      icon: FileText,
      status: "готов",
      features: ["PDF отчеты", "Статистика", "Рекомендации"]
    },
    {
      name: "sitemap_generator.py",
      description: "Создание sitemap.xml и HTML карты сайта",
      icon: Archive,
      status: "готов",
      features: ["XML Sitemap", "HTML карта", "Индексация"]
    },
    {
      name: "site_packager.py",
      description: "Упаковка оптимизированного сайта в архив",
      icon: Archive,
      status: "готов",
      features: ["ZIP архивация", "Структура сохранение", "Ресурсы включение"]
    },
    {
      name: "ftp_publisher.py",
      description: "Публикация на поддомен через FTP/API",
      icon: Upload,
      status: "готов",
      features: ["FTP загрузка", "API интеграция", "Автодеплой"]
    },
    {
      name: "position_tracker.py",
      description: "Отслеживание позиций в поисковиках",
      icon: BarChart3,
      status: "в работе",
      features: ["Google позиции", "Yandex позиции", "Динамика"]
    },
    {
      name: "search_pinger.py",
      description: "Уведомление поисковых систем об изменениях",
      icon: Globe,
      status: "готов",
      features: ["Google ping", "Yandex ping", "Bing ping"]
    },
    {
      name: "task_manager.py",
      description: "Управление очередью задач через Celery",
      icon: Server,
      status: "готов",
      features: ["Асинхронные задачи", "Статусы", "Мониторинг"]
    }
  ];

  const systemComponents = [
    {
      category: "API сервер",
      technology: "FastAPI + Python",
      description: "Высокопроизводительный асинхронный API",
      status: "готов"
    },
    {
      category: "База данных",
      technology: "PostgreSQL 15",
      description: "Реляционная БД для хранения результатов",
      status: "готов"
    },
    {
      category: "Очереди задач",
      technology: "Celery + Redis",
      description: "Асинхронная обработка длительных операций",
      status: "готов"
    },
    {
      category: "Веб интерфейс",
      technology: "React + TypeScript",
      description: "Современный пользовательский интерфейс",
      status: "готов"
    },
    {
      category: "Стилизация",
      technology: "Tailwind CSS + Shadcn/UI",
      description: "Компонентная система дизайна",
      status: "готов"
    },
    {
      category: "Контейнеризация",
      technology: "Docker + Docker Compose",
      description: "Упаковка и развертывание сервисов",
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
            {coreModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <Badge variant={module.status === 'готов' ? 'secondary' : 'outline'}>
                      {module.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{module.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                  <div className="space-y-1">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-current rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
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
            Системная архитектура
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Процесс обработки сайта</h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold mb-1">Сканирование</h4>
                  <p className="text-sm text-muted-foreground">Обход всех страниц</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Search className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-semibold mb-1">Анализ</h4>
                  <p className="text-sm text-muted-foreground">SEO аудит</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-semibold mb-1">Оптимизация</h4>
                  <p className="text-sm text-muted-foreground">ИИ улучшение</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-semibold mb-1">Исправление</h4>
                  <p className="text-sm text-muted-foreground">HTML правки</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Archive className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <h4 className="font-semibold mb-1">Упаковка</h4>
                  <p className="text-sm text-muted-foreground">Создание архива</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <h4 className="font-semibold mb-1">Публикация</h4>
                  <p className="text-sm text-muted-foreground">Размещение онлайн</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Технические компоненты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemComponents.map((component, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{component.category}</h4>
                      <p className="text-sm text-muted-foreground">{component.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{component.technology}</Badge>
                      <div className="text-xs text-green-600 mt-1">{component.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Технологические преимущества</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">🚀 Производительность</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Асинхронная обработка задач</li>
                <li>• Параллельное сканирование страниц</li>
                <li>• Кеширование результатов</li>
                <li>• Оптимизированные запросы к БД</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">🔒 Надежность</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Обработка ошибок и исключений</li>
                <li>• Резервное копирование данных</li>
                <li>• Мониторинг состояния системы</li>
                <li>• Логирование всех операций</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">🔧 Масштабируемость</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Микросервисная архитектура</li>
                <li>• Горизонтальное масштабирование</li>
                <li>• Балансировка нагрузки</li>
                <li>• Контейнеризация сервисов</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">🤖 ИИ интеграция</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• OpenAI GPT-4 для оптимизации</li>
                <li>• Умная генерация контента</li>
                <li>• Автоматическое улучшение SEO</li>
                <li>• Адаптивные алгоритмы</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalArchitecture;
