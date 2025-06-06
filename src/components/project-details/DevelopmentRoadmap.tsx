
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Globe,
  Settings,
  BarChart3,
  Lightbulb
} from 'lucide-react';

const DevelopmentRoadmap: React.FC = () => {
  const roadmapPhases = [
    {
      phase: "Фаза 1",
      title: "MVP и основной функционал",
      period: "Q4 2023 - Q1 2024",
      status: "completed",
      progress: 100,
      items: [
        { name: "Базовая архитектура проекта", completed: true, priority: "critical" },
        { name: "Система аутентификации", completed: true, priority: "high" },
        { name: "SEO аудит сайтов", completed: true, priority: "high" },
        { name: "Анализ метаданных", completed: true, priority: "high" },
        { name: "Базовое сканирование сайтов", completed: true, priority: "medium" },
        { name: "Пользовательский интерфейс", completed: true, priority: "high" }
      ]
    },
    {
      phase: "Фаза 2",
      title: "Улучшение производительности",
      period: "Q2 2024 - Q3 2024",
      status: "in-progress",
      progress: 75,
      items: [
        { name: "Анализ скорости загрузки", completed: true, priority: "high" },
        { name: "Мобильная оптимизация", completed: false, priority: "high" },
        { name: "Автоматическое исправление", completed: false, priority: "medium" },
        { name: "Система отчетов PDF", completed: false, priority: "medium" },
        { name: "Улучшение UX/UI", completed: true, priority: "medium" },
        { name: "Оптимизация производительности", completed: false, priority: "high" }
      ]
    },
    {
      phase: "Фаза 3",
      title: "Расширенная аналитика",
      period: "Q4 2024 - Q1 2025",
      status: "planned",
      progress: 0,
      items: [
        { name: "Отслеживание позиций", completed: false, priority: "high" },
        { name: "Анализ конкурентов", completed: false, priority: "medium" },
        { name: "Расширенная аналитика", completed: false, priority: "medium" },
        { name: "Система уведомлений", completed: false, priority: "low" },
        { name: "API для разработчиков", completed: false, priority: "medium" },
        { name: "Белые метки (White Label)", completed: false, priority: "low" }
      ]
    },
    {
      phase: "Фаза 4",
      title: "Интеграции и масштабирование",
      period: "Q2 2025 - Q3 2025",
      status: "future",
      progress: 0,
      items: [
        { name: "WordPress интеграция", completed: false, priority: "high" },
        { name: "Joomla интеграция", completed: false, priority: "medium" },
        { name: "Drupal интеграция", completed: false, priority: "medium" },
        { name: "Shopify интеграция", completed: false, priority: "medium" },
        { name: "Многоязычная поддержка", completed: false, priority: "low" },
        { name: "Enterprise функции", completed: false, priority: "low" }
      ]
    }
  ];

  const milestones = [
    {
      title: "Запуск MVP",
      date: "2024-01-15",
      status: "completed",
      description: "Первая рабочая версия с базовым функционалом SEO-аудита"
    },
    {
      title: "Публичный релиз",
      date: "2024-03-01",
      status: "completed",
      description: "Открытие доступа для первых пользователей"
    },
    {
      title: "Мобильная версия",
      date: "2024-06-15",
      status: "in-progress",
      description: "Полная адаптация под мобильные устройства"
    },
    {
      title: "API v1.0",
      date: "2024-09-01",
      status: "planned",
      description: "Публичный API для интеграции с внешними сервисами"
    },
    {
      title: "Enterprise релиз",
      date: "2025-01-01",
      status: "future",
      description: "Версия для крупных компаний с расширенными возможностями"
    }
  ];

  const backlogIdeas = [
    {
      title: "ИИ-ассистент для SEO",
      description: "Чат-бот с искусственным интеллектом для консультаций по SEO",
      votes: 45,
      category: "AI",
      difficulty: "high"
    },
    {
      title: "Интеграция с Google Analytics",
      description: "Автоматический импорт данных из Google Analytics",
      votes: 38,
      category: "Интеграция",
      difficulty: "medium"
    },
    {
      title: "Командная работа",
      description: "Возможность работы в команде с разными ролями пользователей",
      votes: 32,
      category: "Функциональность",
      difficulty: "medium"
    },
    {
      title: "Автоматические отчеты",
      description: "Еженедельные/ежемесячные отчеты по email",
      votes: 28,
      category: "Автоматизация",
      difficulty: "low"
    },
    {
      title: "Мобильное приложение",
      description: "Native приложения для iOS и Android",
      votes: 24,
      category: "Мобильные",
      difficulty: "high"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'future':
        return <Lightbulb className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
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
      case 'future':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Development Phases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Фазы разработки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmapPhases.map((phase, index) => (
              <div key={index} className="relative">
                {index < roadmapPhases.length - 1 && (
                  <div className="absolute left-6 top-16 w-px h-20 bg-border"></div>
                )}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(phase.status)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{phase.phase}: {phase.title}</h3>
                        <p className="text-sm text-muted-foreground">{phase.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status === 'completed' ? 'Завершено' :
                           phase.status === 'in-progress' ? 'В процессе' :
                           phase.status === 'planned' ? 'Запланировано' : 'Будущее'}
                        </Badge>
                        <span className="text-sm font-medium">{phase.progress}%</span>
                      </div>
                    </div>
                    <Progress value={phase.progress} className="mb-3 h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-2 border rounded text-sm">
                          <div className="flex items-center gap-2">
                            {item.completed ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <div className="h-3 w-3 rounded-full border border-gray-300"></div>
                            }
                            <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                              {item.name}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'critical' ? 'Критично' :
                             item.priority === 'high' ? 'Высокий' :
                             item.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ключевые вехи
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                {getStatusIcon(milestone.status)}
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Backlog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Идеи для будущих версий
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {backlogIdeas.map((idea, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{idea.title}</h3>
                  <Badge className={getDifficultyColor(idea.difficulty)}>
                    {idea.difficulty === 'high' ? 'Сложно' :
                     idea.difficulty === 'medium' ? 'Средне' : 'Легко'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{idea.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{idea.votes} голосов</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Сводка по дорожной карте
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">6 месяцев</div>
              <p className="text-sm text-muted-foreground">до полной готовности MVP</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">18 месяцев</div>
              <p className="text-sm text-muted-foreground">до Enterprise версии</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">25+</div>
              <p className="text-sm text-muted-foreground">запланированных функций</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Текущие приоритеты:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Завершение мобильной оптимизации</li>
              <li>• Реализация автоматического исправления ошибок</li>
              <li>• Улучшение системы отчетов</li>
              <li>• Оптимизация производительности</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentRoadmap;
