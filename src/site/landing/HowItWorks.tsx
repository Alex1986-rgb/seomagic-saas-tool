import React from 'react';
import { Calculator, FileText, MonitorCheck, PackageOpen, ScanSearch } from 'lucide-react';
import { Blueprint, IconCell, MUTED } from './parts';

/**
 * «Как это работает» — лист 01 макета.
 *
 * Шаги 04–05 в макете описаны как работающие (превью на поддомене, холд, установка по ключу,
 * откат 30 дней). В продукте их пока нет — кабинет честно показывает их карточками «не подключено»
 * (Order.tsx, Pay.tsx). Главная говорит то же самое: обещания сайта и кабинета не расходятся.
 */

const HEAD: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: 13,
  lineHeight: '24px',
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  fontWeight: 600,
};

const STEPS: {
  icon: React.ElementType;
  name: string;
  cost: string;
  text: string;
  hl?: boolean;
}[] = [
  {
    icon: ScanSearch,
    name: 'Быстрая проверка',
    cost: '0 ₽',
    text: 'Балл и три главные проблемы на этой странице, без регистрации: до 10 страниц сайта.',
  },
  {
    icon: FileText,
    name: 'Полный аудит',
    cost: '0 ₽',
    text: 'Обход до 300 страниц в кабинете: замечания по каждому адресу и выгрузка в CSV. Нужен аккаунт — отчёту нужно где-то жить.',
  },
  {
    icon: Calculator,
    name: 'Смета',
    cost: 'по факту',
    text: 'Отмечаете, что исправлять. Ставка × найденный объём, скидка растёт с количеством правок.',
  },
  {
    icon: MonitorCheck,
    name: 'Правки и превью',
    cost: 'по счёту',
    hl: true,
    text: 'Сейчас — рекомендации нейросети по title, description и заголовкам в кабинете. Превью исправленной копии и холд оплаты до вашего одобрения в разработке; до их запуска работаем по счёту.',
  },
  {
    icon: PackageOpen,
    name: 'Установка',
    cost: 'в разработке',
    text: 'Установка по нашему SSH-ключу или архивом изменённых файлов, копия сайта перед установкой и откат. Пока не подключено — способ согласуем при выставлении счёта.',
  },
];

export const HowItWorks: React.FC = () => (
  <section id="kak" style={{ padding: '24px 0 72px', scrollMarginTop: 88 }}>
    <Blueprint>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          borderBottom: '1px solid var(--color-divider)',
        }}
      >
        <h2
          style={{
            ...HEAD,
            flex: 1,
            minWidth: '16ch',
            margin: 0,
            fontFamily: 'inherit',
          }}
        >
          Как это работает — от проверки до результата
        </h2>
        <span
          style={{
            ...HEAD,
            borderLeft: '1px solid var(--color-divider)',
            whiteSpace: 'nowrap',
            color: 'color-mix(in srgb,var(--color-text) 70%,transparent)',
          }}
        >
          Лист 01
        </span>
      </header>
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th scope="col" style={{ width: 68, paddingLeft: 24 }}>
                №
              </th>
              <th scope="col" style={{ width: '22%' }}>
                Шаг
              </th>
              <th scope="col" style={{ width: '15%' }}>
                Стоимость
              </th>
              <th scope="col">Что получаете</th>
            </tr>
          </thead>
          <tbody>
            {STEPS.map((s, i) => (
              <tr key={s.name} data-hl={s.hl ? '' : undefined}>
                <td
                  style={{
                    paddingLeft: 24,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '.08em',
                    color: 'var(--color-accent-700)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td style={{ fontSize: 15, fontWeight: s.hl ? 600 : undefined }}>
                  <IconCell icon={s.icon}>{s.name}</IconCell>
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: s.cost.length > 8 ? 17 : 22,
                  }}
                >
                  {s.cost}
                </td>
                <td
                  style={{
                    fontSize: 15,
                    color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
                  }}
                >
                  {s.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        style={{
          margin: 0,
          padding: '12px 24px',
          borderTop: '1px solid var(--color-divider)',
          fontSize: 13,
          lineHeight: '24px',
          color: MUTED,
        }}
      >
        Повторный аудит бесплатный, как и первый: он покажет, какие замечания закрыты, и найдёт новые.
      </p>
    </Blueprint>
  </section>
);
