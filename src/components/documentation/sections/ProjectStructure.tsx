
import React from 'react';

const ProjectStructure: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Структура проекта</h3>
      <p className="mb-4">
        Проект SeoMarket организован по современной архитектуре React-приложения с четким разделением ответственности:
      </p>
      
      <div className="bg-muted p-4 rounded-md overflow-auto mb-6">
        <pre className="text-sm">
          {`
📂 seomarket/
├── 📂 public/                    # Статические файлы
│   ├── 📂 images/               # Изображения и иконки
│   ├── 📂 video/                # Видео файлы
│   ├── robots.txt              # Правила для поисковых роботов
│   ├── manifest.json           # PWA манифест
│   └── _redirects              # Правила перенаправления
├── 📂 src/                      # Исходный код приложения
│   ├── 📂 components/           # React компоненты
│   │   ├── 📂 ui/              # Базовые UI компоненты (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── 📂 audit/           # Компоненты SEO аудита
│   │   │   ├── AuditMain.tsx             # Главный компонент аудита
│   │   │   ├── AuditResultsContainer.tsx # Контейнер результатов
│   │   │   ├── AuditOptimization.tsx     # Модуль расчёта сметы
│   │   │   ├── IssuesSummary.tsx         # Сводка по ошибкам
│   │   │   ├── 📂 results/              # Результаты аудита
│   │   │   ├── 📂 deep-crawl/           # Глубокое сканирование
│   │   │   ├── 📂 data-visualization/   # Визуализация данных
│   │   │   └── 📂 category/             # Категоризация проблем
│   │   ├── 📂 admin/           # Административная панель
│   │   │   ├── AdminSidebar.tsx         # Боковое меню админки
│   │   │   ├── AdminAnalytics.tsx       # Аналитика
│   │   │   ├── AdminUsers.tsx           # Управление пользователями
│   │   │   ├── 📂 settings/            # Настройки платформы
│   │   │   ├── 📂 monitoring/          # Мониторинг системы
│   │   │   ├── 📂 payments/            # Управление платежами
│   │   │   └── 📂 system/              # Системные настройки
│   │   ├── 📂 client/          # Клиентская часть
│   │   │   └── ClientProfile.tsx       # Профиль пользователя
│   │   ├── 📂 about/           # Компоненты страницы "О нас"
│   │   ├── 📂 contact/         # Контактная информация
│   │   ├── 📂 guides/          # Руководства и гайды
│   │   └── 📂 documentation/   # Компоненты документации
│   ├── 📂 pages/               # Компоненты страниц
│   │   ├── Index.tsx           # Главная страница
│   │   ├── Audit.tsx           # Страница аудита
│   │   ├── Dashboard.tsx       # Личный кабинет
│   │   ├── Profile.tsx         # Профиль пользователя
│   │   ├── Documentation.tsx   # Документация
│   │   ├── 📂 admin/          # Административные страницы
│   │   └── 📂 features/       # Описание функций
│   ├── 📂 hooks/              # Пользовательские хуки
│   │   ├── useAuditData.tsx   # Хук для данных аудита
│   │   ├── useAuth.tsx        # Хук аутентификации
│   │   └── useContentSettings.tsx
│   ├── 📂 services/           # API сервисы и бизнес-логика
│   │   ├── 📂 audit/         # Сервисы аудита
│   │   │   ├── 📂 optimization/      # Модули оптимизации
│   │   │   │   └── optimizationCalculator.ts  # Калькулятор сметы
│   │   │   ├── 📂 scanner/          # Модули сканирования
│   │   │   └── contentAnalyzer.ts   # Анализ контента
│   │   ├── auditApiService.ts       # API для аудита
│   │   └── seoApiService.ts         # SEO API сервисы
│   ├── 📂 types/              # TypeScript типы
│   │   ├── audit.ts           # Типы для аудита (AuditData, Issues, OptimizationItems)
│   │   ├── user.ts            # Типы пользователей
│   │   └── api.ts             # API типы
│   ├── 📂 contexts/           # React контексты
│   │   ├── AuthContext.tsx    # Контекст аутентификации
│   │   └── ThemeContext.tsx   # Контекст темы
│   ├── 📂 lib/                # Утилиты и конфигурации
│   │   ├── utils.ts           # Общие утилиты
│   │   └── supabase.ts        # Конфигурация Supabase
│   ├── 📂 integrations/       # Интеграции с внешними сервисами
│   │   └── 📂 supabase/      # Supabase клиент и типы
│   └── App.tsx                # Главный компонент приложения
├── 📂 supabase/               # Конфигурация Supabase
│   ├── config.toml           # Настройки проекта
│   ├── 📂 migrations/        # SQL миграции
│   └── 📂 functions/         # Edge функции
├── 📂 docs/                   # Документация проекта
├── package.json               # Зависимости и скрипты
├── tailwind.config.js         # Конфигурация Tailwind CSS
├── tsconfig.json             # Конфигурация TypeScript
├── vite.config.ts            # Конфигурация Vite
├── README.md                 # Основная документация
├── FULL_GUIDE.md             # Полное руководство
└── LICENSE                   # Лицензия проекта
          `}
        </pre>
      </div>

      <h4 className="text-lg font-medium mb-3">🏗 Архитектурные принципы</h4>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Компонентная архитектура</strong> — Переиспользуемые и изолированные компоненты</li>
        <li><strong>Разделение ответственности</strong> — Четкое разграничение UI, логики и данных</li>
        <li><strong>Типизация</strong> — Строгая типизация с TypeScript для предотвращения ошибок</li>
        <li><strong>Модульность</strong> — Логическая группировка функционала по папкам</li>
        <li><strong>Масштабируемость</strong> — Структура, позволяющая легко добавлять новый функционал</li>
      </ul>

      <h4 className="text-lg font-medium mb-3">🔧 Ключевые компоненты аудита</h4>
      <div className="bg-muted/50 p-4 rounded-md mb-6">
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>AuditResultsContainer</strong> — Главный контейнер для отображения результатов аудита, обработки состояний загрузки, ошибок и формирования сметы</li>
          <li><strong>AuditMain</strong> — Компонент сводки общего результата аудита с основными метриками и рекомендациями</li>
          <li><strong>AuditOptimization</strong> — Модуль расчёта стоимости оптимизации на основе найденных проблем</li>
          <li><strong>IssuesSummary</strong> — Компонент отображения количества и типов найденных ошибок (критичные, важные, возможности)</li>
          <li><strong>AuditIssuesAndEstimate</strong> — Объединенный компонент для показа детального списка проблем и итоговой сметы</li>
        </ul>
      </div>

      <h4 className="text-lg font-medium mb-3">📊 Структура данных аудита</h4>
      <div className="bg-muted p-3 rounded mb-4 text-sm">
        <pre>
{`// Основные типы для системы аудита
interface AuditData {
  score: number;              // Общий SEO балл (0-100)
  issues: Issues;             // Найденные проблемы
  recommendations: string[];   // Рекомендации по улучшению
  technicalDetails: object;   // Технические детали
}

interface Issues {
  critical: string[];         // Критические ошибки (требуют немедленного исправления)
  important: string[];        // Важные проблемы (сильно влияют на SEO)
  opportunities: string[];    // Возможности для улучшения
}

interface OptimizationItem {
  name: string;              // Название работы по оптимизации
  description: string;       // Детальное описание выполняемых работ
  count: number;            // Количество объектов для обработки
  price: number;            // Базовая цена за единицу работы
  totalPrice: number;       // Итоговая стоимость (price * count)
  priority: 'high' | 'medium' | 'low';  // Приоритет выполнения
}`}
        </pre>
      </div>

      <h4 className="text-lg font-medium mb-3">🛠 Сервисы и утилиты</h4>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>optimizationCalculator</strong> — Главный калькулятор для расчёта сметы оптимизации и агрегации всех найденных проблем</li>
        <li><strong>contentAnalyzer</strong> — Анализирует контент страниц на предмет SEO-проблем (дубликаты, тонкий контент, мета-теги)</li>
        <li><strong>siteAnalysis</strong> — Проводит структурный анализ сайта, проверяет битые ссылки, дубликаты URL</li>
        <li><strong>useAuditData</strong> — React хук для управления состоянием данных аудита, загрузки и обработки ошибок</li>
        <li><strong>auditApiService</strong> — Сервис для взаимодействия с API аудита, отправки запросов и получения результатов</li>
      </ul>

      <h4 className="text-lg font-medium mb-3">⚙️ Административная панель</h4>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
        <p className="text-sm mb-3"><strong>Доступ:</strong> <code>/admin</code> (требуются права администратора)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Управление контентом:</strong>
            <ul className="list-disc pl-4 mt-1">
              <li>Редактирование текстов страниц</li>
              <li>Настройка навигации</li>
              <li>Управление темами</li>
              <li>Конфигурация уведомлений</li>
            </ul>
          </div>
          <div>
            <strong>Системные функции:</strong>
            <ul className="list-disc pl-4 mt-1">
              <li>Мониторинг производительности</li>
              <li>Управление пользователями</li>
              <li>Аналитика и отчеты</li>
              <li>Настройки безопасности</li>
            </ul>
          </div>
        </div>
      </div>

      <h4 className="text-lg font-medium mb-3">🔄 Потоки данных</h4>
      <div className="space-y-3 mb-6">
        <div className="border-l-4 border-green-500 pl-4">
          <strong>Аудит сайта:</strong> Пользователь вводит URL → API анализирует сайт → Результаты сохраняются → Отображение в UI
        </div>
        <div className="border-l-4 border-blue-500 pl-4">
          <strong>Расчёт сметы:</strong> Данные аудита → optimizationCalculator → Формирование списка работ → Расчёт стоимости
        </div>
        <div className="border-l-4 border-purple-500 pl-4">
          <strong>Администрирование:</strong> Админ вносит изменения → Обновление в Supabase → Синхронизация с фронтендом
        </div>
      </div>

      <h4 className="text-lg font-medium mb-3">📱 Адаптивность и производительность</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Mobile-first подход</strong> — Дизайн оптимизирован сначала для мобильных устройств</li>
        <li><strong>Lazy loading</strong> — Ленивая загрузка компонентов и изображений</li>
        <li><strong>Code splitting</strong> — Разделение кода по маршрутам для уменьшения bundle size</li>
        <li><strong>Оптимизация изображений</strong> — Автоматическое сжатие и форматы WebP</li>
        <li><strong>Кэширование</strong> — Умное кэширование запросов с React Query</li>
      </ul>

      <div className="mt-6 text-sm text-muted-foreground">
        <strong>💡 Совет:</strong> При разработке новых функций следуйте установленной структуре папок и именованию компонентов. 
        Создавайте отдельные файлы для каждого компонента и группируйте связанный функционал в соответствующие папки.
      </div>
    </section>
  );
};

export default ProjectStructure;
