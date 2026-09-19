import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MUTED } from '@/site/SiteLayout';
import './landing.css';

/**
 * Повторяющиеся куски главной из макета «SeoMarket Сайт.dc.html»: шапка раздела
 * («02 · Цены» + линия + h2), рамка-чертёж с углами, подпись над таблицей и сноска под ней.
 * Размеры и отступы — как в макете, чтобы разделы не расходились между собой.
 */

export const Corners: React.FC = () => (
  <>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
  </>
);

export const Blueprint: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => (
  <div className={`blueprint${className ? ` ${className}` : ''}`} style={style}>
    <Corners />
    {children}
  </div>
);

export const SectionHead: React.FC<{
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  titleMargin?: string;
}> = ({ eyebrow, title, aside, titleMargin = '0 0 20px' }) => (
  <>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 'var(--space-6)',
        flexWrap: 'wrap',
        marginBottom: 12,
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: 13,
          lineHeight: '12px',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--color-accent-700)',
        }}
      >
        {eyebrow}
      </span>
      {aside}
    </div>
    <hr
      style={{
        height: 1,
        border: 0,
        margin: '0 0 40px',
        background: 'var(--color-divider)',
      }}
    />
    <h2
      style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(28px,3.4vw,40px)',
        lineHeight: 1.1,
        letterSpacing: '.02em',
        textTransform: 'uppercase',
        margin: titleMargin,
      }}
    >
      {title}
    </h2>
  </>
);

export const Lead: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <p
    style={{
      fontSize: 15,
      lineHeight: 1.6,
      maxWidth: '70ch',
      margin: '0 0 32px',
      color: 'color-mix(in srgb,var(--color-text) 80%,transparent)',
      ...style,
    }}
  >
    {children}
  </p>
);

export const TableCaption: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <p
    style={{
      textAlign: 'center',
      fontSize: 15,
      margin: '0 0 12px',
      color: 'color-mix(in srgb,var(--color-text) 78%,transparent)',
      ...style,
    }}
  >
    {children}
  </p>
);

export const Note: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <p
    style={{
      fontSize: 13,
      lineHeight: 1.6,
      margin: '16px 0 0',
      maxWidth: '80ch',
      color: 'color-mix(in srgb,var(--color-text) 70%,transparent)',
      ...style,
    }}
  >
    {children}
  </p>
);

/** Таблица с горизонтальной прокруткой: на телефоне прокручивается сама таблица, а не страница. */
export const TableBox: React.FC<{
  minWidth: number;
  children: React.ReactNode;
}> = ({ minWidth, children }) => (
  <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }}>
    <table className="table" style={{ minWidth }}>
      {children}
    </table>
  </div>
);

/** Первая колонка строки с иконкой — как в таблицах макета. */
export const IconCell: React.FC<{
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ icon: Icon, children }) => (
  <span style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
    <Icon size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 3, color: 'var(--color-accent)' }} />
    <span>{children}</span>
  </span>
);

export const Arrow: React.FC = () => <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />;

export const SECTION: React.CSSProperties = {
  padding: '48px 0 72px',
  scrollMarginTop: 88,
};
export const TD_FIRST: React.CSSProperties = { paddingLeft: 24, fontSize: 15 };
export const TD_MUTED: React.CSSProperties = {
  fontSize: 14,
  color: 'color-mix(in srgb,var(--color-text) 75%,transparent)',
};
export const HEADING_NUM: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: 20,
  whiteSpace: 'nowrap',
};
export { MUTED };

/** Прокрутка к полю адреса в герое — кнопки «Проверить свой сайт» по всей странице. */
export function focusAuditField() {
  const el = document.getElementById('audit');
  if (!el) return;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  (el as HTMLInputElement).focus({ preventScroll: true });
}

export const CheckButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button type="button" className="btn btn-primary" onClick={focusAuditField}>
    {children}
    <Arrow />
  </button>
);
