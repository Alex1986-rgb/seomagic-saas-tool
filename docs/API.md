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
{ "success": true, "optimizationId": "opt_456" }
```

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
Добавьте в Supabase Edge Function Secrets:
- OPENAI_API_KEY
- RESEND_API_KEY или SENDGRID_API_KEY
- PAGESPEED_API_KEY (опц.)
- PERPLEXITY_API_KEY (опц.)
- ORIGIN_ALLOWLIST

## Обработка CORS в функциях
- Заголовки: Access-Control-Allow-Origin, Access-Control-Allow-Headers
- Обработчик OPTIONS должен возвращать 200 с CORS заголовками

## Ограничение частоты
- Внедряйте per-IP/per-user лимиты; при превышении — 429
