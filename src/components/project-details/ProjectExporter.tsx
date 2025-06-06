
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileText, 
  Code, 
  Globe,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectExporterProps {
  projectData: {
    name: string;
    description: string;
    progress: number;
    features: any[];
    architecture: any;
    roadmap: any[];
  };
}

const ProjectExporter: React.FC<ProjectExporterProps> = ({ projectData }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const exportToPDF = async () => {
    setIsExporting('pdf');
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('SeoMarket - Детали проекта', 20, 30);
      
      // Description
      doc.setFontSize(12);
      doc.text('Техническая документация проекта для разработчиков', 20, 45);
      
      // Progress
      doc.setFontSize(14);
      doc.text(`Общий прогресс: ${projectData.progress}%`, 20, 65);
      
      // Features summary
      doc.text('Основные модули:', 20, 85);
      let yPos = 100;
      
      const modules = [
        'SEO Аудит - 90% готов',
        'Отслеживание позиций - 75% готов', 
        'Административная панель - 85% готова',
        'Пользовательский интерфейс - 80% готов',
        'Платежная система - 10% готова',
        'API и интеграции - 45% готовы'
      ];
      
      modules.forEach(module => {
        doc.text(`• ${module}`, 25, yPos);
        yPos += 10;
      });
      
      // Technical stack
      yPos += 15;
      doc.setFontSize(14);
      doc.text('Технический стек:', 20, yPos);
      yPos += 15;
      
      const techStack = [
        'Frontend: React 18.3 + TypeScript 5.0',
        'Styling: Tailwind CSS + Shadcn UI',
        'Backend: Supabase (PostgreSQL)',
        'API: Edge Functions + REST',
        'Деплой: Vite + SPA hosting'
      ];
      
      techStack.forEach(tech => {
        doc.text(`• ${tech}`, 25, yPos);
        yPos += 10;
      });
      
      // Save the PDF
      doc.save('seomarket-project-details.pdf');
      
      toast({
        title: "PDF экспортирован",
        description: "Файл успешно сохранен на ваше устройство",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось создать PDF файл",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportToMarkdown = () => {
    setIsExporting('markdown');
    
    const markdown = `# SeoMarket - Детали проекта

## Описание проекта
SeoMarket - это комплексная SaaS-платформа для SEO-аудита и оптимизации сайтов. 
Проект включает в себя инструменты для анализа сайта, отслеживания позиций, 
автоматической оптимизации и детальной отчетности.

## Общий прогресс: ${projectData.progress}%

## Технический стек

### Frontend
- React 18.3
- TypeScript 5.0
- Tailwind CSS
- Shadcn UI
- Framer Motion

### Backend
- Supabase (PostgreSQL)
- Edge Functions
- REST API

### Основные зависимости
- @supabase/supabase-js ^2.49.4
- @tanstack/react-query ^5.56.2
- framer-motion ^10.16.4
- axios ^1.8.4
- recharts ^2.12.7
- lucide-react ^0.484.0

## Статус модулей

### SEO Аудит (90% готов)
- ✅ Основное сканирование сайта
- ✅ Анализ метаданных
- 🔄 Проверка скорости загрузки (70%)
- 🔄 Анализ мобильной версии (60%)
- ✅ Глубокое сканирование
- ✅ Анализ дубликатов
- 🔄 Проверка битых ссылок (80%)

### Отслеживание позиций (75% готов)
- ✅ Форма добавления ключевых слов
- 🔄 Мониторинг позиций (60%)
- ✅ Аналитика позиций
- 🔄 Отчеты по позициям (40%)
- ❌ Уведомления об изменениях
- ❌ Анализ конкурентов

### Административная панель (85% готова)
- ✅ Дашборд администратора
- 🔄 Управление пользователями (70%)
- ✅ Аналитика системы
- ✅ Настройки сайта
- ✅ Мониторинг системы
- ✅ Управление прокси
- 🔄 Система безопасности (50%)

### Пользовательский интерфейс (80% готов)
- 🔄 Регистрация и авторизация (70%)
- ✅ Профиль пользователя
- ✅ Клиентская панель
- ❌ Система уведомлений
- ✅ Мобильная адаптация
- ✅ Темная тема

### Платежная система (10% готова)
- ❌ Интеграция со Stripe
- ❌ Система подписок
- ❌ Биллинг
- ❌ Управление тарифами

### API и интеграции (45% готовы)
- 🔄 REST API эндпоинты (60%)
- 🔄 OpenAI интеграция (40%)
- ❌ Google APIs
- ❌ Email сервис
- ❌ Webhook система
- ❌ Rate limiting

## Критические задачи

### Высокий приоритет
- Настройка Supabase Authentication с RLS политиками
- Интеграция платежной системы Stripe
- Подключение Google PageSpeed API для анализа скорости
- Система email уведомлений через Resend

### Средний приоритет
- Доработка API для отслеживания позиций
- Создание системы тарифных планов
- Улучшение анализа битых ссылок
- Добавление webhook системы

## Структура проекта

\`\`\`
src/
├── components/           # React компоненты (147 готовых)
│   ├── admin/           # Админ панель (85% готово)
│   ├── audit/           # SEO аудит (90% готово)
│   ├── auth/            # Аутентификация (70% готово)
│   ├── client/          # Клиентская панель (80% готово)
│   ├── features/        # Страницы функций (95% готово)
│   ├── navbar/          # Навигация (100% готово)
│   ├── position-tracker/# Отслеживание позиций (75% готово)
│   └── ui/              # UI компоненты (100% готово)
├── hooks/               # Пользовательские хуки (60% готово)
├── pages/               # Страницы приложения (85% готово)
├── services/            # API сервисы (45% готово)
├── types/               # TypeScript типы (80% готово)
└── utils/               # Утилиты (70% готово)
\`\`\`

## План разработки

### Фаза 1: Основная функциональность (2-3 недели, 85% готово)
- Завершение Supabase интеграции
- Настройка аутентификации
- Доработка SEO аудита
- Тестирование основных функций

### Фаза 2: Платежи и подписки (2-3 недели, 15% готово)
- Интеграция Stripe
- Система тарифных планов
- Биллинг и счета
- Управление подписками

### Фаза 3: Расширенная аналитика (1-2 недели, 30% готово)
- Google APIs интеграция
- Улучшенная аналитика позиций
- Экспорт отчетов
- Email уведомления

### Фаза 4: Оптимизация и безопасность (1-2 недели, 10% готово)
- Производительность и оптимизация
- Безопасность и RLS политики
- Мониторинг и логирование
- Тестирование и QA

---

*Документация создана: ${new Date().toLocaleDateString('ru-RU')}*
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seomarket-project-details.md';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown экспортирован",
      description: "Файл успешно сохранен на ваше устройство",
    });
    
    setIsExporting(null);
  };

  const exportToHTML = () => {
    setIsExporting('html');
    
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoMarket - Детали проекта</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 1200px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 30px; }
        h3 { color: #4b5563; }
        .progress { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .progress-bar { background: #3b82f6; height: 100%; }
        .status-completed { color: #10b981; }
        .status-progress { color: #f59e0b; }
        .status-not-started { color: #ef4444; }
        .tech-stack { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .module { background: #fff; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .priority-high { border-left: 4px solid #ef4444; }
        .priority-medium { border-left: 4px solid #f59e0b; }
        .priority-low { border-left: 4px solid #10b981; }
        ul { list-style-type: none; padding-left: 0; }
        li { padding: 5px 0; }
        .icon { display: inline-block; width: 20px; }
    </style>
</head>
<body>
    <h1>SeoMarket - Детали проекта</h1>
    
    <p><strong>Техническая документация проекта для разработчиков</strong></p>
    
    <h2>Общий прогресс</h2>
    <div class="progress">
        <div class="progress-bar" style="width: ${projectData.progress}%"></div>
    </div>
    <p><strong>${projectData.progress}% готовности</strong></p>
    
    <div class="tech-stack">
        <h3>Технический стек</h3>
        <ul>
            <li><strong>Frontend:</strong> React 18.3 + TypeScript 5.0</li>
            <li><strong>Styling:</strong> Tailwind CSS + Shadcn UI</li>
            <li><strong>Backend:</strong> Supabase (PostgreSQL)</li>
            <li><strong>API:</strong> Edge Functions + REST</li>
            <li><strong>Деплой:</strong> Vite + SPA hosting</li>
        </ul>
    </div>
    
    <h2>Статус модулей</h2>
    
    <div class="module">
        <h3>SEO Аудит (90% готов)</h3>
        <ul>
            <li><span class="icon status-completed">✅</span> Основное сканирование сайта</li>
            <li><span class="icon status-completed">✅</span> Анализ метаданных</li>
            <li><span class="icon status-progress">🔄</span> Проверка скорости загрузки (70%)</li>
            <li><span class="icon status-progress">🔄</span> Анализ мобильной версии (60%)</li>
            <li><span class="icon status-completed">✅</span> Глубокое сканирование</li>
            <li><span class="icon status-completed">✅</span> Анализ дубликатов</li>
            <li><span class="icon status-progress">🔄</span> Проверка битых ссылок (80%)</li>
        </ul>
    </div>
    
    <div class="module">
        <h3>Отслеживание позиций (75% готов)</h3>
        <ul>
            <li><span class="icon status-completed">✅</span> Форма добавления ключевых слов</li>
            <li><span class="icon status-progress">🔄</span> Мониторинг позиций (60%)</li>
            <li><span class="icon status-completed">✅</span> Аналитика позиций</li>
            <li><span class="icon status-progress">🔄</span> Отчеты по позициям (40%)</li>
            <li><span class="icon status-not-started">❌</span> Уведомления об изменениях</li>
            <li><span class="icon status-not-started">❌</span> Анализ конкурентов</li>
        </ul>
    </div>
    
    <h2>Критические задачи</h2>
    
    <div class="module priority-high">
        <h3>Высокий приоритет</h3>
        <ul>
            <li>Настройка Supabase Authentication с RLS политиками</li>
            <li>Интеграция платежной системы Stripe</li>
            <li>Подключение Google PageSpeed API для анализа скорости</li>
            <li>Система email уведомлений через Resend</li>
        </ul>
    </div>
    
    <div class="module priority-medium">
        <h3>Средний приоритет</h3>
        <ul>
            <li>Доработка API для отслеживания позиций</li>
            <li>Создание системы тарифных планов</li>
            <li>Улучшение анализа битых ссылок</li>
            <li>Добавление webhook системы</li>
        </ul>
    </div>
    
    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
        <p>Документация создана: ${new Date().toLocaleDateString('ru-RU')}</p>
        <p>SeoMarket Project Documentation</p>
    </footer>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seomarket-project-details.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "HTML экспортирован",
      description: "Файл успешно сохранен на ваше устройство",
    });
    
    setIsExporting(null);
  };

  const exportToJSON = () => {
    setIsExporting('json');
    
    const jsonData = {
      project: {
        name: "SeoMarket",
        description: "Комплексная SaaS-платформа для SEO-аудита и оптимизации сайтов",
        version: "1.0.0",
        progress: projectData.progress,
        created: new Date().toISOString(),
        
        techStack: {
          frontend: {
            framework: "React 18.3",
            language: "TypeScript 5.0",
            styling: "Tailwind CSS + Shadcn UI",
            animations: "Framer Motion",
            routing: "React Router DOM"
          },
          backend: {
            platform: "Supabase",
            database: "PostgreSQL",
            api: "Edge Functions + REST",
            auth: "Supabase Auth"
          },
          tools: {
            bundler: "Vite",
            deployment: "SPA hosting",
            stateManagement: "@tanstack/react-query",
            ui: "Shadcn UI + Radix UI"
          }
        },
        
        modules: {
          seoAudit: {
            name: "SEO Аудит",
            progress: 90,
            features: [
              { name: "Основное сканирование сайта", status: "completed" },
              { name: "Анализ метаданных", status: "completed" },
              { name: "Проверка скорости загрузки", status: "in-progress", progress: 70 },
              { name: "Анализ мобильной версии", status: "in-progress", progress: 60 },
              { name: "Глубокое сканирование", status: "completed" },
              { name: "Анализ дубликатов", status: "completed" },
              { name: "Проверка битых ссылок", status: "in-progress", progress: 80 }
            ]
          },
          positionTracking: {
            name: "Отслеживание позиций",
            progress: 75,
            features: [
              { name: "Форма добавления ключевых слов", status: "completed" },
              { name: "Мониторинг позиций", status: "in-progress", progress: 60 },
              { name: "Аналитика позиций", status: "completed" },
              { name: "Отчеты по позициям", status: "in-progress", progress: 40 },
              { name: "Уведомления об изменениях", status: "not-started" },
              { name: "Анализ конкурентов", status: "not-started" }
            ]
          },
          adminPanel: {
            name: "Административная панель",
            progress: 85,
            features: [
              { name: "Дашборд администратора", status: "completed" },
              { name: "Управление пользователями", status: "in-progress", progress: 70 },
              { name: "Аналитика системы", status: "completed" },
              { name: "Настройки сайта", status: "completed" },
              { name: "Мониторинг системы", status: "completed" },
              { name: "Управление прокси", status: "completed" },
              { name: "Система безопасности", status: "in-progress", progress: 50 }
            ]
          },
          userInterface: {
            name: "Пользовательский интерфейс",
            progress: 80,
            features: [
              { name: "Регистрация и авторизация", status: "in-progress", progress: 70 },
              { name: "Профиль пользователя", status: "completed" },
              { name: "Клиентская панель", status: "completed" },
              { name: "Система уведомлений", status: "not-started" },
              { name: "Мобильная адаптация", status: "completed" },
              { name: "Темная тема", status: "completed" }
            ]
          },
          paymentSystem: {
            name: "Платежная система",
            progress: 10,
            features: [
              { name: "Интеграция со Stripe", status: "not-started" },
              { name: "Система подписок", status: "not-started" },
              { name: "Биллинг", status: "not-started" },
              { name: "Управление тарифами", status: "not-started" }
            ]
          },
          apiIntegrations: {
            name: "API и интеграции",
            progress: 45,
            features: [
              { name: "REST API эндпоинты", status: "in-progress", progress: 60 },
              { name: "OpenAI интеграция", status: "in-progress", progress: 40 },
              { name: "Google APIs", status: "not-started" },
              { name: "Email сервис", status: "not-started" },
              { name: "Webhook система", status: "not-started" },
              { name: "Rate limiting", status: "not-started" }
            ]
          }
        },
        
        criticalTasks: {
          high: [
            "Настройка Supabase Authentication с RLS политиками",
            "Интеграция платежной системы Stripe",
            "Подключение Google PageSpeed API для анализа скорости",
            "Система email уведомлений через Resend"
          ],
          medium: [
            "Доработка API для отслеживания позиций",
            "Создание системы тарифных планов",
            "Улучшение анализа битых ссылок",
            "Добавление webhook системы"
          ],
          low: [
            "Анализ конкурентов",
            "Расширенная аналитика",
            "Мобильное приложение",
            "Интеграция с социальными сетями"
          ]
        },
        
        developmentPhases: [
          {
            name: "Фаза 1: Основная функциональность",
            duration: "2-3 недели",
            progress: 85,
            status: "in-progress"
          },
          {
            name: "Фаза 2: Платежи и подписки",
            duration: "2-3 недели",
            progress: 15,
            status: "pending"
          },
          {
            name: "Фаза 3: Расширенная аналитика",
            duration: "1-2 недели",
            progress: 30,
            status: "pending"
          },
          {
            name: "Фаза 4: Оптимизация и безопасность",
            duration: "1-2 недели",
            progress: 10,
            status: "pending"
          }
        ]
      }
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seomarket-project-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "JSON экспортирован",
      description: "Файл успешно сохранен на ваше устройство",
    });
    
    setIsExporting(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Экспорт документации
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={exportToPDF}
            disabled={isExporting === 'pdf'}
            className="h-auto flex-col py-4"
          >
            {isExporting === 'pdf' ? (
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
            ) : (
              <FileText className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm">PDF документ</span>
            <span className="text-xs text-muted-foreground mt-1">
              Готовый к печати
            </span>
          </Button>

          <Button
            onClick={exportToMarkdown}
            disabled={isExporting === 'markdown'}
            variant="outline"
            className="h-auto flex-col py-4"
          >
            {isExporting === 'markdown' ? (
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
            ) : (
              <Code className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm">Markdown</span>
            <span className="text-xs text-muted-foreground mt-1">
              Для GitHub/Wiki
            </span>
          </Button>

          <Button
            onClick={exportToHTML}
            disabled={isExporting === 'html'}
            variant="outline"
            className="h-auto flex-col py-4"
          >
            {isExporting === 'html' ? (
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
            ) : (
              <Globe className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm">HTML страница</span>
            <span className="text-xs text-muted-foreground mt-1">
              Автономная страница
            </span>
          </Button>

          <Button
            onClick={exportToJSON}
            disabled={isExporting === 'json'}
            variant="outline"
            className="h-auto flex-col py-4"
          >
            {isExporting === 'json' ? (
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
            ) : (
              <Code className="h-6 w-6 mb-2" />
            )}
            <span className="text-sm">JSON данные</span>
            <span className="text-xs text-muted-foreground mt-1">
              Структурированные данные
            </span>
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Что включено в экспорт:</strong>
          </p>
          <ul className="text-sm text-muted-foreground mt-2 list-disc pl-6">
            <li>Общий прогресс проекта и технический стек</li>
            <li>Детальный статус всех модулей и функций</li>
            <li>Критические задачи по приоритетам</li>
            <li>План разработки по фазам</li>
            <li>Структура проекта и архитектура</li>
            <li>Рекомендации по завершению</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
