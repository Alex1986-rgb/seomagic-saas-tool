# Серверная архитектура и модули (Supabase)

Этот документ описывает серверную часть проекта SeoMarket на базе Supabase Edge Functions, БД PostgreSQL и Storage.

## Обзор
- Frontend: React + Vite + Tailwind + TypeScript
- Backend: Supabase (БД + RLS, Edge Functions, Realtime, Storage)
- Внешние сервисы: OpenAI (ИИ), Resend/SendGrid (почта), PageSpeed (опц.), Perplexity (опц.)

```mermaid
flowchart LR
  A[Frontend (React)] -- supabase-js --> B[Supabase]
  B --> C[(PostgreSQL)]
  B --> D[Storage]
  B --> E{Edge Functions}
  E -->|AI| F[(OpenAI)]
  E -->|Email| G[(Resend/SendGrid)]
  E -->|Crawl/PSI| H[(PageSpeed)]
  E -->|Search| I[(Perplexity)]
```

## Модули серверной части (Edge Functions)
1) audit-run / audit-status — запуск и мониторинг аудита
2) report-generate / report-download — генерация и выдача PDF/ZIP
3) optimization-start / optimization-status / optimization-content — оптимизация сайта и контента
4) sitemap-download — выгрузка sitemap (xml/html/zip)
5) share-send-email — отправка отчётов по email
6) cron-daily — плановые задания (очистка, агрегация)
7) logs-write — централизованный логгер/трассировка
8) rate-limit-middleware — огр. запросов по ключу/пользователю (встроено в функции)

Файловая структура (каждая функция в своей папке):
- supabase/functions/audit-run/index.ts
- supabase/functions/audit-status/index.ts
- supabase/functions/report-generate/index.ts
- supabase/functions/report-download/index.ts
- supabase/functions/optimization-start/index.ts
- supabase/functions/optimization-status/index.ts
- supabase/functions/optimization-content/index.ts
- supabase/functions/sitemap-download/index.ts
- supabase/functions/share-send-email/index.ts
- supabase/functions/cron-daily/index.ts
- supabase/functions/logs-write/index.ts

Примечания:
- В каждой папке должен быть index.ts. Внутри функции избегайте вложенных подпапок.
- Всегда включайте CORS заголовки и обрабатывайте OPTIONS запросы.
- Вызовы из фронтенда делайте только через supabase.functions.invoke.

## Необходимые секреты (Supabase > Edge Functions > Secrets)
- OPENAI_API_KEY — для ИИ оптимизаций/рекомендаций
- RESEND_API_KEY или SENDGRID_API_KEY — для отправки email
- PAGESPEED_API_KEY (опционально) — метрики производительности
- PERPLEXITY_API_KEY (опционально) — онлайновый поиск/обогащение
- ORIGIN_ALLOWLIST — список доменов, для CORS

## База данных (PostgreSQL)
Рекомендуемые таблицы:
- audits (id, url, status, summary, created_at, user_id)
- audit_tasks (id, audit_id, task_id, stage, progress, meta, created_at)
- optimization_jobs (id, audit_id, task_id, status, progress, result, created_at)
- reports (id, audit_id, type, storage_path, created_at)
- email_queue (id, to, subject, payload, status, created_at, sent_at)

Политики безопасности (RLS):
- Включить RLS на всех таблицах.
- Пользователь видит только свои записи (auth.uid() = user_id).
- Для служебных таблиц — ограниченные сервис-политики.

Индексы:
- audits(url), audit_tasks(task_id), optimization_jobs(task_id)
- created_at DESC индексы для списков

## Storage
Бакеты:
- reports (public: false) — PDF/архивы отчётов
- exports (public: false) — JSON/CSV выгрузки

Политики:
- Только владелец (auth.uid()) может читать/качать свои файлы; публичность — по необходимости.

## Логирование и метрики
- logs-write функция пишет в таблицу logs (уровень, событие, payload)
- ключевые точки: старт/финиш задач, ошибки, время выполнения

## Ограничение частоты (Rate limiting)
- По IP/пользователю/URL, хранение счётчиков в Redis-замене (таблица) или в памяти функции c JWT подписью
- 429 при превышении

## Безопасность
- Не исполнять raw SQL из Edge Functions — используйте методы клиента Supabase
- Верификация JWT по умолчанию; функции, доступные публично, помечать verify_jwt=false в supabase/config.toml
- Валидируйте входящие payload (zod)

## Планы расширения
- Вебхуки провайдеров (Resend events)
- Трекинг позиций (интеграция стороннего API)
- Очереди задач (внешний брокер или упрощённо через таблицы)
