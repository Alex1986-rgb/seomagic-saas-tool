
# SeoMarket — SEO Analysis and Optimization Platform

[![GitHub license](https://img.shields.io/github/license/KyrlanAlanAlexandre/seomarket)](https://github.com/KyrlanAlanAlexandre/seomarket/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-v18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.3-blue)](https://tailwindcss.com/)

## Project Info

**LIVE**: https://seomarket.ru

---

## About the Project

SeoMarket — это комплексная платформа для проведения SEO-аудита и оптимизации сайтов (React + TypeScript + Supabase). Платформа включает в себя инструменты для анализа сайта, отслеживания позиций, автоматической оптимизации для увеличения позиций в поисковых системах.

### Ключевые фичи

- 🔍 Полный SEO-аудит сайта
- 🚀 Оптимизация на базе ИИ
- 📊 Отслеживание позиций
- 📝 Контент-анализ
- 🔗 Анализ ссылок
- 📱 Мобильная оптимизация
- 📈 Мониторинг производительности

---

## Быстрый старт

### 1. Клонирование и установка с GitHub

```bash
git clone https://github.com/KyrlanAlanAlexandre/seomarket.git
cd seomarket
npm install
```

### 2. Подключение Supabase

SeoMarket использует [Supabase](https://supabase.com/) для хранения данных, аутентификации и фоновых функций.  
**Рекомендуем подключаться через Lovable Integration (см. зеленую кнопку Supabase справа в редакторе Lovable).**

#### Минимальная настройка:
- Перейдите на [supabase.com](https://supabase.com/), создайте проект.
- Добавьте переменные окружения для доступа к Supabase (пример ниже).
- Используйте `project_ref` и `anon`-key, которые выдаются в панели управления Supabase.
- Рекомендуется активировать pg_net/pg_cron для edge-функций и отправки писем (см. [документацию Supabase](https://supabase.com/docs)).

**Пример секции с переменными (если вы не используете Lovable):**
```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=...
```
_Рекомендуется использовать нативную интеграцию Lovable для корректной работы edge функций и авторизации._

---

### 3. Настройка переменных окружения и стабильной работы

- Удостоверьтесь, что в `.env` файле, все переменные для Supabase прописаны корректно и доступны на всех средах.
- Не используйте секретные ключи в публичном репозитории.
- Регулярно обновляйте зависимости:  
  ```bash
  npm update
  ```
- При настройке рабочих Cron задач используйте pg_cron через Supabase.
- Для production используйте HTTPS и проверяйте правила структуры (RLS) в Supabase.

---

## Запуск проекта

```bash
npm run dev        # Локальный запуск
npm run build      # Сборка для production
```

---

## Настройка GitHub Actions (CI/CD)

Рекомендуется использовать GitHub Actions для автоматизации тестов и деплоя.  
Пример базового workflow файла:

```yaml
name: CI

on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm run build
```
(Добавьте отдельные секреты для production)

---

## Структура проекта

```
src/
├── components/        # React components
├── pages/             # Application pages
├── hooks/             # Custom React hooks
├── services/          # API services and business logic
├── types/             # TypeScript types
└── ...
```

---

## Интеграция с Lovable и Supabase

SeoMarket идеально работает на платформе Lovable.  
[Документация по интеграции с Supabase](https://docs.lovable.dev/integrations/supabase/)

---

## Документация

- [User Guide](https://seomarket.ru/documentation/user-guide)
- [Developer Guide](https://seomarket.ru/documentation/developer-guide)
- [API Documentation](https://seomarket.ru/documentation/api)

---

## Безопасность

Безопасность — приоритет. Для уязвимостей — см. [Security Policy](SECURITY.md).

---

## Лицензия

MIT License — см. [LICENSE](LICENSE)

---

## Контакты и поддержка

- Сайт: [seomarket.ru](https://seomarket.ru)
- Email: [info@seomarket.ru](mailto:info@seomarket.ru)
- Twitter: [@seomarket](https://twitter.com/seomarket)
