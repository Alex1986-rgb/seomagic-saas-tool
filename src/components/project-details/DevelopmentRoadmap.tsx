
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Target,
  Zap,
  Globe,
  Shield,
  BarChart3
} from 'lucide-react';

const DevelopmentRoadmap: React.FC = () => {
  const roadmapItems = [
    {
      quarter: "Q1 2024",
      status: "completed",
      title: "Основные модули",
      items: [
        "Crawler - рекурсивное сканирование",
        "SEO Analyzer - анализ параметров",
        "HTML Downloader - загрузка ресурсов",
        "Report Generator - PDF отчеты"
      ]
    },
    {
      quarter: "Q2 2024", 
      status: "completed",
      title: "ИИ интеграция",
      items: [
        "OpenAI Optimizer - улучшение контента",
        "Site Packager - архивация",
        "Publisher - загрузка на сервер",
        "Sitemap Generator"
      ]
    },
    {
      quarter: "Q3 2024",
      status: "in_progress", 
      title: "Расширенные возможности",
      items: [
        "Position Checker - отслеживание позиций",
        "Pinger - уведомление поисковиков",
        "Task Pipeline - управление задачами",
        "API интеграции"
      ]
    },
    {
      quarter: "Q4 2024",
      status: "planned",
      title: "Масштабирование",
      items: [
        "Мультисайтовая обработка",
        "Расширенная аналитика",
        "Интеграция с CMS",
        "Мобильное приложение"
      ]
    },
    {
      quarter: "Q1 2025",
      status: "planned", 
      title: "Энтерпрайз функции",
      items: [
        "Белый лейбл решение",
        "API для партнеров",
        "Расширенная безопасность",
        "Международная локализация"
      ]
    }
  ];

  const milestones = [
    {
      date: "Март 2024",
      title: "MVP запуск", 
      description: "Базовый функционал для аудита и оптимизации",
      icon: Target,
      status: "completed"
    },
    {
      date: "Июнь 2024",
      title: "ИИ интеграция",
      description: "Автоматическая оптимизация через OpenAI",
      icon: Zap,
      status: "completed"
    },
    {
      date: "Сентябрь 2024", 
      title: "Продакшн готовность",
      description: "Полноценная система для коммерческого использования",
      icon: Globe,
      status: "in_progress"
    },
    {
      date: "Декабрь 2024",
      title: "Масштабирование",
      description: "Поддержка высоких нагрузок и множественных сайтов",
      icon: BarChart3,
      status: "planned"
    },
    {
      date: "Март 2025",
      title: "Энтерпрайз уровень",
      description: "Корпоративные функции и безопасность",
      icon: Shield,
      status: "planned"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'planned': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned': return <Calendar className="h-4 w-4 text-gray-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В работе';
      case 'planned': return 'Запланировано';
      default: return 'Неопределено';
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Дорожная карта развития
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {roadmapItems.map((item, index) => (
              <div key={index} className={`p-6 border-2 rounded-lg ${getStatusColor(item.status)}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <h3 className="text-xl font-bold">{item.quarter}</h3>
                    <Badge variant="outline">{getStatusLabel(item.status)}</Badge>
                  </div>
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.items.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                      <span className="text-sm">{feature}</span>
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
            <Target className="h-5 w-5" />
            Ключевые вехи проекта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${getStatusColor(milestone.status)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <Badge variant="outline">{milestone.date}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Текущие приоритеты</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                🚀 Активная разработка
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Завершение позиционного трекера</li>
                <li>• Оптимизация производительности</li>
                <li>• Расширенная отчетность</li>
                <li>• Тестирование и отладка</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                ✅ Ближайшие планы
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Запуск в продакшн (Q3 2024)</li>
                <li>• Интеграция с популярными CMS</li>
                <li>• Мобильная версия</li>
                <li>• Партнерская программа</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentRoadmap;
