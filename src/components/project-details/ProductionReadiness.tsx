
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Server, 
  Database, 
  Monitor,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Settings,
  Users,
  HardDrive
} from 'lucide-react';

const ProductionReadiness: React.FC = () => {
  const readinessCategories = [
    {
      name: 'Безопасность',
      icon: Shield,
      score: 85,
      status: 'good',
      items: [
        { name: 'HTTPS/SSL сертификаты', status: 'completed', critical: true },
        { name: 'Аутентификация и авторизация', status: 'completed', critical: true },
        { name: 'Защита от CSRF/XSS', status: 'completed', critical: true },
        { name: 'Rate limiting', status: 'in-progress', critical: false },
        { name: 'Аудит безопасности', status: 'planned', critical: false },
        { name: 'Соответствие GDPR', status: 'completed', critical: true }
      ]
    },
    {
      name: 'Производительность',
      icon: Zap,
      score: 78,
      status: 'warning',
      items: [
        { name: 'Оптимизация изображений', status: 'in-progress', critical: false },
        { name: 'Минификация CSS/JS', status: 'completed', critical: false },
        { name: 'Кеширование', status: 'in-progress', critical: true },
        { name: 'CDN настройка', status: 'planned', critical: false },
        { name: 'Lazy loading', status: 'completed', critical: false },
        { name: 'Code splitting', status: 'completed', critical: true }
      ]
    },
    {
      name: 'Мониторинг',
      icon: Monitor,
      score: 65,
      status: 'warning',
      items: [
        { name: 'Error tracking (Sentry)', status: 'planned', critical: true },
        { name: 'Application monitoring', status: 'in-progress', critical: true },
        { name: 'Database monitoring', status: 'completed', critical: true },
        { name: 'User analytics', status: 'in-progress', critical: false },
        { name: 'Performance metrics', status: 'planned', critical: false },
        { name: 'Alerting system', status: 'planned', critical: true }
      ]
    },
    {
      name: 'Инфраструктура',
      icon: Server,
      score: 90,
      status: 'excellent',
      items: [
        { name: 'Автоматические бэкапы', status: 'completed', critical: true },
        { name: 'Load balancing', status: 'not-needed', critical: false },
        { name: 'Auto-scaling', status: 'completed', critical: true },
        { name: 'Disaster recovery', status: 'completed', critical: true },
        { name: 'CI/CD pipeline', status: 'completed', critical: true },
        { name: 'Environment separation', status: 'completed', critical: true }
      ]
    },
    {
      name: 'Документация',
      icon: BarChart3,
      score: 70,
      status: 'warning',
      items: [
        { name: 'API документация', status: 'in-progress', critical: false },
        { name: 'Пользовательская документация', status: 'in-progress', critical: false },
        { name: 'Техническая документация', status: 'completed', critical: true },
        { name: 'Deployment guide', status: 'completed', critical: true },
        { name: 'Troubleshooting guide', status: 'planned', critical: false },
        { name: 'Architecture overview', status: 'completed', critical: true }
      ]
    },
    {
      name: 'Тестирование',
      icon: CheckCircle,
      score: 60,
      status: 'critical',
      items: [
        { name: 'Unit тесты', status: 'in-progress', critical: true },
        { name: 'Integration тесты', status: 'planned', critical: true },
        { name: 'E2E тесты', status: 'planned', critical: false },
        { name: 'Performance тесты', status: 'planned', critical: false },
        { name: 'Security тесты', status: 'planned', critical: true },
        { name: 'User acceptance тесты', status: 'in-progress', critical: false }
      ]
    }
  ];

  const deploymentChecklist = [
    { name: 'Environment variables настроены', completed: true, critical: true },
    { name: 'Database миграции проверены', completed: true, critical: true },
    { name: 'SSL сертификат установлен', completed: true, critical: true },
    { name: 'Backup стратегия реализована', completed: true, critical: true },
    { name: 'Monitoring dashboard настроен', completed: false, critical: true },
    { name: 'Error tracking подключен', completed: false, critical: true },
    { name: 'Performance baseline установлен', completed: false, critical: false },
    { name: 'Security headers настроены', completed: true, critical: true },
    { name: 'Load testing проведено', completed: false, critical: false },
    { name: 'Rollback процедура протестирована', completed: false, critical: true }
  ];

  const performanceMetrics = [
    { name: 'Time to First Byte (TTFB)', current: '180ms', target: '< 200ms', status: 'good' },
    { name: 'First Contentful Paint (FCP)', current: '1.2s', target: '< 1.8s', status: 'good' },
    { name: 'Largest Contentful Paint (LCP)', current: '2.1s', target: '< 2.5s', status: 'good' },
    { name: 'Cumulative Layout Shift (CLS)', current: '0.08', target: '< 0.1', status: 'good' },
    { name: 'First Input Delay (FID)', current: '45ms', target: '< 100ms', status: 'good' },
    { name: 'Page Load Time', current: '2.8s', target: '< 3s', status: 'warning' }
  ];

  const securityAudit = [
    { area: 'Authentication', score: 95, issues: 0, recommendations: 1 },
    { area: 'Authorization', score: 90, issues: 0, recommendations: 2 },
    { area: 'Data Protection', score: 88, issues: 1, recommendations: 2 },
    { area: 'Input Validation', score: 85, issues: 2, recommendations: 3 },
    { area: 'Session Management', score: 92, issues: 0, recommendations: 1 },
    { area: 'Error Handling', score: 80, issues: 3, recommendations: 4 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'not-needed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCategoryStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const overallReadiness = Math.round(
    readinessCategories.reduce((sum, cat) => sum + cat.score, 0) / readinessCategories.length
  );

  const completedItems = deploymentChecklist.filter(item => item.completed).length;
  const deploymentProgress = Math.round((completedItems / deploymentChecklist.length) * 100);

  return (
    <div className="space-y-8">
      {/* Overall Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Общая готовность к продакшену
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(overallReadiness)}`}>
                {overallReadiness}%
              </div>
              <p className="text-muted-foreground">Общая готовность</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(deploymentProgress)}`}>
                {deploymentProgress}%
              </div>
              <p className="text-muted-foreground">Deployment готовность</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 text-blue-600">
                {readinessCategories.filter(cat => cat.score >= 80).length}/6
              </div>
              <p className="text-muted-foreground">Категорий готово</p>
            </div>
          </div>
          <Progress value={overallReadiness} className="h-3" />
        </CardContent>
      </Card>

      {/* Readiness Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {readinessCategories.map((category, index) => {
          const IconComponent = category.icon;
          const completedItems = category.items.filter(item => 
            item.status === 'completed' || item.status === 'not-needed'
          ).length;
          
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {category.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryStatusColor(category.status)}>
                      {category.status === 'excellent' ? 'Отлично' :
                       category.status === 'good' ? 'Хорошо' :
                       category.status === 'warning' ? 'Внимание' : 'Критично'}
                    </Badge>
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={category.score} className="h-2 mb-4" />
                  <div className="text-sm text-muted-foreground mb-3">
                    {completedItems}/{category.items.length} задач завершено
                  </div>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className={item.critical ? 'font-medium' : ''}>
                          {item.name}
                        </span>
                        {item.critical && (
                          <Badge variant="destructive" className="text-xs">
                            Критично
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Checklist для деплоя
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deploymentChecklist.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {item.completed ? 
                    <CheckCircle className="h-5 w-5 text-green-500" /> :
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                  }
                  <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                    {item.name}
                  </span>
                </div>
                {item.critical && (
                  <Badge variant={item.completed ? 'outline' : 'destructive'}>
                    Критично
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Метрики производительности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{metric.name}</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-lg font-bold ${getMetricStatusColor(metric.status)}`}>
                      {metric.current}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Цель: {metric.target}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Аудит безопасности
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityAudit.map((area, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">{area.area}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Оценка:</span>
                    <span className={`font-bold ${getScoreColor(area.score)}`}>
                      {area.score}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Проблемы:</span>
                    <span className={area.issues > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      {area.issues}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Рекомендации:</span>
                    <span className="text-blue-600">{area.recommendations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Рекомендации перед запуском
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">🚨 Критичные задачи:</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Настроить систему мониторинга и алертов</li>
                <li>• Подключить error tracking (Sentry)</li>
                <li>• Увеличить покрытие unit тестами до 80%</li>
                <li>• Протестировать rollback процедуру</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Рекомендуемые улучшения:</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Оптимизировать время загрузки страниц</li>
                <li>• Настроить CDN для статических ресурсов</li>
                <li>• Провести security audit с внешним консультантом</li>
                <li>• Создать comprehensive API документацию</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Постпродакшн планы:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Мониторинг user feedback и метрик использования</li>
                <li>• A/B тестирование ключевых функций</li>
                <li>• Регулярные security updates</li>
                <li>• План масштабирования при росте нагрузки</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionReadiness;
