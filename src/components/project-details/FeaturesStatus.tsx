
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  FileText, 
  Zap, 
  Smartphone,
  TrendingUp,
  Users,
  Shield,
  Settings,
  Database,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';

const FeaturesStatus: React.FC = () => {
  const features = [
    {
      name: 'Полное сканирование сайта',
      icon: Search,
      status: 'completed',
      progress: 100,
      description: 'Глубокий анализ всех страниц сайта для обнаружения SEO проблем',
      priority: 'high',
      category: 'Аудит',
      estimatedHours: 40,
      completedHours: 40
    },
    {
      name: 'Анализ метаданных',
      icon: FileText,
      status: 'completed',
      progress: 95,
      description: 'Проверка тегов title, description и других метаданных',
      priority: 'high',
      category: 'Аудит',
      estimatedHours: 20,
      completedHours: 19
    },
    {
      name: 'Проверка скорости загрузки',
      icon: Zap,
      status: 'in-progress',
      progress: 75,
      description: 'Анализ времени загрузки страниц и рекомендации по оптимизации',
      priority: 'medium',
      category: 'Производительность',
      estimatedHours: 30,
      completedHours: 22
    },
    {
      name: 'Проверка мобильной версии',
      icon: Smartphone,
      status: 'in-progress',
      progress: 80,
      description: 'Тестирование адаптивности и удобства использования на мобильных устройствах',
      priority: 'high',
      category: 'UX/UI',
      estimatedHours: 25,
      completedHours: 20
    },
    {
      name: 'Отслеживание позиций',
      icon: TrendingUp,
      status: 'planned',
      progress: 0,
      description: 'Ежедневный мониторинг позиций сайта в поисковых системах',
      priority: 'medium',
      category: 'Мониторинг',
      estimatedHours: 50,
      completedHours: 0
    },
    {
      name: 'Анализ конкурентов',
      icon: Users,
      status: 'planned',
      progress: 0,
      description: 'Сравнение позиций с конкурентами для определения SEO-стратегии',
      priority: 'medium',
      category: 'Аналитика',
      estimatedHours: 35,
      completedHours: 0
    },
    {
      name: 'Автоматическое исправление',
      icon: Settings,
      status: 'in-progress',
      progress: 60,
      description: 'ИИ-powered автоматическое исправление найденных SEO-ошибок',
      priority: 'high',
      category: 'Автоматизация',
      estimatedHours: 60,
      completedHours: 36
    },
    {
      name: 'Безопасность данных',
      icon: Shield,
      status: 'completed',
      progress: 90,
      description: 'Полная конфиденциальность и безопасность данных с соблюдением GDPR',
      priority: 'critical',
      category: 'Безопасность',
      estimatedHours: 30,
      completedHours: 27
    },
    {
      name: 'Интеграция с CMS',
      icon: Database,
      status: 'not-started',
      progress: 0,
      description: 'Совместимость с популярными CMS-системами: WordPress, Joomla, Drupal',
      priority: 'low',
      category: 'Интеграция',
      estimatedHours: 80,
      completedHours: 0
    },
    {
      name: 'Отчеты о производительности',
      icon: BarChart3,
      status: 'in-progress',
      progress: 45,
      description: 'Детальные отчеты о производительности с экспортом в PDF',
      priority: 'medium',
      category: 'Отчетность',
      estimatedHours: 40,
      completedHours: 18
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'not-started':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'in-progress':
        return 'В процессе';
      case 'planned':
        return 'Запланировано';
      case 'not-started':
        return 'Не начато';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categories = [...new Set(features.map(f => f.category))];
  
  const overallProgress = Math.round(
    features.reduce((sum, feature) => sum + feature.progress, 0) / features.length
  );

  const completedFeatures = features.filter(f => f.status === 'completed').length;
  const inProgressFeatures = features.filter(f => f.status === 'in-progress').length;
  const plannedFeatures = features.filter(f => f.status === 'planned').length;
  const notStartedFeatures = features.filter(f => f.status === 'not-started').length;

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Общий прогресс разработки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedFeatures}</div>
              <div className="text-sm text-muted-foreground">Завершено</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{inProgressFeatures}</div>
              <div className="text-sm text-muted-foreground">В процессе</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{plannedFeatures}</div>
              <div className="text-sm text-muted-foreground">Запланировано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{notStartedFeatures}</div>
              <div className="text-sm text-muted-foreground">Не начато</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Общий прогресс</div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Features by Category */}
      {categories.map(category => {
        const categoryFeatures = features.filter(f => f.category === category);
        const categoryProgress = Math.round(
          categoryFeatures.reduce((sum, feature) => sum + feature.progress, 0) / categoryFeatures.length
        );

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category}</span>
                <Badge variant="outline">{categoryProgress}% завершено</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-semibold">{feature.name}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(feature.status)}
                            <Badge className={getStatusColor(feature.status)}>
                              {getStatusLabel(feature.status)}
                            </Badge>
                          </div>
                          <Badge className={getPriorityColor(feature.priority)}>
                            {feature.priority === 'critical' ? 'Критично' :
                             feature.priority === 'high' ? 'Высокий' :
                             feature.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс: {feature.progress}%</span>
                          <span>{feature.completedHours}/{feature.estimatedHours} часов</span>
                        </div>
                        <Progress value={feature.progress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Development Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Временная шкала разработки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Фаза 1: Основной функционал (Завершена)</h4>
              <p className="text-sm text-green-800 mb-2">
                Реализованы базовые функции SEO-аудита, сканирования сайтов и анализа метаданных.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Сканирование сайта</Badge>
                <Badge variant="outline">Анализ метаданных</Badge>
                <Badge variant="outline">Базовая безопасность</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Фаза 2: Улучшения UX/Performance (В процессе)</h4>
              <p className="text-sm text-blue-800 mb-2">
                Работа над производительностью, мобильной версией и автоматическим исправлением ошибок.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Скорость загрузки</Badge>
                <Badge variant="outline">Мобильная версия</Badge>
                <Badge variant="outline">Автоисправление</Badge>
                <Badge variant="outline">Отчеты PDF</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Фаза 3: Расширенная аналитика (Запланирована)</h4>
              <p className="text-sm text-orange-800 mb-2">
                Добавление отслеживания позиций, анализа конкурентов и расширенной аналитики.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Отслеживание позиций</Badge>
                <Badge variant="outline">Анализ конкурентов</Badge>
                <Badge variant="outline">Расширенная аналитика</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Фаза 4: Интеграции (Будущее развитие)</h4>
              <p className="text-sm text-gray-800 mb-2">
                Интеграция с популярными CMS-системами и внешними сервисами.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">WordPress интеграция</Badge>
                <Badge variant="outline">Joomla поддержка</Badge>
                <Badge variant="outline">API для разработчиков</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesStatus;
