
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Globe, 
  Users, 
  TrendingUp, 
  Shield,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Zap,
  Database
} from 'lucide-react';

const ProjectOverview: React.FC = () => {
  const projectStats = [
    { label: 'Общая готовность', value: 85, color: 'text-green-600' },
    { label: 'Frontend', value: 90, color: 'text-blue-600' },
    { label: 'Backend', value: 80, color: 'text-purple-600' },
    { label: 'Тестирование', value: 75, color: 'text-orange-600' },
    { label: 'Документация', value: 70, color: 'text-teal-600' },
  ];

  const keyMetrics = [
    { icon: Globe, label: 'Всего страниц', value: '25+', trend: '+15%' },
    { icon: Users, label: 'Активных пользователей', value: '150+', trend: '+25%' },
    { icon: Clock, label: 'Время загрузки', value: '1.2s', trend: '-20%' },
    { icon: Shield, label: 'Уровень безопасности', value: 'Высокий', trend: '+10%' },
  ];

  const recentAchievements = [
    { title: 'Запуск SEO аудита', date: '2024-01-15', status: 'completed' },
    { title: 'Интеграция с Supabase', date: '2024-01-10', status: 'completed' },
    { title: 'Мобильная оптимизация', date: '2024-01-08', status: 'completed' },
    { title: 'Система аналитики', date: '2024-01-05', status: 'in-progress' },
  ];

  return (
    <div className="space-y-8">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Общая информация о проекте
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">О проекте SeoMarket</h3>
              <p className="text-muted-foreground mb-4">
                SeoMarket - это комплексная платформа для SEO-аудита и оптимизации веб-сайтов. 
                Проект предоставляет инструменты для глубокого анализа сайтов, автоматического 
                исправления ошибок и отслеживания позиций в поисковых системах.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Supabase</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Vite</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ключевые особенности</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Автоматический SEO-аудит</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>ИИ-powered оптимизация</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Отслеживание позиций</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Детальная аналитика</span>
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Интеграция с CMS (в разработке)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Прогресс разработки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{stat.label}</span>
                  <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}%</span>
                </div>
                <Progress value={stat.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-xs text-green-600">{metric.trend}</p>
                  </div>
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Последние достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {achievement.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.date}</p>
                  </div>
                </div>
                <Badge variant={achievement.status === 'completed' ? 'default' : 'secondary'}>
                  {achievement.status === 'completed' ? 'Завершено' : 'В процессе'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Технологический стек
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>React 18</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tailwind CSS</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Framer Motion</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Backend</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Supabase</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>PostgreSQL</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Edge Functions</span>
                  <Badge variant="outline">Тестирование</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Real-time API</span>
                  <Badge variant="outline">Интеграция</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Инструменты</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Vite</span>
                  <Badge variant="outline">Стабильно</Badge>
                </div>
                <div className="flex justify-between">
                  <span>ESLint</span>
                  <Badge variant="outline">Настроено</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Prettier</span>
                  <Badge variant="outline">Настроено</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lovable</span>
                  <Badge variant="outline">Активно</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
