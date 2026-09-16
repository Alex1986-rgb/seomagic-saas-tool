import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { MUTED } from '@/site/SiteLayout';

/**
 * Типографика документов — один в один размеры макета «SeoMarket Документы.dc.html».
 * Вынесена сюда, чтобы восемь страниц не расходились по кеглям и отступам.
 */

/** Подписи макета: 72 % от цвета текста — не ниже порога контраста 68 %. */
export const SOFTER = 'color-mix(in srgb,var(--color-text) 72%,transparent)';

/** Дата редакции юридических документов. Одна на все, чтобы документы не расходились. */
export const EDITION_DATE = '16.09.2026';

export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: 'block',
      fontSize: 12,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--color-accent-700)',
      marginBottom: 12,
    }}
  >
    {children}
  </span>
);

export const DocTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1
    style={{
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(30px,4vw,46px)',
      lineHeight: 1.08,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      margin: '0 0 20px',
      overflowWrap: 'anywhere',
    }}
  >
    {children}
  </h1>
);

export const Lead: React.FC<{ children: React.ReactNode; last?: boolean }> = ({ children, last = true }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.65, maxWidth: '72ch', margin: last ? '0 0 32px' : '0 0 20px' }}>{children}</p>
);

export const H2: React.FC<{ children: React.ReactNode; size?: number; gap?: number; id?: string }> = ({
  children,
  size = 24,
  gap = 12,
  id,
}) => (
  <h2
    id={id}
    style={{
      fontFamily: 'var(--font-heading)',
      fontSize: size,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      margin: `0 0 ${gap}px`,
      scrollMarginTop: 88,
    }}
  >
    {children}
  </h2>
);

export const P: React.FC<{ children: React.ReactNode; mb?: number }> = ({ children, mb = 24 }) => (
  <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: '74ch', margin: `0 0 ${mb}px` }}>{children}</p>
);

/** Таблица с горизонтальной прокруткой: на телефоне широкая таблица не ломает страницу. */
export const TableBox: React.FC<{ minWidth: number; mb?: number; children: React.ReactNode; label?: string }> = ({
  minWidth,
  mb = 28,
  children,
  label,
}) => (
  <div
    style={{ overflowX: 'auto', border: '1px solid var(--color-divider)', marginBottom: mb }}
    role={label ? 'region' : undefined}
    aria-label={label}
    tabIndex={label ? 0 : undefined}
  >
    <table className="table" style={{ minWidth }}>
      {children}
    </table>
  </div>
);

export const Blueprint: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div className="blueprint" style={style}>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
    {children}
  </div>
);

/** Абзац с иконкой слева — «Чего мы не обещаем», «Технические меры». */
export const IconPara: React.FC<{ icon: LucideIcon; children: React.ReactNode; mb?: number }> = ({ icon: Icon, children, mb = 12 }) => (
  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start', maxWidth: '74ch', margin: `0 0 ${mb}px` }}>
    <Icon size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 2, color: 'var(--color-accent)' }} />
    <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>{children}</p>
  </div>
);

/** Пометка «действует после подключения оплаты» — чтобы порядок из оферты не читался как уже работающий. */
export const LaterTag: React.FC<{ children?: React.ReactNode }> = ({ children = 'после подключения оплаты' }) => (
  <span className="tag tag-outline" style={{ whiteSpace: 'nowrap', fontSize: 11 }}>
    {children}
  </span>
);

/**
 * Подпись в конце юридического документа. Документы написаны до регистрации юрлица и юристом
 * не проверены — это нужно сказать прямо, а не выдавать черновик за действующий договор.
 */
export const EditionNote: React.FC = () => (
  <p
    style={{
      fontSize: 13,
      lineHeight: 1.6,
      maxWidth: '78ch',
      margin: '32px 0 0',
      paddingTop: 16,
      borderTop: '1px solid var(--color-divider)',
      color: MUTED,
    }}
  >
    Редакция от {EDITION_DATE}. Редакция до регистрации юрлица, подлежит проверке юристом.
  </p>
);
