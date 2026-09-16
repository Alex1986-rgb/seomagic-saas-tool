import React from 'react';
import { Link } from 'react-router-dom';
import { CHECKS, checkAdvice } from '@/cabinet/audit/labels';
import { DISCOUNT_TIERS, TEMPLATE_PRICE, TEMPLATE_THRESHOLD } from '@/cabinet/estimate/calc';
import { priceTypeOf } from '@/cabinet/estimate/works';
import type { PriceRule } from '@/cabinet/estimate/rates';
import { num, rub } from '@/cabinet/format';
import {
  Arrow,
  CheckButton,
  HEADING_NUM,
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
 * «Сколько стоит исправить сайт».
 *
 * Ставки — из pricing_rules (читается анонимно: политика «Everyone can view active pricing rules»),
 * тем же запросом, что смета кабинета (rates.ts). Своих цифр в разметке нет: админ поменял ставку —
 * поменялась и главная. Показываем только строки, которые аудит реально находит: в прайсе есть
 * ставки на типы, которых классификатор не пишет (дубли title, Schema.org) — продавать на главной
 * работу, которую сервис не обнаружит, было бы обещанием без покрытия.
 *
 * Скидки и шаблонная ставка — константы calc.ts, того же расчёта, что считает смету.
 */

const FOUND_TYPES = new Set(CHECKS.map((c) => priceTypeOf(c.type)));

/** Строки прайса, которые может заполнить аудит. Экспорт — для раздела «Чем мы занимаемся». */
export function auditableRules(rules: PriceRule[]): PriceRule[] {
  return rules.filter((r) => FOUND_TYPES.has(r.issueType));
}

const pct = (p: number) => `${Math.round(p * 100)} %`;

export const Prices: React.FC<{
  rules: PriceRule[];
  loading: boolean;
  error: string | null;
}> = ({ rules, loading, error }) => {
  const rows = auditableRules(rules);
  // Пороги по возрастанию: в calc.ts они лежат от большего к меньшему — так удобнее искать скидку.
  const tiers = DISCOUNT_TIERS.slice().sort((a, b) => a.min - b.min);

  return (
    <section id="ceny" style={SECTION}>
      <SectionHead eyebrow="02 · Цены" title="Сколько стоит исправить сайт" />
      <Lead>
        Оптимизация считается по единицам, а не пакетами. Ставка умножается на объём, найденный аудитом: если страниц без
        description нашлось 37, вы платите за 37, а не «до 500». Скидка зависит от общего числа правок в смете и применяется ко
        всей сумме.
      </Lead>

      <TableCaption>Ставки за единицу работы — из действующего прайса</TableCaption>
      <TableBox minWidth={760}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '32%', paddingLeft: 24 }}>
              Работа
            </th>
            <th scope="col">Единица</th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Ставка
            </th>
            <th scope="col">Что входит</th>
          </tr>
        </thead>
        <tbody>
          <tr data-hl="">
            <td style={{ ...TD_FIRST, fontWeight: 600 }}>Технический аудит</td>
            <td>проект</td>
            <td style={{ ...HEADING_NUM, textAlign: 'right' }}>0 ₽</td>
            <td style={TD_MUTED}>{CHECKS.length} проверок, отчёт и смета</td>
          </tr>
          {loading && (
            <tr>
              <td colSpan={4} style={{ ...TD_FIRST, ...TD_MUTED }}>
                Загружаем ставки…
              </td>
            </tr>
          )}
          {!loading && (error || rows.length === 0) && (
            <tr>
              <td colSpan={4} style={{ ...TD_FIRST, ...TD_MUTED }}>
                Ставки сейчас не загрузились — они появятся в смете после аудита.
              </td>
            </tr>
          )}
          {rows.map((r) => (
            <tr key={r.id}>
              <td style={TD_FIRST}>{r.name}</td>
              <td>{r.unit}</td>
              <td style={{ ...HEADING_NUM, textAlign: 'right' }}>{rub(r.rate)}</td>
              <td style={TD_MUTED}>{checkAdvice(r.issueType === 'missing_image_alt' ? 'missing_alt_text' : r.issueType)}</td>
            </tr>
          ))}
        </tbody>
      </TableBox>
      <Note>
        Единой цены «за SEO в месяц» у нас нет: объём работ известен только после обхода, а он у сайта на 50 страниц и у каталога
        на 30 000 отличается в сотни раз. Для замечаний, на которые в прайсе нет ставки, строка в смету не входит. Точную сумму по
        своему сайту вы увидите в смете после бесплатного аудита.
      </Note>

      <TableCaption style={{ margin: '44px 0 12px' }}>Скидка за объём правок в смете</TableCaption>
      <TableBox minWidth={420}>
        <thead>
          <tr>
            <th scope="col" style={{ paddingLeft: 24 }}>
              Правок в смете
            </th>
            <th scope="col" style={{ textAlign: 'right' }}>
              Скидка
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={TD_FIRST}>до {num(tiers[0].min)}</td>
            <td style={{ ...HEADING_NUM, textAlign: 'right' }}>—</td>
          </tr>
          {tiers.map((t, i) => (
            <tr key={t.min} data-hl={i === tiers.length - 2 ? '' : undefined}>
              <td style={TD_FIRST}>от {num(t.min)}</td>
              <td style={{ ...HEADING_NUM, textAlign: 'right' }}>{pct(t.pct)}</td>
            </tr>
          ))}
        </tbody>
      </TableBox>
      <Note>
        Скидка считается от числа правок в отмеченных строках, а не от суммы, и применяется ко всей смете. Свыше{' '}
        {num(TEMPLATE_THRESHOLD)} однотипных правок строка считается за шаблон: {rub(TEMPLATE_PRICE)} за правило на весь раздел,
        если это дешевле постраничной ставки.
      </Note>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2)',
          flexWrap: 'wrap',
          marginTop: 32,
        }}
      >
        <CheckButton>Узнать сумму по своему сайту</CheckButton>
        <Link to="/app/estimate" className="btn btn-secondary">
          Посмотреть смету в кабинете
          <Arrow />
        </Link>
      </div>
    </section>
  );
};
