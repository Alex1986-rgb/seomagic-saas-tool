# SeoMarket: позиции и оптимизация переведены на реальную работу

**Дата:** 14 сентября 2026
**Ветка:** `fix/inject-not-rebuild` → [PR #4](https://github.com/Alex1986-rgb/seomagic-saas-tool/pull/4)

## Что сделано

### Трекинг позиций — реальный
- Новая edge-функция `positions-check`: спрашивает выдачу у внешнего поставщика.
  Поддержаны **XMLRiver**, **DataForSEO**, **SerpApi**; выбор — переменной `SERP_PROVIDER`.
- Слой поставщиков `supabase/functions/_shared/serp.ts` + тесты на определение позиции домена
  (поддомены засчитываются, `example.com.evil.com` — нет).
- Таблицы `position_checks` / `position_results` с RLS; запись только под service-role.
- Нет ключей → отказ с объяснением. Частичный сбой помечается `partial`, непроверенные
  запросы показываются пользователю.
- Удалены имитации: `browserEmulator.ts`, `positionTrackingService.ts`, генератор позиций
  по хешу домена, «история» в localStorage.
- Из интерфейса убраны Mail.ru (поставщики его не отдают) и плашка про прокси
  (`hasActiveProxies` был захардкожен в `true`).

### Оптимизация — подключена к серверу
- `seoOptimizationController` ведёт настоящую цепочку:
  `audit-start → audit-status → optimization-start → optimization-status`.
- Скачивание копии и публикация на хостинг честно сообщают, что в интерфейсе их нет
  (раньше публикация возвращала выдуманный адрес и «успешно», собирая при этом пароль
  от хостинга). Форма хостинга заблокирована с предупреждением.

### Зависшие PR
- **PR #2** (безопасность) перестал мержиться — содержимое перенесено на актуальный `main`:
  `ProtectedRoute`, настоящий `AdminRouteGuard`, авторизация служебных edge-функций,
  бакеты `reports`/`sitemaps`, живые действия в `AuditsHistory`, vitest + 38 тестов.
- Из **PR #1** взяты только точечные фиксы безопасности (`safeHref`, ключи не в localStorage).
  Сам PR #1 не вливался: правит страницы, удалённые в PR #2, и тянет отдельную подсистему
  заказов и платежей — это продуктовое решение.
- Стек ошибки больше не уходит в HTTP-ответ edge-функций.

### Инфраструктура
- `scripts/` (аудит, клонирование, зеркалирование, публикация), `CLAUDE.md`, `.worktreeinclude`
  переехали в репозиторий — раньше жили только на одной машине.
- `docs/POSITION_TRACKING.md` — как настроить поставщика и что означают ограничения.

## Проверено

- `npx tsc --noEmit` — чисто;
- `npm test` — 44 теста зелёные;
- `npm run build` — собирается;
- dev-сервер: страница трекера рендерится без ошибок консоли, проверка реально уходит
  в edge-функцию.

## Что осталось

1. **Ключи поставщика выдачи** — без них трекинг позиций не работает (и честно об этом говорит).
   Дешевле прочих XMLRiver. Вписать в секреты Supabase.
2. **Деплой бэкенда:** `supabase db push` + `supabase functions deploy positions-check`.
3. **PR #1** — решить: закрыть или разбирать по частям (заказы/платежи/демо-режим).
4. **PR #2** — после мержа PR #4 закрыть как перенесённый.
5. **Сквозная проверка** трекинга на живых ключах — локально не проверялась (нет доступа к Supabase).
6. `.env` лежит в истории репозитория с ноября 2025 (файл добавила Lovable-генерация).
   Проверить, что там только публичные `VITE_*`-ключи.
7. 138 уязвимостей в зависимостях по данным dependabot (4 критические) — отдельная задача.

## Файлы

- `supabase/functions/_shared/serp.ts`, `supabase/functions/_shared/serp.test.ts`
- `supabase/functions/positions-check/index.ts`
- `supabase/migrations/20260914120000_position_tracking_real.sql`
- `src/services/position/positionTracker.ts`, `positionHistory.ts`
- `src/services/api/seoOptimizationController.ts`
- `src/components/seo-optimization/DeploymentPanel.tsx`
- `src/components/position-tracker/**` (чистка Mail.ru и прокси)
- `docs/POSITION_TRACKING.md`
