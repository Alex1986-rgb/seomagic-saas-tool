import React from 'react';
import { ChartColumn, ListTree, ScanSearch, Send, Tags, Wrench } from 'lucide-react';
import { Blueprint, Lead, Note, SECTION, SectionHead, TableBox, TableCaption, TD_FIRST, TD_MUTED } from './parts';

/**
 * Методика. Клиент платит построчно и вправе знать порядок работ.
 *
 * Макет обещал частотность через XMLRiver/Wordstat, отправку в индекс (IndexNow, Вебмастер,
 * Search Console) со «сроками по нашим заказам» и нормы вроде «плотность 2–4 %». В коде этого нет:
 * XMLRiver подключён только для съёма позиций (_shared/serp.ts), отправки на переобход нет
 * (в кабинете — «не подключено»), а плотность ключей аудит не считает. Поэтому у каждого шага
 * стоит статус, а таблица норм — это пороги, с которыми реально работает issue-classifier.
 * Поменялся порог в классификаторе — поменяйте строку здесь.
 */

type Status = 'works' | 'planned';

const STEPS: {
  icon: React.ElementType;
  title: string;
  text: string;
  status: Status;
}[] = [
  {
    icon: ScanSearch,
    title: 'Обходим сайт',
    status: 'works',
    text: 'Краулер проходит до 300 страниц и снимает коды ответов, время ответа сервера, мета-теги, заголовки, canonical, alt у изображений и объём текста. Без замеров любая правка — догадка.',
  },
  {
    icon: ListTree,
    title: 'Проверяем структуру',
    status: 'works',
    text: 'Один H1 на страницу и подзаголовки H2 внутри текста. Нейросеть в кабинете предлагает структуру заголовков по содержимому страницы.',
  },
  {
    icon: Tags,
    title: 'Готовим мета-теги',
    status: 'works',
    text: 'Нейросеть предлагает title и description по тому, что есть на странице, с учётом длины, которую показывает выдача. Это черновик: на сайт сам по себе он не попадает.',
  },
  {
    icon: ChartColumn,
    title: 'Снимаем частотность',
    status: 'planned',
    text: 'Частотность запросов (Wordstat) пока не подключена. Сейчас сервис снимает позиции сайта в выдаче по вашим запросам — от них видно, помогли ли правки.',
  },
  {
    icon: Wrench,
    title: 'Закрываем технику',
    status: 'planned',
    text: 'Canonical, переадресации, alt у изображений, битые адреса. Аудит эти проблемы находит и считает по ставкам; внесение правок на сайт пока не подключено.',
  },
  {
    icon: Send,
    title: 'Отправляем в индекс',
    status: 'planned',
    text: 'Отправка изменённых адресов на переобход в Яндекс Вебмастер и Search Console пока не подключена. До её запуска страницы перечитываются при обычном обходе робота.',
  },
];

const STATUS_TAG: Record<Status, { cls: string; label: string }> = {
  works: { cls: 'tag tag-accent', label: 'Работает' },
  planned: { cls: 'tag tag-outline', label: 'В разработке' },
};

/** Пороги issue-classifier: supabase/functions/issue-classifier/index.ts. */
const NORMS: { param: string; norm: string; why: string; hl?: boolean }[] = [
  {
    param: 'Заголовков H1 на странице',
    norm: 'ровно 1',
    why: 'Без H1 или с двумя поисковик сам выбирает, о чём страница',
  },
  {
    param: 'Подзаголовки',
    norm: 'есть хотя бы один H2',
    why: 'Сплошной текст хуже читается и людьми, и поиском',
  },
  {
    param: 'Длина title',
    norm: '30–60 знаков',
    why: 'Короче 30 — не раскрывает тему, длиннее 60 — обрезается в выдаче',
    hl: true,
  },
  {
    param: 'Длина description',
    norm: '120–160 знаков',
    why: 'Без описания или с обрезанным поисковик сам подставляет кусок текста страницы',
  },
  {
    param: 'Объём текста',
    norm: 'от 150 слов',
    why: 'Меньше — «тонкий контент»: странице нечем ответить на запрос',
  },
  {
    param: 'Canonical',
    norm: 'указан и ведёт на саму страницу',
    why: 'Без canonical адреса с параметрами становятся дублями и делят вес',
  },
  {
    param: 'Запрет индексации',
    norm: 'нет noindex',
    why: 'Страница с noindex в meta robots не попадает в выдачу вовсе',
  },
  {
    param: 'Alt у изображений',
    norm: 'у каждого',
    why: 'Картинку без описания хуже находит поиск по изображениям и не читает экранный диктор',
  },
  {
    param: 'Цепочка переадресаций',
    norm: 'не больше одного перехода',
    why: 'Каждый лишний переход тратит время робота и посетителя',
  },
  {
    param: 'Загрузка HTML',
    norm: 'до 3 с',
    why: 'Медленная страница теряет посетителей до того, как они её увидят',
  },
  {
    param: 'Ответ сервера (TTFB)',
    norm: 'до 1 с',
    why: 'Долгий ответ сервера тормозит все страницы сайта сразу',
  },
  {
    param: 'Размер HTML',
    norm: 'до 500 КБ',
    why: 'Тяжёлая разметка дольше грузится и разбирается',
  },
];

export const Method: React.FC = () => (
  <section id="metodika" style={SECTION}>
    <SectionHead eyebrow="03 · Методика" title="Сначала замеры, потом правки" />
    <Lead>
      Порядок работ не произвольный. Пока неизвестно, что на странице сломано, писать title бессмысленно — получится догадка.
      Поэтому сначала обходим сайт и фиксируем замечания по каждому адресу, затем готовим правки по нормам ниже. Часть шагов уже
      работает в кабинете, часть — в разработке, и у каждого это написано.
    </Lead>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
        gap: 'clamp(20px,2.5vw,32px)',
        marginBottom: 44,
      }}
    >
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const tag = STATUS_TAG[s.status];
        return (
          <Blueprint key={s.title} style={{ padding: 'clamp(20px,2.4vw,28px)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-3)',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 15,
                    color: 'var(--color-accent-700)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={tag.cls}>{tag.label}</span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  flex: 'none',
                  border: '1px solid var(--color-divider)',
                  color: 'var(--color-accent)',
                }}
              >
                <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 20,
                letterSpacing: '.02em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                margin: 0,
                color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
              }}
            >
              {s.text}
            </p>
          </Blueprint>
        );
      })}
    </div>

    {/* Отправка в индекс. Клиент чаще всего считает, что правки не сработали, когда их ещё не увидел
        робот. Сроков не называем: отправки в сервисе пока нет, а «сроки по нашим заказам» из макета
        ничем не подтверждены. Что делает каждый способ — общеизвестно и проверяемо. */}
    <div id="indeksaciya" style={{ scrollMarginTop: 88, marginBottom: 44 }}>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(22px,2.6vw,30px)',
          letterSpacing: '.02em',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}
      >
        После правок страницы нужно переобойти
      </h3>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.65,
          maxWidth: '74ch',
          margin: '0 0 24px',
          color: 'color-mix(in srgb,var(--color-text) 80%,transparent)',
        }}
      >
        Исправленная страница начинает работать в поиске, когда робот её перечитал. До этого в выдаче остаётся старая версия с
        прежним title. Ускорить переобход можно несколькими способами — в сервисе они пока в разработке, поэтому сроков мы не
        обещаем.
      </p>
      <TableBox minWidth={720}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '26%', paddingLeft: 24 }}>
              Способ
            </th>
            <th scope="col">Что даёт</th>
            <th scope="col" style={{ textAlign: 'right' }}>
              В сервисе
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ['sitemap.xml', 'Карта сайта с датами изменения подсказывает роботу, какие адреса обновились'],
            ['IndexNow', 'Протокол, которым сайт сам сообщает Яндексу и Bing об изменённых адресах'],
            ['Яндекс Вебмастер', 'Очередь переобхода адресов с дневным лимитом'],
            ['Google Search Console', 'Запрос индексации отдельных адресов'],
          ].map(([name, what]) => (
            <tr key={name}>
              <td style={TD_FIRST}>{name}</td>
              <td style={TD_MUTED}>{what}</td>
              <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <span className="tag tag-outline">В разработке</span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableBox>
      <Note>
        Поисковики не гарантируют переобход по заявке: отправка ставит адрес в очередь, но не приказывает роботу. Проверить, что
        изменилось в выдаче, можно съёмом позиций в кабинете.
      </Note>
    </div>

    <TableCaption>Нормы, по которым аудит проверяет каждую страницу</TableCaption>
    <TableBox minWidth={800}>
      <thead>
        <tr>
          <th scope="col" style={{ width: '30%', paddingLeft: 24 }}>
            Параметр
          </th>
          <th scope="col">Норма</th>
          <th scope="col">Что происходит при нарушении</th>
        </tr>
      </thead>
      <tbody>
        {NORMS.map((n) => (
          <tr key={n.param} data-hl={n.hl ? '' : undefined}>
            <td style={{ ...TD_FIRST, fontWeight: n.hl ? 600 : undefined }}>{n.param}</td>
            <td
              style={{
                whiteSpace: 'nowrap',
                fontWeight: n.hl ? 600 : undefined,
              }}
            >
              {n.norm}
            </td>
            <td style={TD_MUTED}>{n.why}</td>
          </tr>
        ))}
      </tbody>
    </TableBox>
    <Note>
      Пороги — те, с которыми работает проверка аудита: в отчёте по каждой странице видно, какая норма нарушена и с каким
      значением. Плотность ключевых слов аудит не считает — переспам ключами мы не наращиваем и в нормы не записываем.
    </Note>
  </section>
);
