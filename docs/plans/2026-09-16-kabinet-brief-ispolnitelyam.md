# Бриф исполнителям: экраны кабинета SeoMarket 2.0

Репозиторий: `/Users/alexandr/projects/seomagic-saas-tool` (React 18 + Vite + TS + Supabase).
План: `docs/plans/2026-09-16-kabinet-po-maketu-v2.md`. Отвечать по-русски.

## Источник

- Макет: `design/seomarket-v2/SeoMarket v2.dc.html` — прототип (шаблон `<sc-if>/<sc-for>`,
  `{{ }}` — значения из класса `Component` внизу файла, строки 2787–3302). Прочитать свои строки
  ЦЕЛИКОМ, не по диагонали, и логику их состояний в скрипте.
- Правила продукта: `design/seomarket-v2/CLAUDE.md`. Главное: аудит бесплатный, оплата за фактический
  объём правок, подписок и пакетов нет, деньги в холде до одобрения превью, **метрики не выдумывать**,
  обещания лендинга/кабинета/админки не расходятся.
- Дизайн-система: `design/seomarket-v2/_ds/…/readme.md`.

## Что уже есть (НЕ править, только использовать)

- `src/cabinet/styles/industry.css` — токены и классы Industry под `html.ds-industry`
  (`.btn .btn-primary/.btn-secondary/.btn-ghost`, `.input`, `.field`, `.radio`, `.seg`, `.tag`, `.table`,
  `.blueprint` + углы, `data-nav/data-tab/data-row/data-detail/data-caret`, `data-chip="critical"`,
  `data-bar-critical`, `data-dot-critical`, `data-blink`, `data-hide-mobile`). Цвет критичного —
  `var(--color-critical)`; приглушённый текст — `var(--color-muted)` (≥ 68 %).
- `src/cabinet/ui.tsx` — примитивы: `Blueprint`, `Corners`, `Screen`, `PageHead`, `Kicker`, `Section`,
  `Stat`, `StatGrid`, `Cell`, `CellGrid`, `ScoreBar`, `Meter`, `Tag`, `SevChip`, `Seg`, `Tabs`, `Dialog`,
  `CopyButton`, `NotConnected`, `Empty`, `Loading`, `ErrorNote`, `StepBars`, `TableFrame`, `MUTED`, `MONO`.
- `src/cabinet/format.ts` — `num`, `rub`, `rubShort`, `dateShort`, `dateLong`, `monthShort`, `plural`, `hostOf`.
- `src/cabinet/project.tsx` — `useCabinetProject()`: `userId`, `loading`, `error`, `audits`, `projects`,
  `host`, `project` (`lastAudit`, `lastCompleted`, `auditsCount`), `projectAudits`, `setHost`, `reload`.
  Проект = хост из аудитов пользователя (таблицы проектов в базе нет).
- `src/cabinet/CabinetLayout.tsx` (сайдбар + шапка), `src/cabinet/CabinetRoutes.tsx` (маршруты `/app/*`).
- Supabase: `import { supabase } from '@/integrations/supabase/client'`, типы таблиц —
  `src/integrations/supabase/types.ts`. Вход: `useAuth()` из `@/contexts/AuthContext`.

## Как делать

1. Экран = файл `src/cabinet/screens/<Имя>.tsx` (сейчас заглушка — заменить целиком, default export).
   Вспомогательные файлы — только в своей папке `src/cabinet/<группа>/`.
2. **Вёрстка — как в макете**: те же блоки, порядок, отступы, размеры шрифтов, ширины, инлайн-стили на
   токенах. Tailwind-классы и shadcn в кабинете не использовать. Иконки — как в макете (инлайн SVG,
   перо 1.5) или `lucide-react` со `strokeWidth={1.5}`.
3. **Данные — только настоящие.** Брать из Supabase и существующих сервисов (`src/services`, `src/hooks`,
   `supabase/functions`). Никаких чисел из макета (mebel-grad.ru, 3 412 страниц, «+6 к баллу», «прогноз»,
   выручка). Если под блоком нет данных в базе — блок остаётся в раскладке, но показывает `NotConnected`
   (чего не хватает) или `Empty` (данные появятся после действия), без цифр-заглушек. Не выдумывать
   «прогнозы» и «прирост балла».
4. Состояния: загрузка (`Loading`), ошибка (`ErrorNote`), пусто, нет проекта (ссылка на `/app/audit`).
   Каждый запрос ограничивать `user_id` текущего пользователя (RLS отдаёт гостевые записи всем).
5. Ссылки между экранами — `Link`/`useNavigate` на `/app/...`. Параметры — в query (`?task=`, `?url=`).
6. Комментарии по-русски перед блоком, объясняют **зачем** (правило проекта): откуда выводится состояние,
   расчёты денег, решения безопасности, почему блок «не подключён».
7. Адаптив: макет сворачивает сайдбар ниже 860px; сетки — `repeat(auto-fit,minmax(…))`, таблицы —
   `TableFrame` с горизонтальной прокруткой. Не допускать горизонтальной прокрутки страницы на 375px.
8. **Не запускать** `tsc`, `vite build`, `npm run dev`, тесты целиком — машина на 8 ГБ, параллельно работают
   ещё четыре исполнителя; сборку и типы прогоняет координатор. Писать аккуратно по типам из `types.ts`.
   Можно `npx vitest run <свой файл теста>` для своих чистых функций.
9. Не трогать чужие файлы, `package.json`, миграции, edge-функции. Если без бэкенда экран не оживить —
   описать, что нужно (таблица/функция/поля), в отчёте, а не делать.

## Отчёт (≤ 350 слов)

Файлы; по каждому экрану — какие блоки на настоящих данных (откуда), какие `NotConnected` и почему;
чего не хватает в бэкенде; чего не хватило в общих примитивах; места, где макет противоречит правилам продукта.
