
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
  BarChart3,
  Users,
  Rocket
} from 'lucide-react';

const DevelopmentRoadmap: React.FC = () => {
  const roadmapItems = [
    {
      quarter: "Q1 2024",
      status: "completed",
      title: "Основная инфраструктура",
      items: [
        "Crawler - рекурсивное сканирование",
        "SEO Analyzer - глубокий анализ параметров",
        "HTML Processor - загрузка и обработка",
        "Report Generator - PDF отчеты и аналитика"
      ]
    },
    {
      quarter: "Q2 2024", 
      status: "completed",
      title: "ИИ интеграция и оптимизация",
      items: [
        "OpenAI Optimizer - умная оптимизация контента",
        "HTML Fixer - автоматическое исправление кода",
        "Site Packager - упаковка готового сайта",
        "Sitemap Generator - создание карт сайта"
      ]
    },
    {
      quarter: "Q3 2024",
      status: "completed", 
      title: "Публикация и автоматизация",
      items: [
        "FTP Publisher - автоматическая публикация",
        "Search Pinger - уведомление поисковиков",
        "Task Manager - управление очередями",
        "SSL Manager - автоматические сертификаты"
      ]
    },
    {
      quarter: "Q4 2024",
      status: "in_progress",
      title: "Мониторинг и аналитика",
      items: [
        "Position Tracker - отслеживание позиций",
        "Performance Monitor - мониторинг скорости",
        "Analytics Dashboard - детальная аналитика",
        "Competitor Analysis - анализ конкурентов"
      ]
    },
    {
      quarter: "Q1 2025",
      status: "planned", 
      title: "Расширенные возможности",
      items: [
        "Мультисайтовая обработка",
        "API для интеграций",
        "Белый лейбл решение",
        "Мобильное приложение"
      ]
    }
  ];

  const milestones = [
    {
      date: "Март 2024",
      title: "Альфа версия", 
      description: "Базовый функционал сканирования и анализа",
      icon: Target,
      status: "completed"
    },
    {
      date: "Июнь 2024",
      title: "Бета версия",
      description: "ИИ оптимизация и автоматическое исправление",
      icon: Zap,
      status: "completed"
    },
    {
      date: "Сентябрь 2024", 
      title: "Релиз 1.0",
      description: "Полнофункциональная система для продакшн",
      icon: Rocket,
      status: "completed"
    },
    {
      date: "Декабрь 2024",
      title: "Версия 1.5",
      description: "Расширенная аналитика и мониторинг",
      icon: BarChart3,
      status: "in_progress"
    },
    {
      date: "Март 2025",
      title: "Версия 2.0",
      description: "Энтерпрайз функции и масштабирование",
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
            Дорожная карта развития проекта
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Текущий фокус
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  🚧 Активная разработка
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Доработка позиционного трекера</li>
                  <li>• Оптимизация производительности</li>
                  <li>• Расширенные отчеты</li>
                  <li>• Финальное тестирование</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/50 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                  ✅ Готово к использованию
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Полное сканирование сайтов</li>
                  <li>• ИИ оптимизация контента</li>
                  <li>• Автоматическое исправление HTML</li>
                  <li>• Публикация на поддомен</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Ближайшие планы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/50 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-400 mb-2">
                  🎯 Q1 2025
                </h4>
                <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Пакетная обработка сайтов</li>
                  <li>• API для внешних интеграций</li>
                  <li>• Расширенная аналитика</li>
                  <li>• Система уведомлений</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/50 rounded-lg">
                <h4 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                  🚀 Долгосрочные цели
                </h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• Машинное обучение для SEO</li>
                  <li>• Интеграция с CMS</li>
                  <li>• Мобильное приложение</li>
                  <li>• Партнерская программа</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevelopmentRoadmap;
