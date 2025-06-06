
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Globe, 
  Shield,
  Zap,
  Layers,
  Cloud,
  GitBranch,
  Monitor,
  Smartphone
} from 'lucide-react';

const TechnicalArchitecture: React.FC = () => {
  const architectureLayers = [
    {
      name: 'Presentation Layer',
      icon: Monitor,
      technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      description: 'Пользовательский интерфейс и взаимодействие',
      status: 'stable',
      coverage: 90
    },
    {
      name: 'Business Logic Layer',
      icon: Layers,
      technologies: ['React Hooks', 'Context API', 'React Query', 'Custom Services'],
      description: 'Бизнес-логика и управление состоянием',
      status: 'stable',
      coverage: 85
    },
    {
      name: 'API Layer',
      icon: Cloud,
      technologies: ['Supabase Client', 'REST API', 'Real-time Subscriptions'],
      description: 'Слой взаимодействия с backend сервисами',
      status: 'stable',
      coverage: 80
    },
    {
      name: 'Data Layer',
      icon: Database,
      technologies: ['PostgreSQL', 'Supabase', 'RLS Policies', 'Migrations'],
      description: 'Хранение и управление данными',
      status: 'development',
      coverage: 75
    }
  ];

  const coreServices = [
    {
      name: 'Audit Service',
      description: 'Основной сервис для проведения SEO-аудита сайтов',
      endpoints: ['/api/audit/start', '/api/audit/status', '/api/audit/results'],
      status: 'production'
    },
    {
      name: 'Crawler Service',
      description: 'Сервис для сканирования и анализа веб-страниц',
      endpoints: ['/api/crawl/deep', '/api/crawl/sitemap', '/api/crawl/pages'],
      status: 'production'
    },
    {
      name: 'Analytics Service',
      description: 'Сбор и анализ пользовательских данных',
      endpoints: ['/api/analytics/track', '/api/analytics/report', '/api/analytics/export'],
      status: 'development'
    },
    {
      name: 'Optimization Service',
      description: 'ИИ-powered оптимизация контента и SEO',
      endpoints: ['/api/optimize/content', '/api/optimize/meta', '/api/optimize/structure'],
      status: 'beta'
    }
  ];

  const securityFeatures = [
    { name: 'Row Level Security (RLS)', implemented: true, description: 'Контроль доступа на уровне строк БД' },
    { name: 'JWT Authentication', implemented: true, description: 'Безопасная аутентификация пользователей' },
    { name: 'API Rate Limiting', implemented: false, description: 'Ограничение частоты запросов к API' },
    { name: 'Data Encryption', implemented: true, description: 'Шифрование данных в покое и в транзите' },
    { name: 'CORS Configuration', implemented: true, description: 'Настройка политик кросс-доменных запросов' },
    { name: 'Input Validation', implemented: true, description: 'Валидация пользовательского ввода' }
  ];

  const performanceOptimizations = [
    { name: 'Code Splitting', status: 'implemented', impact: 'high' },
    { name: 'Lazy Loading', status: 'implemented', impact: 'medium' },
    { name: 'Image Optimization', status: 'planned', impact: 'medium' },
    { name: 'Caching Strategy', status: 'development', impact: 'high' },
    { name: 'CDN Integration', status: 'planned', impact: 'high' },
    { name: 'Bundle Optimization', status: 'implemented', impact: 'medium' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
      case 'production':
      case 'implemented':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'development':
      case 'beta':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Архитектурные слои
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {architectureLayers.map((layer, index) => {
              const IconComponent = layer.icon;
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{layer.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(layer.status)}>
                        {layer.status === 'stable' ? 'Стабильно' : 'В разработке'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{layer.coverage}%</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Core Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Основные сервисы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {coreServices.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{service.name}</h3>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status === 'production' ? 'Продакшн' : 
                     service.status === 'beta' ? 'Бета' : 'Разработка'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Эндпоинты:</p>
                  {service.endpoints.map((endpoint, endpointIndex) => (
                    <code key={endpointIndex} className="block text-xs bg-muted p-1 rounded">
                      {endpoint}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Функции безопасности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${feature.implemented ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <h4 className="font-medium">{feature.name}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Badge variant={feature.implemented ? 'default' : 'secondary'}>
                  {feature.implemented ? 'Внедрено' : 'Планируется'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Оптимизация производительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceOptimizations.map((optimization, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{optimization.name}</h4>
                  <Badge className={getStatusColor(optimization.status)}>
                    {optimization.status === 'implemented' ? 'Внедрено' :
                     optimization.status === 'development' ? 'В разработке' : 'Планируется'}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${getImpactColor(optimization.impact)}`}>
                  Влияние: {optimization.impact === 'high' ? 'Высокое' :
                           optimization.impact === 'medium' ? 'Среднее' : 'Низкое'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Decisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Архитектурные решения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Frontend Architecture</h4>
              <p className="text-sm text-blue-800">
                Выбран React с TypeScript для обеспечения типобезопасности и масштабируемости. 
                Компонентная архитектура позволяет легко поддерживать и расширять функциональность.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Backend as a Service</h4>
              <p className="text-sm text-green-800">
                Supabase обеспечивает быструю разработку с готовыми решениями для аутентификации, 
                базы данных и real-time функций без необходимости управления сервером.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">State Management</h4>
              <p className="text-sm text-purple-800">
                Комбинация React Context API для глобального состояния и React Query для 
                серверного состояния обеспечивает эффективное управление данными.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalArchitecture;
