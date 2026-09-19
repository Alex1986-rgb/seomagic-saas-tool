import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Search, Smartphone, Type, Settings2 } from 'lucide-react';
import { CHECKS, type IssueCategory } from '@/cabinet/audit/labels';
import { priceTypeOf } from '@/cabinet/estimate/works';
import type { PriceRule } from '@/cabinet/estimate/rates';
import {
  Arrow,
  CheckButton,
  IconCell,
  Lead,
  Note,
  SECTION,
  SectionHead,
  TableBox,
  TableCaption,
  TD_FIRST,
  TD_MUTED,
} from './parts';

/**
 * «Что проверяем». Макет называл «214 проверок по шести направлениям» с весами 25/22/20/15/12/6 —
 * ни число, ни веса в коде не подтверждаются.
 *
 * Правда из кода:
 *  - число и категории — справочник CHECKS (зеркало supabase/functions/issue-classifier);
 *  - веса итогового балла — supabase/functions/scoring-processor (globalScore): SEO 35 %,
 *    техническое 25 %, контент 25 %, скорость 15 %; viewport в балле идёт в техническое;
 *  - «есть ставка» — считается по прайсу pricing_rules, а не вписано руками.
 * Поменялись веса в scoring-processor — поменяйте weight в ROWS.
 */

const ROWS: {
  cat: IssueCategory;
  icon: React.ElementType;
  name: string;
  weight: string;
  what: string;
}[] = [
  {
    cat: 'seo',
    icon: Search,
    name: 'Поисковая оптимизация',
    weight: '35 %',
    what: 'Title и description (нет, короткий, длинный), H1 (нет или несколько), canonical (нет или ведёт не туда), запрет индексации',
  },
  {
    cat: 'technical',
    icon: Settings2,
    name: 'Техническое состояние',
    weight: '25 %',
    what: 'Страницы с ответом 404 и 5xx, переадресации 301 и 302, цепочки переадресаций',
  },
  {
    cat: 'content',
    icon: Type,
    name: 'Контент',
    weight: '25 %',
    what: 'Объём текста, alt у изображений, внутренние и внешние ссылки, подзаголовки H2, доля текста в коде',
  },
  {
    cat: 'performance',
    icon: Gauge,
    name: 'Скорость загрузки',
    weight: '15 %',
    what: 'Время загрузки HTML, время ответа сервера, сжатие, размер HTML',
  },
  {
    cat: 'accessibility',
    icon: Smartphone,
    name: 'Мобильная версия',
    weight: 'в техническом',
    what: 'Meta viewport — без него телефон показывает страницу в масштабе компьютера',
  },
];

export const Checks: React.FC<{ rules: PriceRule[]; loading: boolean }> = ({ rules, loading }) => {
  const priced = new Set(rules.map((r) => r.issueType));
  const categories = ROWS.filter((r) => CHECKS.some((c) => c.category === r.cat)).length;

  return (
    <section id="proverki" style={SECTION}>
      <SectionHead
        eyebrow="04 · Что проверяем"
        title={`${CHECKS.length} проверок по ${categories === 5 ? 'пяти' : categories} направлениям`}
      />
      <Lead>
        Балл складывается из четырёх частей с разным весом: SEO и техническое состояние влияют на итог сильнее скорости. Страницы
        тоже весят по-разному — главная и разделы каталога важнее глубоких страниц. Ниже — состав проверок и то, на что в смете
        есть ставка.
      </Lead>

      <TableCaption>Категории проверок и вес в итоговом балле</TableCaption>
      <TableBox minWidth={820}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '22%', paddingLeft: 24 }}>
              Категория
            </th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Проверок
            </th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Вес
            </th>
            <th scope="col">Что входит</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>
              Ставка в смете
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => {
            const checks = CHECKS.filter((c) => c.category === r.cat);
            const withRate = checks.filter((c) => priced.has(priceTypeOf(c.type))).length;
            const tag = loading
              ? { cls: 'tag tag-neutral', label: '…' }
              : withRate === checks.length
                ? { cls: 'tag tag-accent', label: 'Есть' }
                : withRate > 0
                  ? { cls: 'tag tag-outline', label: 'Частично' }
                  : { cls: 'tag tag-neutral', label: 'Нет' };
            return (
              <tr key={r.cat} data-hl={i === 0 ? '' : undefined}>
                <td style={{ ...TD_FIRST, fontWeight: i === 0 ? 600 : undefined }}>
                  <IconCell icon={r.icon}>{r.name}</IconCell>
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontFamily: 'var(--font-heading)',
                    fontSize: 18,
                  }}
                >
                  {checks.length}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontFamily: 'var(--font-heading)',
                    fontSize: r.weight.length > 5 ? 14 : 18,
                    fontWeight: i === 0 ? 600 : undefined,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.weight}
                </td>
                <td style={TD_MUTED}>{r.what}</td>
                <td>
                  <span className={tag.cls}>{tag.label}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableBox>
      <Note>
        Core Web Vitals (LCP, INP, CLS) аудит пока не измеряет: скорость оценивается по времени ответа сервера и загрузки HTML.
        Вёрстку под телефон сервис не исправляет — это работа верстальщика; в отчёте такие пункты идут без ставки, с описанием,
        что поменять.
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
          Ответы на вопросы
          <Arrow />
        </Link>
      </div>
    </section>
  );
};
