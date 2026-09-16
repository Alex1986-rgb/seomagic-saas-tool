import React from 'react';
import { Copy, Link2, ScanSearch, Send, Tags, Unlink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SitePhoto } from '@/site/SitePhoto';
import { CHECKS } from '@/cabinet/audit/labels';
import { TEMPLATE_PRICE, TEMPLATE_THRESHOLD } from '@/cabinet/estimate/calc';
import type { PriceRule } from '@/cabinet/estimate/rates';
import { num, rub } from '@/cabinet/format';
import { IconCell, Note, SECTION, SectionHead, TableBox, TableCaption, TD_FIRST } from './parts';
import { auditableRules } from './Prices';

/**
 * «Чем мы занимаемся» — SEO-текст внизу страницы по той же схеме, которую мы продаём клиентам:
 * текст под основным содержимым и таблица вместо перечисления.
 *
 * Цены в таблице — «от» минимальной ставки из pricing_rules по типам замечаний задачи, а не
 * вписанные числа макета. Колонка «Срок» макета («до суток», «1–2 дня») заменена статусом:
 * внесения правок в продукте пока нет, и сроки работы платформы назвать нечем.
 */

type Status = 'works' | 'partly' | 'planned';

const TASKS: {
  icon: React.ElementType;
  task: string;
  what: string;
  types: string[];
  status: Status;
  statusText: string;
}[] = [
  {
    icon: ScanSearch,
    task: 'Проверить сайт на ошибки',
    what: `Технический аудит: ${CHECKS.length} проверок по каждому адресу, до 300 страниц, отчёт и смета`,
    types: [],
    status: 'works',
    statusText: 'Работает',
  },
  {
    icon: Tags,
    task: 'Настроить мета-теги',
    what: 'Title и description по содержимому страницы: нейросеть готовит черновик, вы его видите до правки',
    types: ['missing_title', 'short_title', 'long_title', 'missing_description', 'short_description', 'long_description'],
    status: 'partly',
    statusText: 'Черновики — работают',
  },
  {
    icon: Copy,
    task: 'Убрать дубли страниц',
    what: 'Canonical на адресах с параметрами и там, где он ведёт не на саму страницу',
    types: ['missing_canonical', 'wrong_canonical'],
    status: 'planned',
    statusText: 'Находим, правка — в разработке',
  },
  {
    icon: Unlink,
    task: 'Починить битые адреса',
    what: 'Страницы с ответом 404 и 5xx, лишние переадресации и их цепочки',
    types: ['broken_link', 'server_error', 'redirect_301', 'redirect_302', 'redirect_chain'],
    status: 'planned',
    statusText: 'Находим, правка — в разработке',
  },
  {
    icon: Link2,
    task: 'Связать разделы',
    what: 'Страницы, на которые не ведёт ни одна внутренняя ссылка',
    types: ['no_internal_links'],
    status: 'planned',
    statusText: 'Находим, правка — в разработке',
  },
  {
    icon: Zap,
    task: 'Ускорить загрузку',
    what: 'Сжатие ответа, размер HTML, время ответа сервера',
    types: ['slow_page', 'high_ttfb', 'no_compression', 'large_html'],
    status: 'planned',
    statusText: 'Находим, правка — в разработке',
  },
  {
    icon: Send,
    task: 'Отправить сайт в индекс',
    what: 'Карта сайта, IndexNow, очередь переобхода в Вебмастере и Search Console',
    types: [],
    status: 'planned',
    statusText: 'В разработке',
  },
];

const TAG_CLS: Record<Status, string> = {
  works: 'tag tag-accent',
  partly: 'tag tag-outline',
  planned: 'tag tag-neutral',
};

const P: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.65,
  margin: '0 0 16px',
  color: 'color-mix(in srgb,var(--color-text) 80%,transparent)',
};

export const Services: React.FC<{ rules: PriceRule[]; loading: boolean }> = ({ rules, loading }) => {
  const priced = auditableRules(rules);

  /** «от 20 ₽ / страница» — минимальная ставка среди типов задачи; единица — у этой же ставки. */
  const priceFor = (types: string[], index: number): string => {
    if (index === 0) return '0 ₽';
    if (types.length === 0) return '—';
    if (loading) return '…';
    const matches = priced.filter((r) => types.includes(r.issueType === 'missing_image_alt' ? 'missing_alt_text' : r.issueType));
    if (matches.length === 0) return 'в смете';
    const min = matches.reduce((a, b) => (b.rate < a.rate ? b : a));
    const same = matches.every((m) => m.rate === min.rate);
    return `${same ? '' : 'от '}${rub(min.rate)} / ${min.unit}`;
  };

  return (
    <section id="uslugi" style={SECTION}>
      <SectionHead eyebrow="08 · Услуги" title="Чем мы занимаемся" />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))',
          gap: 'clamp(24px,3vw,48px)',
          marginBottom: 44,
        }}
      >
        <div>
          <p style={P}>
            Технический аудит сайта — основа всего остального. Краулер обходит страницы, проверяет коды ответов, мета-теги,
            заголовки, canonical, alt у изображений, объём текста и время ответа сервера и складывает результат в отчёт с перечнем
            адресов. Аудит бесплатный и не требует ни договора, ни предоплаты: пока не известен объём, говорить о цене нечестно.
          </p>
          <p style={P}>
            Дальше идёт исправление найденных ошибок. Каждая правка считается по единице — за страницу, адрес или изображение, —
            поэтому смета совпадает с найденным объёмом. На крупном каталоге свыше {num(TEMPLATE_THRESHOLD)} однотипных правок
            считаются за шаблонное правило, {rub(TEMPLATE_PRICE)} на весь раздел, иначе счёт вырос бы до неприличного.
          </p>
          <p style={{ ...P, margin: 0 }}>
            Абонентской платы за продвижение у нас нет — только смета с конечной суммой. Правки на сайт сервис пока не вносит:
            превью исправленной копии, холд оплаты и установка в разработке, до их запуска работаем по счёту.
          </p>
        </div>
        <div>
          {/* Фото добавлено к макету (в нём на главной снимков нет): штангенциркуль — «измеряем, а не
              угадываем», ровно о чём текст рядом. Рамка ограничена по ширине, чтобы не спорить с таблицей. */}
          <div data-services-photo style={{ marginBottom: 24 }}>
            <SitePhoto id="blog-9a" aspect="16/9" alt="Цифровой штангенциркуль на металлической детали" />
          </div>
          <p style={P}>
            Мета-теги и заголовки: нейросеть предлагает title, description и структуру заголовков по содержимому каждой страницы.
            Это черновик — вы видите его в кабинете, и сам по себе он на сайт не попадает.
          </p>
          <p style={{ ...P, margin: 0 }}>
            Позиции: сервис снимает позиции сайта в выдаче по вашим запросам, чтобы результат правок можно было проверить, а не
            принять на веру. Частотность запросов и отправка страниц на переобход пока в разработке.
          </p>
        </div>
      </div>

      <TableCaption>С чем к нам приходят и что мы с этим делаем</TableCaption>
      <TableBox minWidth={840}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '26%', paddingLeft: 24 }}>
              Задача
            </th>
            <th scope="col">Что делаем</th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Цена
            </th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Сейчас
            </th>
          </tr>
        </thead>
        <tbody>
          {TASKS.map((t, i) => (
            <tr key={t.task} data-hl={i === 0 ? '' : undefined}>
              <td style={{ ...TD_FIRST, fontWeight: i === 0 ? 600 : undefined }}>
                <IconCell icon={t.icon}>{t.task}</IconCell>
              </td>
              <td
                style={{
                  fontSize: 14,
                  color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
                }}
              >
                {t.what}
              </td>
              <td
                style={{
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  fontWeight: i === 0 ? 600 : undefined,
                }}
              >
                {priceFor(t.types, i)}
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className={TAG_CLS[t.status]} style={{ whiteSpace: 'nowrap' }}>
                  {t.statusText}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableBox>
      <Note>
        Цены — ставки из действующего прайса, итог по вашему сайту считается в смете после аудита. Полный прайс с единицами — в{' '}
        <Link to="/#ceny">разделе цен</Link>, порядок работ — в <Link to="/#metodika">методике</Link>.
      </Note>
    </section>
  );
};
