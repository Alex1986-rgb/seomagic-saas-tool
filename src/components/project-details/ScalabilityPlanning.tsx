
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Server, 
  Database,
  Users,
  Globe,
  Zap,
  BarChart3,
  Target,
  Layers,
  Cloud
} from 'lucide-react';

const ScalabilityPlanning: React.FC = () => {
  const scalabilityMetrics = [
    {
      title: "Текущая нагрузка",
      value: "1,250",
      unit: "запросов/час",
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Пиковая нагрузка",
      value: "5,000",
      unit: "запросов/час",
      trend: "+25%",
      color: "text-green-600"
    },
    {
      title: "Использование CPU",
      value: "35%",
      unit: "среднее",
      trend: "-5%",
      color: "text-yellow-600"
    },
    {
      title: "Использование RAM",
      value: "2.8GB",
      unit: "из 8GB",
      trend: "+8%",
      color: "text-purple-600"
    }
  ];

  const infrastructureComponents = [
    {
      component: "Web серверы",
      current: 2,
      recommended: 4,
      maxCapacity: "10,000 req/h",
      status: "good",
      cost: "$120/мес"
    },
    {
      component: "База данных",
      current: 1,
      recommended: 2,
      maxCapacity: "50,000 записей/мин",
      status: "planning",
      cost: "$200/мес"
    },
    {
      component: "Redis кэш",
      current: 1,
      recommended: 1,
      maxCapacity: "100GB памяти",
      status: "good",
      cost: "$50/мес"
    },
    {
      component: "CDN узлы",
      current: 3,
      recommended: 6,
      maxCapacity: "1TB трафика",
      status: "planning",
      cost: "$80/мес"
    }
  ];

  const scalingStrategies = [
    {
      strategy: "Горизонтальное масштабирование",
      description: "Добавление новых серверов для распределения нагрузки",
      priority: "Высокий",
      timeline: "Q1 2025",
      benefits: ["Повышение надежности", "Линейное увеличение производительности"],
      icon: Server
    },
    {
      strategy: "Кэширование данных",
      description: "Внедрение многоуровневого кэширования",
      priority: "Средний",
      timeline: "Q2 2025",
      benefits: ["Снижение нагрузки на БД", "Ускорение ответов"],
      icon: Zap
    },
    {
      strategy: "Микросервисная архитектура",
      description: "Разделение на независимые сервисы",
      priority: "Средний",
      timeline: "Q3 2025",
      benefits: ["Независимое масштабирование", "Изоляция отказов"],
      icon: Layers
    },
    {
      strategy: "Cloud-native решения",
      description: "Переход на облачную инфраструктуру",
      priority: "Низкий",
      timeline: "Q4 2025",
      benefits: ["Автомасштабирование", "Снижение операционных затрат"],
      icon: Cloud
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'planning': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Высокий': return 'text-red-600 bg-red-100';
      case 'Средний': return 'text-yellow-600 bg-yellow-100';
      case 'Низкий': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Планирование масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {scalabilityMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.unit}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {metric.trend}
                </div>
                <div className="text-sm font-medium mt-1">
                  {metric.title}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Инфраструктура
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {infrastructureComponents.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{component.component}</h4>
                  <div className="text-sm text-muted-foreground">
                    Текущее: {component.current} | Рекомендуемое: {component.recommended}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Максимальная нагрузка: {component.maxCapacity}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(component.status)}>
                    {component.status === 'good' ? 'Достаточно' : 'Планируется'}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {component.cost}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Стратегии масштабирования
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scalingStrategies.map((strategy, index) => {
              const IconComponent = strategy.icon;
              return (
                <div key={index} className="p-6 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                    <Badge variant="outline" className={getPriorityColor(strategy.priority)}>
                      {strategy.priority}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold mb-2">{strategy.strategy}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {strategy.description}
                  </p>
                  
                  <div className="text-xs text-muted-foreground mb-3">
                    Планируемая реализация: {strategy.timeline}
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Преимущества:</h5>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {strategy.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
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
              <BarChart3 className="h-5 w-5" />
              Прогноз роста
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Пользователи (6 мес)</span>
                  <span>+150%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Запросы (6 мес)</span>
                  <span>+200%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Данные (6 мес)</span>
                  <span>+120%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Целевые показатели
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Concurrent пользователи</span>
                <div className="text-right">
                  <div className="font-semibold">10,000</div>
                  <div className="text-xs text-muted-foreground">к концу 2025</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Время отклика</span>
                <div className="text-right">
                  <div className="font-semibold">&lt; 200ms</div>
                  <div className="text-xs text-muted-foreground">95 percentile</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Uptime</span>
                <div className="text-right">
                  <div className="font-semibold">99.95%</div>
                  <div className="text-xs text-muted-foreground">SLA цель</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScalabilityPlanning;
