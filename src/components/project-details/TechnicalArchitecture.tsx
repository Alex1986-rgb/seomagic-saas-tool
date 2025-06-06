
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Database, 
  Server, 
  Globe,
  Shield,
  Zap,
  Layers,
  Package,
  GitBranch,
  Monitor
} from 'lucide-react';

const TechnicalArchitecture: React.FC = () => {
  const architectureComponents = [
    {
      category: "Frontend",
      components: [
        { name: "React 18", version: "18.3.1", status: "stable", description: "Основная библиотека UI" },
        { name: "TypeScript", version: "5.0+", status: "stable", description: "Типизация и безопасность кода" },
        { name: "Tailwind CSS", version: "3.4+", status: "stable", description: "Утилитарный CSS фреймворк" },
        { name: "Shadcn/UI", version: "latest", status: "stable", description: "Компоненты пользовательского интерфейса" },
        { name: "React Query", version: "5.0+", status: "stable", description: "Управление состоянием сервера" }
      ]
    },
    {
      category: "Backend", 
      components: [
        { name: "Python", version: "3.11+", status: "stable", description: "Основной язык бэкенда" },
        { name: "FastAPI", version: "0.110+", status: "stable", description: "Веб-фреймворк для API" },
        { name: "Celery", version: "5.3+", status: "stable", description: "Асинхронные задачи" },
        { name: "Redis", version: "7.0+", status: "stable", description: "Кэш и брокер сообщений" },
        { name: "PostgreSQL", version: "15+", status: "stable", description: "Основная база данных" }
      ]
    },
    {
      category: "AI/ML",
      components: [
        { name: "OpenAI API", version: "1.0+", status: "stable", description: "GPT-4 для оптимизации контента" },
        { name: "BeautifulSoup", version: "4.12+", status: "stable", description: "Парсинг HTML" },
        { name: "Selenium", version: "4.15+", status: "testing", description: "Автоматизация браузера" },
        { name: "Requests", version: "2.31+", status: "stable", description: "HTTP клиент" }
      ]
    },
    {
      category: "Infrastructure",
      components: [
        { name: "Docker", version: "24+", status: "stable", description: "Контейнеризация" },
        { name: "Nginx", version: "1.25+", status: "stable", description: "Веб-сервер и прокси" },
        { name: "Let's Encrypt", version: "latest", status: "stable", description: "SSL сертификаты" },
        { name: "Beget VPS", version: "Ubuntu 22.04", status: "stable", description: "Хостинг" }
      ]
    }
  ];

  const systemModules = [
    {
      name: "crawler.py",
      description: "Рекурсивное сканирование сайтов",
      status: "ready",
      coverage: 100,
      icon: Globe
    },
    {
      name: "seo_analyzer.py", 
      description: "Глубокий SEO анализ",
      status: "ready",
      coverage: 100,
      icon: Monitor
    },
    {
      name: "openai_optimizer.py",
      description: "ИИ оптимизация контента",
      status: "ready", 
      coverage: 100,
      icon: Zap
    },
    {
      name: "html_fixer.py",
      description: "Автоматическое исправление HTML",
      status: "ready",
      coverage: 100,
      icon: Code
    },
    {
      name: "report_generator.py",
      description: "Генерация PDF отчетов",
      status: "ready",
      coverage: 100,
      icon: Package
    },
    {
      name: "ftp_publisher.py",
      description: "Публикация на сервер",
      status: "ready",
      coverage: 100,
      icon: Server
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-100 border-green-200';
      case 'testing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'deprecated': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'development': return 'text-blue-600 bg-blue-100';
      case 'testing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Техническая архитектура
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {architectureComponents.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {category.category === 'Frontend' && <Code className="h-5 w-5" />}
                  {category.category === 'Backend' && <Server className="h-5 w-5" />}
                  {category.category === 'AI/ML' && <Zap className="h-5 w-5" />}
                  {category.category === 'Infrastructure' && <Shield className="h-5 w-5" />}
                  {category.category}
                </h3>
                <div className="space-y-3">
                  {category.components.map((component, idx) => (
                    <div key={idx} className={`p-3 border-2 rounded-lg ${getStatusColor(component.status)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{component.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {component.version}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Системные модули
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <div key={index} className={`p-4 border-2 rounded-lg ${getModuleStatusColor(module.status)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <IconComponent className="h-6 w-6" />
                    <div>
                      <h4 className="font-semibold">{module.name}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {module.status === 'ready' ? 'Готов' : 'В разработке'}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {module.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Покрытие кода</span>
                      <span>{module.coverage}%</span>
                    </div>
                    <Progress value={module.coverage} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Схема базы данных
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">users</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• id (UUID, PK)</li>
                  <li>• email (varchar)</li>
                  <li>• created_at (timestamp)</li>
                  <li>• subscription_plan (varchar)</li>
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">audits</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• id (UUID, PK)</li>
                  <li>• user_id (UUID, FK)</li>
                  <li>• url (varchar)</li>
                  <li>• status (varchar)</li>
                  <li>• results (jsonb)</li>
                  <li>• created_at (timestamp)</li>
                </ul>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">optimizations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• id (UUID, PK)</li>
                  <li>• audit_id (UUID, FK)</li>
                  <li>• type (varchar)</li>
                  <li>• status (varchar)</li>
                  <li>• results (jsonb)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Архитектурные решения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Микросервисная архитектура</h4>
                <p className="text-sm text-muted-foreground">
                  Модульная система с независимыми компонентами для лучшей масштабируемости
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Event-driven архитектура</h4>
                <p className="text-sm text-muted-foreground">
                  Асинхронная обработка задач через Celery и Redis
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">RESTful API</h4>
                <p className="text-sm text-muted-foreground">
                  Стандартизированный API с FastAPI для взаимодействия с фронтендом
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Контейнеризация</h4>
                <p className="text-sm text-muted-foreground">
                  Docker-контейнеры для изоляции и простого развертывания
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalArchitecture;
