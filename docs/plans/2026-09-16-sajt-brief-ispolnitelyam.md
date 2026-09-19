# Бриф исполнителям: публичный сайт SeoMarket по макету

Репозиторий `/Users/alexandr/projects/seomagic-saas-tool` (React 18 + Vite + TS + Supabase). Отвечать по-русски.
Задача Александра: «создай полноценный сайт из макета» — рабочий сайт сервиса, а не прототип.

## Источник

- Макеты: `design/seomarket-v2/` — `SeoMarket Сайт.dc.html`, `SeoMarket Блог.dc.html`,
  `SeoMarket Блог статья.dc.html`, `ArticleRail.dc.html`, `SeoMarket Отзывы.dc.html`, `SeoMarket Документы.dc.html`.
  Это прототипы движка Claude Design: `<sc-if>/<sc-for>`, `{{ }}` — значения из скрипта внизу файла,
  `<image-slot id=… src=…>` — фото, `<dc-import>` — вставка другого файла. Свои строки читать ЦЕЛИКОМ.
- Правила продукта: `design/seomarket-v2/CLAUDE.md` и `CLAUDE.md` репозитория. Главное:
  аудит бесплатный, оплата за фактический объём правок, **подписок и пакетов нет**, деньги в холде до одобрения превью,
  **метрики не выдумывать**, обещания сайта/кабинета/админки не расходятся, контакты — только из `src/config/site-contacts.ts`.

## Что уже есть (использовать, не переписывать)

- `src/site/SiteLayout.tsx` — `SiteLayout` (шапка, подвал, светлая тема Industry, прокрутка к якорю `/#id`),
  `SiteContainer` (1200px, поля `clamp(20px,5vw,72px)`), `SITE_GUTTER`, `MUTED`.
- `src/site/site.css` — состояния макетов под `.ds-site`: `data-cell`, `data-post`, `data-card`/`data-cardtitle`,
  `data-hl`, `data-q` (FAQ на `<details>` + `span[data-sign]`), `data-toc`, `data-tocitem`/`data-on`, `data-carousel`
  (карусель; **не** `data-rail` — он занят кабинетом), `data-railcard`/`data-railtitle`, `data-layout`, `data-aside`,
  `data-two`, `data-teaser`, `data-doc`. Нужен новый — добавить в СВОЙ css-файл рядом со своими компонентами.
- `src/design/industry.css` — токены и классы Industry (`.btn`, `.input`, `.field`, `.tag`, `.table`, `.blueprint`+углы,
  `.duotone`, `.seg`, `.card`). Шрифты — семейство Fira (Sans Condensed / Sans / Code), подключены в industry.css.
- `src/site/SitePhoto.tsx` — `<SitePhoto id="blog-2a" aspect="4/3" />`: фото из `src/site/photos.ts` (Unsplash,
  подпись автора обязательна), рамка-чертёж + дуотон. id = id `<image-slot>` в макете.
- `src/components/seo/PageSeo.tsx` — `<PageSeo title="…" description="…" />`. **Пререндер** (`scripts/prerender.cjs`)
  читает title и description ТОЛЬКО строковыми литералами прямо в файле страницы `src/pages/site/*.tsx`
  (не из переменных) — иначе страница не попадёт в пререндер и sitemap.
- Иконки — `lucide-react` со `strokeWidth={1.5}` (в макетах уже расставлены Lucide — берите те же имена).
- Кабинет `/app/*` уже сделан (`src/cabinet/`); вход — `/app/login`; аудит — `/app/audit?url=`.
- Supabase: `import { supabase } from '@/integrations/supabase/client'`, типы — `src/integrations/supabase/types.ts`.

## Как делать

1. Страница = файл в `src/pages/site/<Имя>.tsx` (сейчас заглушка — заменить целиком), корень — `<SiteLayout>`.
   Разделы и компоненты — в своей папке `src/site/<группа>/`. Маршруты уже прописаны в `src/App.tsx` —
   **App.tsx не трогать** (если нужен новый адрес — написать в отчёте).
2. **Вёрстка как в макете**: те же секции, порядок, размеры, отступы, инлайн-стили на токенах, иконки. Tailwind и
   shadcn не использовать. Ссылки между страницами — `Link` из react-router на адреса:
   `/`, `/#kak`, `/#ceny`, `/#uslugi`, `/#metodika`, `/#proverki`, `/#organika`, `/#faq`, `/#audit`, `/blog`,
   `/blog/<slug>`, `/otzyvy`, `/about`, `/contact`, `/oferta`, `/privacy`, `/cookie`, `/vozvrat`, `/bezopasnost`,
   `/sitemap`, `/app`, `/app/login`, `/app/register`, `/app/audit`.
3. **Честность — обязательна.** Всё, что в макете выдумано, на рабочий сайт не переносится:
   mebel-grad.ru и цифры «кейса», «418 заказов», «балл 87», телефоны/почты/ИНН-заглушки, «сроки по нашим заказам»,
   «+N к баллу», отзывы с именами. Числа — только проверяемые: из кода (например, число проверок классификатора —
   посчитать по коду аудита), из базы (ставки `pricing_rules`) или общеизвестные нормы (пороги Core Web Vitals).
   Нет подтверждения — перефразировать без числа. Текст должен совпадать с тем, что реально делает сервис
   (посмотреть `supabase/functions/audit-*`, `optimization-*`, `positions-check`, `src/cabinet/`).
4. Комментарии по-русски перед блоком, объясняют **зачем** (правило проекта).
5. Адаптив до 375px без горизонтальной прокрутки; `alt` у картинок; заголовки по порядку h1→h2→h3; один h1.
6. **Не запускать** `vite build`, `npm run dev`, полный `tsc` — параллельно работают ещё исполнители, машина 8 ГБ.
   Дев-сервер уже запущен координатором на http://localhost:8080 (без подпути) — **можно** смотреть свои страницы
   браузерными инструментами `mcp__Claude_Browser__*` (создай свою вкладку `tabs_create`, не трогай чужие),
   проверить ширину 375 (`resize_window` mobile → потом preset desktop). Можно `npx vitest run <свой тест>` и
   `npx eslint <свои файлы>`.
7. Не трогать чужие файлы, `package.json`, миграции, edge-функции (кроме явно разрешённого в задании).

## Отчёт (≤ 300 слов)

Файлы; что сверстано; что из макета сознательно не перенесено и почему; что проверено в браузере; что нужно от
координатора (адреса, данные, бэкенд).
