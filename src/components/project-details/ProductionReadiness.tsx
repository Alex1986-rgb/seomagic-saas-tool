
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Shield, 
  Zap, 
  Globe,
  Users,
  Database,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  XCircle,
  Rocket,
  TrendingUp,
  Server,
  Monitor
} from 'lucide-react';

const ProductionReadiness: React.FC = () => {
  const productionChecklist = [
    { item: "SSL/HTTPS настройка", status: "completed", priority: "critical" },
    { item: "CDN интеграция", status: "completed", priority: "critical" },
    { item: "Кеширование статических ресурсов", status: "completed", priority: "high" },
    { item: "Минификация и сжатие", status: "completed", priority: "high" },
    { item: "Error tracking (Sentry)", status: "pending", priority: "critical" },
    { item: "Мониторинг производительности", status: "pending", priority: "high" },
    { item: "Автоматические бэкапы БД", status: "pending", priority: "critical" },
    { item: "Load balancing", status: "not_started", priority: "medium" },
    { item: "Horizontal scaling", status: "not_started", priority: "medium" },
    { item: "Rate limiting", status: "in_progress", priority: "high" },
    { item: "API versioning", status: "not_started", priority: "medium" },
    { item: "Логирование и аудит", status: "in_progress", priority: "high" }
  ];

  const scalabilityFeatures = [
    {
      title: "Автоматическое масштабирование",
      description: "Увеличение ресурсов при высокой нагрузке",
      status: "planned",
      impact: "high",
      effort: "medium"
    },
    {
      title: "Микросервисная архитектура",
      description: "Разделение на независимые сервисы",
      status: "consideration",
      impact: "high",
      effort: "high"
    },
    {
      title: "Кеширование Redis",
      description: "Быстрое кеширование для частых запросов",
      status: "planned",
      impact: "medium",
      effort: "low"
    },
    {
      title: "Шардинг базы данных",
      description: "Горизонтальное разделение данных",
      status: "future",
      impact: "high",
      effort: "high"
    }
  ];

  const performanceMetrics = [
    { metric: "Время загрузки страницы", current: "1.2s", target: "< 1s", progress: 80 },
    { metric: "Time to Interactive", current: "2.1s", target: "< 2s", progress: 90 },
    { metric: "Core Web Vitals", current: "85/100", target: "95/100", progress: 85 },
    { metric: "Uptime", current: "99.5%", target: "99.9%", progress: 95 },
    { metric: "API Response Time", current: "150ms", target: "< 100ms", progress: 70 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'not_started': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="secondary" className="text-green-700 bg-green-100">Готово</Badge>;
      case 'in_progress': return <Badge variant="outline" className="text-yellow-700 bg-yellow-100">В работе</Badge>;
      case 'pending': return <Badge variant="outline" className="text-orange-700 bg-orange-100">Ожидает</Badge>;
      case 'not_started': return <Badge variant="destructive">Не начато</Badge>;
      case 'planned': return <Badge variant="outline" className="text-blue-700 bg-blue-100">Запланировано</Badge>;
      case 'consideration': return <Badge variant="outline" className="text-purple-700 bg-purple-100">Рассматривается</Badge>;
      case 'future': return <Badge variant="outline" className="text-gray-700 bg-gray-100">Будущее</Badge>;
      default: return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Production Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Готовность к продакшн
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">78%</div>
              <div className="text-sm text-muted-foreground">Общая готовность</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12/15</div>
              <div className="text-sm text-muted-foreground">Критичные задачи</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">5</div>
              <div className="text-sm text-muted-foreground">В работе</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Q2 2024</div>
              <div className="text-sm text-muted-foreground">Планируемый запуск</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {productionChecklist.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.item}</span>
                  <span className={`text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                {getStatusBadge(item.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Метрики производительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{metric.metric}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">Текущее: {metric.current}</span>
                    <span className="text-primary">Цель: {metric.target}</span>
                  </div>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scalability Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Возможности масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scalabilityFeatures.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{feature.title}</h4>
                  {getStatusBadge(feature.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    Влияние: {feature.impact}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Усилия: {feature.effort}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure & Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Инфраструктура
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Хостинг</span>
              <Badge variant="secondary">Vercel/Netlify</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>База данных</span>
              <Badge variant="secondary">Supabase PostgreSQL</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>CDN</span>
              <Badge variant="outline">Планируется CloudFlare</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Мониторинг</span>
              <Badge variant="outline">Требует настройки</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>CI/CD</span>
              <Badge variant="secondary">GitHub Actions</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность и надежность
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>SSL/TLS</span>
              <Badge variant="secondary">Настроено</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Аутентификация</span>
              <Badge variant="secondary">Supabase Auth</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Rate Limiting</span>
              <Badge variant="outline">В разработке</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Резервные копии</span>
              <Badge variant="outline">Требует настройки</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Логирование</span>
              <Badge variant="outline">Частично</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scaling Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Стратегия масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                1-1000 пользователей
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Текущая архитектура</li>
                <li>• Serverless функции</li>
                <li>• Базовое кеширование</li>
                <li>• Мониторинг производительности</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                1K-10K пользователей
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Redis кеширование</li>
                <li>• CDN интеграция</li>
                <li>• Оптимизация запросов</li>
                <li>• Read replicas</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                10K+ пользователей
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Микросервисы</li>
                <li>• Автоскейлинг</li>
                <li>• Шардинг БД</li>
                <li>• Multiple regions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Мониторинг и аналитика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <div className="text-sm text-muted-foreground">Uptime (месяц)</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">15K</div>
                <div className="text-sm text-muted-foreground">Requests/day</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">0.01%</div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Планируемые интеграции мониторинга:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center">
                  <span>Sentry (Error tracking)</span>
                  <Badge variant="outline">Высокий приоритет</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Google Analytics 4</span>
                  <Badge variant="outline">Средний приоритет</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Hotjar (User behavior)</span>
                  <Badge variant="outline">Низкий приоритет</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>New Relic (APM)</span>
                  <Badge variant="outline">При росте нагрузки</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionReadiness;
