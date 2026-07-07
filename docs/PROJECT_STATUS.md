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

### 1. Отслеживание позиций — сейчас полностью имитация
`src/services/position/positionTracker.ts` генерирует позиции через `Math.random()`
+ хеш домена; SERP-запросов нет, история в localStorage.
**Что нужно:**
- Выбрать источник данных: **DataForSEO**, **SerpApi** или **XMLRiver** (платно).
- Создать edge-функцию `position-check` (браузерный скрапинг из клиента невозможен
  из-за CORS и капчи) — она обращается к провайдеру по ключу из `Deno.env`.
- Хранить историю в таблице (напр. `position_history`) вместо localStorage.
- Переключить `PositionMonitor`/`use-position-tracker` на реальную функцию.
- **Решение за вами:** провайдер + бюджет. Дайте ключ — подключу.

### 2. AI-оптимизация — основной UI ходит в мок
`services/api/seoOptimizationController.ts` пишет в localStorage и «завершает»
задачу по таймеру; реальные функции (`optimization-start/processor/...`,
Gemini через Lovable AI) вызываются только из тестовой страницы `OptimizationTest`.
Причём функции выдают **текстовые рекомендации**, а не переписанный сайт.
**Что нужно:**
- Задать `LOVABLE_API_KEY` в секретах Supabase.
- Переключить `useSeoOptimization` с `seoOptimizationController` на
  `optimization-start` + опрос `optimization-status`.
- Решить продуктово: «оптимизация» = рекомендации или реальная генерация
  переписанного HTML + сборка архива сайта (сейчас архив — заглушка-Blob).

### 3. Генерация PDF
`pdf-report-generate` формирует HTML, а не PDF; в `ProjectExporter` PDF-экспорт —
`alert(...)`. Пайплайн скачивания рассогласован: `report-download` читает таблицу
`reports`, а `report-generate` пишет в `pdf_reports`.
**Что нужно:** привести к одной таблице и добавить реальную генерацию PDF
(например, через сервис рендеринга или jsPDF на клиенте — jsPDF уже в зависимостях).

## 🔧 Требуемые секреты (Supabase → Edge Functions → Secrets)
- `LOVABLE_API_KEY` — AI-шлюз (`optimization-processor`, `create-notification`).
- `RESEND_API_KEY` — почта (`send-email`, `send-estimate-email`).
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` — платформа.
- (Фаза 3) ключ SERP-провайдера для позиций.

## 🧹 Рекомендуемая чистка (не блокирует)
- Удалить мёртвый faker-код: `services/audit/{generators,seoDetails,history,
  recommendations,optimizedSite,sitemap}.ts`, легаси `AuditService`,
  `auditDataService` (`@deprecated`), `optimizerApiService` — риск «протечки»
  моков в UI при рефакторинге.
- Консолидировать `AuditHistory` vs `AuditsHistory`, `Partners` vs `Partnership`.
- Почистить ~266 `console.log` в проде.
- Добавить тесты (сейчас их нет).
