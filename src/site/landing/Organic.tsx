import React from 'react';
import { Link } from 'react-router-dom';
import { CircleOff, Clock, Megaphone, MousePointer2, SlidersHorizontal, Sprout, Wallet } from 'lucide-react';
import { Arrow, CheckButton, IconCell, Lead, Note, SECTION, SectionHead, TableBox, TableCaption, TD_FIRST } from './parts';

/**
 * Органика против Директа. Макет сравнивал на запросе «купить диван в москве» с CPC «от 180 ₽» и
 * «18 400 показов» — цифры ничем не подтверждены, а цена клика у каждого клиента своя. Оставлено
 * сравнение устройства каналов без чисел и ссылка на то, где клиент посмотрит цену клика сам.
 * Гарантию ТОП-10 отрицаем здесь и в FAQ — одними словами.
 */

const ROWS: {
  icon: React.ElementType;
  param: string;
  direct: string;
  organic: string;
  hl?: boolean;
}[] = [
  {
    icon: MousePointer2,
    param: 'Цена перехода',
    direct: 'Платите за каждый клик по ставке аукциона',
    organic: 'Переход из выдачи бесплатный',
  },
  {
    icon: Wallet,
    param: 'Расход',
    direct: 'Бюджет списывается, пока идут показы',
    organic: 'Работы оплачиваются по смете, один раз',
  },
  {
    icon: CircleOff,
    param: 'Если перестать платить',
    direct: 'Показы объявлений прекращаются',
    organic: 'Исправленные страницы остаются на сайте и продолжают участвовать в выдаче',
  },
  {
    icon: Clock,
    param: 'Когда появляется результат',
    direct: 'После модерации и запуска кампании',
    organic: 'После переобхода страниц поисковиком — сроки задаёт робот',
    hl: true,
  },
  {
    icon: SlidersHorizontal,
    param: 'Чем управляем',
    direct: 'Ставкой и бюджетом',
    organic: 'Технической частью и содержимым страницы',
  },
];

export const Organic: React.FC = () => (
  <section id="organika" style={SECTION}>
    <SectionHead eyebrow="05 · Органика вместо Директа" title="Трафик, за который не надо платить за каждый клик" />
    <Lead>
      Цель оптимизации — органические показы: страница отвечает на запрос, поисковик ставит её в выдачу, и переход не стоит денег.
      Директ работает, пока вы платите; исправленные страницы остаются на сайте и после того, как счёт закрыт. Ниже — чем
      различаются сами каналы.
    </Lead>

    <TableCaption>Как устроены оба канала</TableCaption>
    <TableBox minWidth={720}>
      <thead>
        <tr>
          <th scope="col" style={{ width: '26%', paddingLeft: 24 }}>
            Параметр
          </th>
          <th scope="col">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Megaphone size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
              Яндекс Директ
            </span>
          </th>
          <th scope="col">
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Sprout size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
              Органика после правок
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.param} data-hl={r.hl ? '' : undefined}>
            <td style={{ ...TD_FIRST, fontWeight: r.hl ? 600 : undefined }}>
              <IconCell icon={r.icon}>{r.param}</IconCell>
            </td>
            <td style={{ fontSize: 15, fontWeight: r.hl ? 600 : undefined }}>{r.direct}</td>
            <td style={{ fontSize: 15, fontWeight: r.hl ? 600 : undefined }}>{r.organic}</td>
          </tr>
        ))}
      </tbody>
    </TableBox>
    <Note>
      Цена клика в Директе зависит от тематики, региона и конкурентов — для своих запросов её показывает инструмент «Прогноз
      бюджета» в интерфейсе Директа. Позиции тоже зависят не только от сайта: есть конкуренты, возраст домена и поведение
      пользователей. Поэтому мы не обещаем ТОП-10, а отвечаем за то, чем управляем, — найденные ошибки, которые видно по
      повторному аудиту. Позиции по вашим запросам можно снимать в кабинете.
    </Note>

    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        marginTop: 32,
      }}
    >
      <CheckButton>Проверить свой сайт</CheckButton>
      <Link to="/#faq" className="btn btn-secondary">
        Что мы гарантируем
        <Arrow />
      </Link>
    </div>
  </section>
);
