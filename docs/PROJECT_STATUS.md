# Статус проекта и план завершения

Документ отражает, что реально работает, что было исправлено в ветке
`fix/security-and-completion`, и что осталось доделать (с конкретными шагами).
Обновлён по итогам аудита кодовой базы.

## ✅ Что работает по-настоящему

- **SEO-аудит (ядро).** Edge-функции `audit-start` → `audit-processor` →
  `scoring-processor` → `audit-status` реально краулят сайт (`fetch` + `cheerio`),
  извлекают метатеги/заголовки/ссылки/изображения, считают взвешенный скоринг и
  пишут в БД. Фронтенд (`use-scan.ts`, `auditService`) читает настоящие данные.
- **Аутентификация.** Вход по email и через Google OAuth (Supabase), сессии,
  роли из таблицы `user_roles`.
- **RLS.** 29 таблиц с включённым RLS, роли через `has_role()` — грамотно.

## ✅ Исправлено в этой ветке

### Фаза 1 — безопасность (критично)
1. **Защита маршрутов.** Добавлен `ProtectedRoute`, `AdminRouteGuard` перестал
   быть заглушкой `TESTING MODE`. Закрыты `/dashboard`, `/profile`, `/settings`,
   `/reports`, `/audits`, `/audit-history`, `/optimizations`, `/client-profile`
   и весь `/admin/*` (последний — только для роли `admin`).
2. **Закрыты открытые edge-функции** (`supabase/functions/_shared/auth.ts`):
   - `cleanup-old-data` — теперь требует admin (раньше любой мог удалить все данные);
   - `cleanup-stuck-tasks`, `create-notification`, `pdf-report-generate` — только
     service-role (внутренние вызовы). Проверено, что вызывающие функции
     передают service-role ключ.
3. **Недостающие storage-бакеты** `reports` (приватный) и `sitemaps` (публичный)
   — миграция `20251124000000_add_reports_and_sitemaps_buckets.sql`. Без них
   падали `report-generate`, `sitemap-export`, `health-check`.

### Фаза 2 — недоделанный UI
4. `AuditsHistory`: реальные **удаление** (с подтверждением) и **скачивание**
   отчёта (клиентский JSON-экспорт из `audit_results`). Были заглушки-тосты.
5. Заглушки `/admin-dashboard`, `/client-dashboard` заменены редиректами; удалены
   мёртвые страницы (`Home`, дубль `PositionTracking`, `PdfReportsPage`).
6. Убран хардкод-фолбэк `example.com` в `audit-processor` (фабриковал фейковые
   метрики при ошибке fetch).
7. `send-estimate-email`: реальная отправка через Resend (была заглушка `console.log`).

Все изменения проверены: `tsc --noEmit` и `vite build` проходят.

## ⚠️ Осталось доделать (нужны ваши ключи/решения)

### 1. Отслеживание позиций — бэкенд подключён, нужен ключ
**Сделано:** создана edge-функция `position-check` (провайдер **DataForSEO**,
Google/Yandex organic, Live Advanced) с проверкой авторизации; клиент
(`serpProvider.ts` + `positionTracker.findRealPosition`) сначала пробует реальный
SERP, а при отсутствии ключа/ошибке **мягко откатывается** на локальную оценку —
ничего не ломается.
**Осталось (ваше):**
- Завести аккаунт DataForSEO и задать секреты `DATAFORSEO_LOGIN` /
  `DATAFORSEO_PASSWORD` в Supabase → функция сразу начнёт отдавать реальные позиции.
- ⚠️ Функция написана по документации DataForSEO, но **не прогонялась против живого
  API** (нет ключа) — проверьте на паре запросов после настройки.
- (Улучшение) хранить историю позиций в таблице вместо localStorage.
- Если предпочитаете **SerpApi/XMLRiver** — скажите, поменяю провайдера в
  `position-check` (интерфейс клиента не изменится).

### 2. AI-оптимизация — исправлен баг статуса, UI-переключение осталось
**Сделано:** починен реальный баг в `optimization-status` (читал `optimization_id`
только из query-строки, хотя `functions.invoke` шлёт body) — теперь боевой поток
(как в `OptimizationTest`) работает.
**Осталось (ваше решение):**
- Задать `LOVABLE_API_KEY` в секретах Supabase.
- Переключить основной UI (`useSeoOptimization` → `seoOptimizationController`,
  сейчас localStorage-мок) на `optimization-start` + `optimization-status`. Это
  **не простая замена вызова**: боевой `optimization-start` требует уже
  **завершённого аудита** (`task_id` из `audit_results`), т.е. UX надо перестроить
  на «сначала аудит → потом оптимизация этого аудита». Не стал переделывать вслепую
  без прогона на вашей базе, чтобы не сломать страницу.
- Продуктово решить: «оптимизация» = текстовые рекомендации (как сейчас в функции)
  или реальная генерация переписанного HTML + архив сайта (сейчас архив — заглушка).

### 3. Генерация PDF — частично
**Сделано:** обе `alert`-заглушки PDF-экспорта в `ProjectExporter` заменены на
реальный браузерный print-to-PDF (`window.print()`).
**Осталось:** `pdf-report-generate` формирует HTML, а не PDF; пайплайн скачивания
рассогласован (`report-download` читает таблицу `reports`, а `report-generate`
пишет в `pdf_reports`). Для полноценного PDF аудита: свести к одной таблице и
задействовать существующий `src/utils/pdf/generateAuditPdf` (jsPDF) — но нужно
сматчить структуру `audit_results.audit_data` с типом `AuditData` (лучше делать
с прогоном на реальных данных). Сейчас скачивание в `AuditsHistory` отдаёт
надёжный JSON.

## 🔧 Требуемые секреты (Supabase → Edge Functions → Secrets)
- `LOVABLE_API_KEY` — AI-шлюз (`optimization-processor`, `create-notification`).
- `RESEND_API_KEY` — почта (`send-email`, `send-estimate-email`).
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — платформа.
- `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD` — реальные позиции (`position-check`).

## 🧹 Рекомендуемая чистка (не блокирует)
- Удалить мёртвый faker-код: `services/audit/{generators,seoDetails,history,
  recommendations,optimizedSite,sitemap}.ts`, легаси `AuditService`,
  `auditDataService` (`@deprecated`), `optimizerApiService` — риск «протечки»
  моков в UI при рефакторинге.
- Консолидировать `AuditHistory` vs `AuditsHistory`, `Partners` vs `Partnership`.
- Почистить ~266 `console.log` в проде.
- Добавить тесты (сейчас их нет).
