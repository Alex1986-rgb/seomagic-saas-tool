
# SeoMarket — SEO Analysis and Optimization Platform

[![GitHub license](https://img.shields.io/github/license/KyrlanAlanAlexandre/seomarket)](https://github.com/KyrlanAlanAlexandre/seomarket/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-v18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.3-blue)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)

## 🚀 Демо

**LIVE**: [https://seomarket.ru](https://seomarket.ru)

---

## 📋 О проекте

SeoMarket — это комплексная платформа для проведения SEO-аудита и оптимизации сайтов, построенная на современном стеке технологий React + TypeScript + Supabase. 

### 🎯 Цель проекта
Предоставить пользователям мощные инструменты для анализа и улучшения SEO-показателей их веб-сайтов с использованием искусственного интеллекта.

### ✨ Ключевые возможности

- 🔍 **Полный SEO-аудит** — Глубокий анализ сайта с выявлением проблем
- 🤖 **AI-оптимизация** — Автоматические рекомендации на базе ИИ
- 📊 **Отслеживание позиций** — Мониторинг позиций в поисковых системах
- 📝 **Контент-анализ** — Проверка качества и уникальности контента
- 🔗 **Анализ ссылок** — Аудит внутренних и внешних ссылок
- 📱 **Мобильная оптимизация** — Проверка адаптивности
- 📈 **Отчеты производительности** — Детальная аналитика
- 👥 **Административная панель** — Управление пользователями и контентом
- 🌐 **Массовое сканирование** — Анализ больших сайтов
- 💾 **Экспорт данных** — Выгрузка в PDF, Excel, Sitemap

---

## 🛠 Технологический стек

### Frontend
- **React 18.3** — Современная библиотека для UI
- **TypeScript** — Типизированный JavaScript
- **Vite** — Быстрый сборщик проектов
- **Tailwind CSS** — CSS-фреймворк
- **Shadcn/UI** — Компоненты пользовательского интерфейса
- **Framer Motion** — Анимации
- **React Router** — Маршрутизация
- **React Query** — Управление состоянием сервера

### Backend & Database
- **Supabase** — Backend-as-a-Service
- **PostgreSQL** — Реляционная база данных
- **Row Level Security (RLS)** — Безопасность на уровне строк
- **Edge Functions** — Серверные функции

### Дополнительные сервисы
- **OpenAI API** — Интеграция с ИИ
- **Cheerio** — Парсинг HTML
- **Puppeteer** — Веб-скрапинг
- **JSZip** — Работа с архивами

---

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- npm или yarn
- Аккаунт Supabase (рекомендуется)

### 1. Клонирование репозитория

```bash
git clone https://github.com/KyrlanAlanAlexandre/seomarket.git
cd seomarket
npm install
```

### 2. Настройка окружения

#### Вариант A: Использование Lovable (Рекомендуется)
Если вы работаете в Lovable, используйте встроенную интеграцию с Supabase:
1. Нажмите зеленую кнопку "Supabase" в правом верхнем углу
2. Подключите или создайте проект Supabase
3. Все переменные окружения настроятся автоматически

#### Вариант B: Локальная разработка
Создайте файл `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Запуск проекта

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр сборки
npm run preview
```

Приложение будет доступно по адресу `http://localhost:5173`

---

## 📁 Структура проекта

```
seomarket/
├── 📂 public/             # Статические файлы
│   ├── images/           # Изображения
│   └── video/            # Видео файлы
├── 📂 src/
│   ├── 📂 components/     # React компоненты
│   │   ├── ui/           # UI компоненты (shadcn)
│   │   ├── audit/        # Компоненты SEO аудита
│   │   ├── admin/        # Административная панель
│   │   └── client/       # Клиентская часть
│   ├── 📂 pages/         # Страницы приложения
│   ├── 📂 hooks/         # Пользовательские хуки
│   ├── 📂 services/      # API сервисы
│   ├── 📂 types/         # TypeScript типы
│   ├── 📂 contexts/      # React контексты
│   └── 📂 lib/           # Утилиты и конфигурации
├── 📂 supabase/          # Конфигурация Supabase
└── 📂 docs/              # Документация
```

### Ключевые компоненты

- **AuditResultsContainer** — Главный контейнер результатов аудита
- **ClientProfile** — Профиль пользователя
- **AdminPanel** — Административная панель
- **DeepCrawl** — Глубокое сканирование сайтов
- **PositionTracker** — Отслеживание позиций

---

## 🏗 Архитектура

### Клиентская часть
- **Компонентная архитектура** — Переиспользуемые React компоненты
- **Типизация** — Строгая типизация с TypeScript
- **Состояние** — React Query для серверного состояния
- **Маршрутизация** — React Router для навигации

### Серверная часть
- **Supabase** — Управление данными и аутентификацией
- **Edge Functions** — Серверная логика
- **RLS политики** — Безопасность данных
- **Realtime** — Обновления в реальном времени

### База данных
```sql
-- Основные таблицы
audits          -- Результаты аудитов
sites           -- Информация о сайтах
users           -- Профили пользователей
optimizations   -- Данные оптимизаций
subscriptions   -- Подписки пользователей
```

---

## 🔧 API и интеграции

### Основные API endpoints

| Endpoint | Описание |
|----------|----------|
| `/api/audit` | Проведение SEO аудита |
| `/api/optimize` | AI оптимизация |
| `/api/track` | Отслеживание позиций |
| `/api/crawl` | Сканирование сайта |

### Внешние интеграции

- **OpenAI API** — Генерация рекомендаций
- **Google Search Console** — Данные поиска
- **PageSpeed Insights** — Анализ скорости

---

## 📚 Документация по серверной части
- Архитектура и модули: [docs/ServerArchitecture.md](docs/ServerArchitecture.md)
- API Edge Functions: [docs/API.md](docs/API.md)

---

## 👨‍💼 Административная панель

Доступна по адресу `/admin` (требует прав администратора):

### Возможности
- 📊 **Аналитика** — Статистика использования
- 👥 **Управление пользователями** — CRUD операции
- 🛠 **Настройки сайта** — Конфигурация платформы
- 💰 **Управление платежами** — Обработка подписок
- 🖥 **Мониторинг системы** — Отслеживание производительности
- 🌐 **Анализатор сайтов** — Инструменты для анализа

### Структура админки
```
src/components/admin/
├── settings/          # Настройки платформы
├── monitoring/        # Мониторинг системы
├── payments/          # Управление платежами
└── system/            # Системные настройки
```

---

## 🚀 Деплой

### На Lovable (Рекомендуется)
1. Нажмите кнопку "Publish" в интерфейсе Lovable
2. Сайт автоматически развернется на поддомене Lovable
3. Настройте пользовательский домен в настройках проекта

### На Vercel
```bash
npm install -g vercel
vercel --prod
```

### На Netlify
```bash
npm run build
# Загрузите папку dist/ в Netlify
```

### На собственном хостинге
```bash
npm run build
# Скопируйте содержимое dist/ на ваш сервер
```

---

## 🔗 Настройка домена

### 1. DNS записи
```
Type: A
Name: @
Value: [IP вашего хостинга]

Type: CNAME  
Name: www
Value: yourdomain.com
```

### 2. SSL сертификат
- **Lovable**: SSL настраивается автоматически
- **Vercel/Netlify**: SSL включен по умолчанию
- **Собственный хостинг**: Используйте Let's Encrypt

### 3. Настройка роутинга
Убедитесь, что файл `public/_redirects` содержит:
```
/*    /index.html   200
```

---

## 🔧 Решение частых проблем

### Проблемы с аутентификацией
```
Error: "requested path is invalid"
```
**Решение**: Настройте Site URL и Redirect URLs в Supabase > Authentication > URL Configuration

### Проблемы с CORS
```
Error: Cross-Origin Request Blocked
```
**Решение**: Добавьте ваш домен в разрешенные origins в настройках Supabase

### Ошибки сборки
```
Module not found
```
**Решение**: Проверьте импорты и установите недостающие зависимости:
```bash
npm install
```

### Проблемы с производительностью
- Включите lazy loading для больших компонентов
- Используйте React.memo для оптимизации рендеринга
- Минифицируйте изображения

---

## 🧪 Тестирование

### Запуск тестов
```bash
# Модульные тесты
npm test

# E2E тесты
npm run test:e2e

# Покрытие кода
npm run test:coverage
```

### Структура тестов
```
src/
├── __tests__/         # Общие тесты
├── components/
│   └── __tests__/     # Тесты компонентов
└── services/
    └── __tests__/     # Тесты сервисов
```

---

## 📈 SEO настройки

### Мета-теги
- Динамическое формирование title и description
- Open Graph и Twitter Cards
- Structured Data (JSON-LD)

### Производительность
- Code splitting
- Lazy loading изображений
- Сжатие ресурсов
- CDN для статических файлов

### Доступность
- Семантическая разметка
- ARIA атрибуты
- Поддержка клавиатурной навигации
- Контрастность цветов

---

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Сделайте коммит (`git commit -m 'Add amazing feature'`)
4. Отправьте изменения (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Правила кодирования
- Используйте TypeScript для всех новых файлов
- Следуйте ESLint конфигурации
- Покрывайте новый код тестами
- Документируйте сложные функции

---

## 📝 Лицензия

Этот проект лицензирован под MIT License - см. [LICENSE](LICENSE) файл для деталей.

---

## 📞 Поддержка и контакты

- **Веб-сайт**: [seomarket.ru](https://seomarket.ru)
- **Email**: [info@seomarket.ru](mailto:info@seomarket.ru)
- **Документация**: [seomarket.ru/documentation](https://seomarket.ru/documentation)
- **GitHub Issues**: [Сообщить о проблеме](https://github.com/KyrlanAlanAlexandre/seomarket/issues)

---

## 🙏 Благодарности

- [React](https://reactjs.org/) за основу фреймворка
- [Supabase](https://supabase.com/) за backend-инфраструктуру  
- [Tailwind CSS](https://tailwindcss.com/) за стилизацию
- [Shadcn/UI](https://ui.shadcn.com/) за компоненты
- [Lovable](https://lovable.dev/) за платформу разработки

---

*Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}*
