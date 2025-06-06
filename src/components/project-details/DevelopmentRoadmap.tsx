
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Target, 
  Users, 
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const DevelopmentRoadmap: React.FC = () => {
  const phases = [
    {
      phase: 'Фаза 1: Основная функциональность',
      duration: '2-3 недели',
      status: 'in-progress',
      progress: 85,
      tasks: [
        { name: 'Завершение Supabase интеграции', priority: 'high', status: 'in-progress' },
        { name: 'Настройка аутентификации', priority: 'high', status: 'in-progress' },
        { name: 'Доработка SEO аудита', priority: 'medium', status: 'completed' },
        { name: 'Тестирование основных функций', priority: 'medium', status: 'pending' }
      ]
    },
    {
      phase: 'Фаза 2: Платежи и подписки',
      duration: '2-3 недели',
      status: 'pending',
      progress: 15,
      tasks: [
        { name: 'Интеграция Stripe', priority: 'high', status: 'pending' },
        { name: 'Система тарифных планов', priority: 'high', status: 'pending' },
        { name: 'Биллинг и счета', priority: 'medium', status: 'pending' },
        { name: 'Управление подписками', priority: 'medium', status: 'pending' }
      ]
    },
    {
      phase: 'Фаза 3: Расширенная аналитика',
      duration: '1-2 недели',
      status: 'pending',
      progress: 30,
      tasks: [
        { name: 'Google APIs интеграция', priority: 'high', status: 'pending' },
        { name: 'Улучшенная аналитика позиций', priority: 'medium', status: 'in-progress' },
        { name: 'Экспорт отчетов', priority: 'medium', status: 'pending' },
        { name: 'Email уведомления', priority: 'low', status: 'pending' }
      ]
    },
    {
      phase: 'Фаза 4: Оптимизация и безопасность',
      duration: '1-2 недели',
      status: 'pending',
      progress: 10,
      tasks: [
        { name: 'Производительность и оптимизация', priority: 'medium', status: 'pending' },
        { name: 'Безопасность и RLS политики', priority: 'high', status: 'pending' },
        { name: 'Мониторинг и логирование', priority: 'medium', status: 'pending' },
        { name: 'Тестирование и QA', priority: 'high', status: 'pending' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Завершено</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">В работе</Badge>;
      case 'pending':
        return <Badge variant="outline">Запланировано</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Высокий</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-xs">Средний</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Низкий</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Обычный</Badge>;
    }
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            План разработки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 border rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">6-10</div>
                <div className="text-sm text-muted-foreground">недель до MVP</div>
              </div>
              <div className="p-4 border rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">2-3</div>
                <div className="text-sm text-muted-foreground">разработчика</div>
              </div>
              <div className="p-4 border rounded-lg">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">72%</div>
                <div className="text-sm text-muted-foreground">готовности</div>
              </div>
              <div className="p-4 border rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">основные фазы</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {phases.map((phase, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{phase.phase}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Длительность: {phase.duration}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(phase.status)}
                  <div className="text-sm text-muted-foreground mt-1">
                    {phase.progress}% готово
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTaskIcon(task.status)}
                      <span className="text-sm font-medium">{task.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации по завершению проекта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Критические задачи (требуют немедленного внимания):</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Настройка Supabase RLS политик для безопасности данных</li>
                <li>Завершение системы аутентификации и авторизации</li>
                <li>Интеграция с внешними API (Google PageSpeed, OpenAI)</li>
                <li>Создание edge functions для backend логики</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Архитектурные решения:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Реализация очередей для длительных задач (сканирование сайтов)</li>
                <li>Кэширование результатов аудитов для повышения производительности</li>
                <li>Настройка мониторинга и алертов для production среды</li>
                <li>Создание CI/CD pipeline для автоматического деплоя</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Бизнес-логика:</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Определение лимитов для каждого тарифного плана</li>
                <li>Создание системы биллинга и управления подписками</li>
                <li>Настройка email-уведомлений для пользователей</li>
                <li>Интеграция аналитики для отслеживания использования</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentRoadmap;
