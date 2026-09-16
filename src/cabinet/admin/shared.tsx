import React from 'react';
import { MUTED } from '../ui';

/** Разметка, общая для вкладок «Администрирования». Данные и загрузка — в ./data. */

/** Вводный абзац вкладки — 13.5px, приглушённый, как в макете. */
export const Lead: React.FC<{ children: React.ReactNode; width?: string }> = ({ children, width = '78ch' }) => (
  <p style={{ fontSize: 13.5, color: MUTED, margin: 0, maxWidth: width }}>{children}</p>
);

export const H2: React.FC<{ children: React.ReactNode; size?: number; mb?: string }> = ({
  children,
  size = 20,
  mb = 'var(--space-3)',
}) => <h2 style={{ fontSize: size, margin: `0 0 ${mb}` }}>{children}</h2>;

/**
 * Ячейка показателя, под которым в базе нет данных (выручка, средний чек, воркеры).
 * Сама ячейка остаётся в сетке — раскладка как в макете, — но вместо числа говорит, что не подключено.
 */
export const MissingCell: React.FC<{ label: React.ReactNode; note?: React.ReactNode }> = ({
  label,
  note = 'не подключено',
}) => (
  <div style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)', minWidth: 0 }}>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ fontSize: 13, color: MUTED, lineHeight: '36px' }}>{note}</div>
  </div>
);

/** Строка списка состояний: название, подпись и статус с квадратной точкой. Критичное мигает. */
export const StatusRow: React.FC<{
  title: React.ReactNode;
  sub?: React.ReactNode;
  status: React.ReactNode;
  critical?: boolean;
  last?: boolean;
}> = ({ title, sub, status, critical, last }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      borderBottom: last ? undefined : '1px solid var(--color-divider)',
      alignItems: 'center',
    }}
  >
    <span style={{ minWidth: 0 }}>
      <span style={{ display: 'block', fontSize: 14 }}>{title}</span>
      {sub && <span style={{ display: 'block', fontSize: 11.5, color: MUTED }}>{sub}</span>}
    </span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: MUTED, textAlign: 'right' }}>
      {critical ? (
        <span data-dot-critical data-blink style={{ width: 6, height: 6, flex: 'none' }} />
      ) : (
        <span style={{ width: 6, height: 6, flex: 'none', background: 'var(--color-accent)' }} />
      )}
      {status}
    </span>
  </div>
);

/** Полоса прогресса в ячейке таблицы — 6px, как в «Крупных обходах» макета. */
export const ProgressCell: React.FC<{ pct: number | null; caption: React.ReactNode }> = ({ pct, caption }) => {
  const v = pct === null ? 0 : Math.max(0, Math.min(100, pct));
  return (
    <>
      <span style={{ display: 'block', height: 6, background: 'color-mix(in srgb,var(--color-text) 12%,transparent)', position: 'relative' }}>
        <span style={{ position: 'absolute', inset: `0 ${100 - v}% 0 0`, background: 'var(--color-accent)' }} />
      </span>
      <span style={{ fontSize: 11, color: MUTED }}>{caption}</span>
    </>
  );
};

/** Строка «подпись — значение» с волосяной линией (параметры обхода, окружение). */
export const KeyValue: React.FC<{ label: React.ReactNode; value: React.ReactNode; last?: boolean }> = ({ label, value, last }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: '7px 0',
      borderBottom: last ? undefined : '1px solid var(--color-divider)',
      fontSize: 13,
    }}
  >
    <span>{label}</span>
    <span style={{ fontFamily: 'var(--font-heading)', textAlign: 'right' }}>{value}</span>
  </div>
);
