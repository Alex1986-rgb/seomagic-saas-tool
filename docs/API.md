# API Edge Functions

Ниже — спецификация ключевых функций и примеры вызова из фронтенда через supabase.functions.invoke.

## Правила вызова
- Никогда не используйте прямые HTTP вызовы к Supabase — используйте supabase.functions.invoke('name').
- В функциях всегда включайте CORS и обрабатывайте OPTIONS.
- Ответы — JSON; для файлов возвращайте Blob из Storage.

## Функции аудита
### audit-run
Запускает аудит сайта.
Request:
```json
{ "url": "https://example.com", "options": { "maxPages": 1000 } }
```
Response:
```json
{ "task_id": "task_123", "status": "queued" }
```

### audit-status
Статус задачи аудита.
Request:
```json
{ "task_id": "task_123" }
```
Response:
```json
{ "task_id": "task_123", "stage": "crawling", "progress": 42 }
```

## Функции отчетов
### report-generate
Генерация PDF/ZIP отчёта.
Request:
```json
{ "audit_id": "uuid", "format": "pdf" }
```
Response:
```json
{ "success": true, "storage_path": "reports/audit_uuid.pdf" }
```

### report-download
Выдача файла из Storage.
Request:
```json
{ "path": "reports/audit_uuid.pdf" }
```
Response:
- application/pdf Blob

## Функции оптимизации
### optimization-start
Старт оптимизации.
Request:
```json
{ "task_id": "task_123", "options": { "fixMeta": true, "fixHeadings": true, "fixImages": true, "generateSitemap": true, "optimizeContentSeo": true } }
```
Response:
```json
{ "success": true, "optimization_id": "opt_456", "status": "queued", "page_limit": 20 }
```
Пока оплата не подключена, запуск ограничен предохранителем (кроме роли admin):
не больше `OPTIMIZATION_DAILY_LIMIT` запусков за сутки на пользователя и не больше
`OPTIMIZATION_MAX_PAGES` страниц за запуск (`page_limit` в ответе; у администратора — `null`).
Превышение суточного лимита — ответ 429 с текстом в поле `error`. Тот же суточный
лимит считает и `optimization-content`.

### optimization-status
Статус оптимизации.
Request:
```json
{ "optimizationId": "opt_456" }
```
Response:
```json
{ "status": "running", "progress": 67 }
```

### optimization-content
Оптимизация контента по промпту (ИИ).
Request:
```json
{ "task_id": "task_123", "prompt": "Улучшить мета-теги и заголовки" }
```
Response:
```json
{ "success": true, "message": "Content updated" }
```

## Функции sitemap
### sitemap-download
Выгрузка sitemap.
Request:
```json
{ "task_id": "task_123", "format": "xml" }
```
Response:
```json
{ "success": true }
```

## Отправка по email
### share-send-email
Отправляет отчёт пользователю.
Request:
```json
{ "to": "user@example.com", "subject": "Ваш SEO отчёт", "audit_id": "uuid" }
```
Response:
```json
{ "queued": true, "id": "email_789" }
```

## Служебные функции
### cron-daily
Плановые задачи (очистка старых записей, агрегаты).

### logs-write
Запись структурированных логов.
Request:
```json
{ "level": "info", "event": "audit_completed", "payload": {"audit_id":"uuid"} }
```

## Примеры вызова из фронтенда
TypeScript:
```ts
import { supabase } from '@/integrations/supabase/client'

export async function runAudit(url: string) {
  const { data, error } = await supabase.functions.invoke('audit-run', {
    body: { url, options: { maxPages: 1000 } }
  })
  if (error) throw error
  return data
}

export async function optimizeContent(taskId: string, prompt: string) {
  const { data, error } = await supabase.functions.invoke('optimization-content', {
    body: { task_id: taskId, prompt }
  })
  if (error) throw error
  return data
}
```

## Секреты и конфигурация
Добавьте в Supabase Edge Function Secrets (Project Settings → Edge Functions → Secrets):

Языковая модель (оптимизация, `_shared/llm.ts`):
- `DEEPSEEK_API_KEY` и/или `ANTHROPIC_API_KEY` — ключ поставщика модели.
- `LLM_PROVIDER` (опц.) — `deepseek` или `anthropic`, если заданы оба ключа.
- `DEEPSEEK_MODEL`, `ANTHROPIC_MODEL` (опц.) — модель поставщика.
- `LLM_PRICE_PER_MTOKENS` (опц.) — цена за миллион токенов для учёта расхода.
- `LLM_CONCURRENCY` (опц.) — сколько страниц отдаётся модели одновременно.

Предохранитель расходов на модель (пока оплата не подключена; роль admin не ограничивается):
- `OPTIMIZATION_DAILY_LIMIT` (опц., по умолчанию 3) — сколько запусков оптимизации
  (`optimization-start` и `optimization-content`) один пользователь может сделать за
  последние сутки. Сметы (`status = 'estimated'`) не считаются. `0` — запуск закрыт
  всем, кроме администратора.
- `OPTIMIZATION_MAX_PAGES` (опц., по умолчанию 20) — сколько страниц обрабатывается за
  один запуск. Выше 40 не поднимается: это предел одного захода обработчика.

Почта (Resend):
- `RESEND_API_KEY` — ключ Resend.
- `RESEND_FROM` — **обязателен для отправки писем**: отправитель на домене, подтверждённом
  в Resend, например `SeoMarket <mail@ваш-домен>`. Без него функции писем отвечают понятной
  ошибкой настройки; тестовый `onboarding@resend.dev` доставляет только владельцу аккаунта Resend.
- `send-email` шлёт письмо только на почту вошедшего пользователя; на другие адреса — только
  роль admin.

Адрес сайта:
- `SITE_URL` (опц.) — адрес сайта для ссылок в письмах и в карте сайта `generate-sitemap`.
  Запасной — `https://alex1986-rgb.github.io/seomagic-saas-tool`.

Отслеживание позиций — см. `docs/POSITION_TRACKING.md` (`XMLRIVER_USER`, `XMLRIVER_KEY`,
`DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`, `SERPAPI_KEY`, `SERP_PROVIDER`).

## Обработка CORS в функциях
- Заголовки: Access-Control-Allow-Origin, Access-Control-Allow-Headers
- Обработчик OPTIONS должен возвращать 200 с CORS заголовками

## Ограничение частоты
- Внедряйте per-IP/per-user лимиты; при превышении — 429
- Уже действуют: суточный лимит запусков оптимизации (`OPTIMIZATION_DAILY_LIMIT`) и лимит
  писем со сметой в `send-estimate-email`.
