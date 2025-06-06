
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  BarChart,
  Users,
  Settings,
  FileText,
  Shield,
  CreditCard
} from 'lucide-react';

const FeaturesStatus: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Готово</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">В разработке</Badge>;
      case 'not-started':
        return <Badge variant="destructive">Не начато</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'not-started':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const features = [
    {
      category: 'SEO Аудит',
      icon: Search,
      progress: 90,
      items: [
        { name: 'Основное сканирование сайта', status: 'completed', details: 'Базовый сканер готов, поддержка sitemap.xml' },
        { name: 'Анализ метаданных', status: 'completed', details: 'Title, description, заголовки H1-H6' },
        { name: 'Проверка скорости загрузки', status: 'in-progress', details: 'Интеграция с PageSpeed API - 70%' },
        { name: 'Анализ мобильной версии', status: 'in-progress', details: 'Mobile-friendly тест - 60%' },
        { name: 'Глубокое сканирование', status: 'completed', details: 'Массовое сканирование до 10000 страниц' },
        { name: 'Анализ дубликатов', status: 'completed', details: 'Обнаружение дублированного контента' },
        { name: 'Проверка битых ссылок', status: 'in-progress', details: 'Анализ внутренних и внешних ссылок - 80%' }
      ]
    },
    {
      category: 'Отслеживание позиций',
      icon: BarChart,
      progress: 75,
      items: [
        { name: 'Форма добавления ключевых слов', status: 'completed', details: 'Множественный ввод, группировка' },
        { name: 'Мониторинг позиций', status: 'in-progress', details: 'API интеграция с поисковыми системами - 60%' },
        { name: 'Аналитика позиций', status: 'completed', details: 'Графики, тренды, статистика' },
        { name: 'Отчеты по позициям', status: 'in-progress', details: 'PDF/Excel экспорт - 40%' },
        { name: 'Уведомления об изменениях', status: 'not-started', details: 'Email/Push уведомления' },
        { name: 'Анализ конкурентов', status: 'not-started', details: 'Сравнение с конкурентами' }
      ]
    },
    {
      category: 'Административная панель',
      icon: Settings,
      progress: 85,
      items: [
        { name: 'Дашборд администратора', status: 'completed', details: 'Основная статистика и навигация' },
        { name: 'Управление пользователями', status: 'in-progress', details: 'CRUD операции, роли - 70%' },
        { name: 'Аналитика системы', status: 'completed', details: 'Графики использования, метрики' },
        { name: 'Настройки сайта', status: 'completed', details: 'Конфигурация приложения' },
        { name: 'Мониторинг системы', status: 'completed', details: 'Статус сервисов, логи' },
        { name: 'Управление прокси', status: 'completed', details: 'Пинг сервис, тестирование прокси' },
        { name: 'Система безопасности', status: 'in-progress', details: 'Аудит действий, доступы - 50%' }
      ]
    },
    {
      category: 'Пользовательский интерфейс',
      icon: Users,
      progress: 80,
      items: [
        { name: 'Регистрация и авторизация', status: 'in-progress', details: 'Supabase Auth интеграция - 70%' },
        { name: 'Профиль пользователя', status: 'completed', details: 'Настройки, история аудитов' },
        { name: 'Клиентская панель', status: 'completed', details: 'Аудиты, отчеты, настройки' },
        { name: 'Система уведомлений', status: 'not-started', details: 'In-app уведомления' },
        { name: 'Мобильная адаптация', status: 'completed', details: 'Responsive дизайн для всех экранов' },
        { name: 'Темная тема', status: 'completed', details: 'Переключение светлой/темной темы' }
      ]
    },
    {
      category: 'Платежная система',
      icon: CreditCard,
      progress: 10,
      items: [
        { name: 'Интеграция со Stripe', status: 'not-started', details: 'Обработка платежей' },
        { name: 'Система подписок', status: 'not-started', details: 'Тарифные планы, recurring payments' },
        { name: 'Биллинг', status: 'not-started', details: 'Счета, история платежей' },
        { name: 'Управление тарифами', status: 'not-started', details: 'Админ панель для тарифов' }
      ]
    },
    {
      category: 'API и интеграции',
      icon: Shield,
      progress: 45,
      items: [
        { name: 'REST API эндпоинты', status: 'in-progress', details: 'Базовые CRUD операции - 60%' },
        { name: 'OpenAI интеграция', status: 'in-progress', details: 'ИИ оптимизация контента - 40%' },
        { name: 'Google APIs', status: 'not-started', details: 'PageSpeed, Search Console' },
        { name: 'Email сервис', status: 'not-started', details: 'Resend для отправки писем' },
        { name: 'Webhook система', status: 'not-started', details: 'Уведомления о событиях' },
        { name: 'Rate limiting', status: 'not-started', details: 'Ограничение запросов' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <category.icon className="h-5 w-5" />
                {category.category}
              </CardTitle>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Прогресс</span>
                  <span>{category.progress}%</span>
                </div>
                <Progress value={category.progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Критические задачи для завершения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-950/20">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Высокий приоритет</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>Настройка Supabase Authentication с RLS политиками</li>
                <li>Интеграция платежной системы Stripe</li>
                <li>Подключение Google PageSpeed API для анализа скорости</li>
                <li>Система email уведомлений через Resend</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Средний приоритет</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Доработка API для отслеживания позиций</li>
                <li>Создание системы тарифных планов</li>
                <li>Улучшение анализа битых ссылок</li>
                <li>Добавление webhook системы</li>
              </ul>
            </div>
            
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Низкий приоритет</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>Анализ конкурентов</li>
                <li>Расширенная аналитика</li>
                <li>Мобильное приложение</li>
                <li>Интеграция с социальными сетями</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesStatus;
