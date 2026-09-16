import React from 'react';

/**
 * Типографика страницы «Отзывы» — повторяющиеся в макете «SeoMarket Отзывы.dc.html» инлайн-стили
 * (надзаголовок, h2 секции, вводный абзац, разделитель). Держим в одном месте, чтобы секции
 * страницы не разъезжались по размерам, если макет поправят.
 */

/** Приглушённый текст 80 % — основной поясняющий текст макета (68 % — нижняя граница контраста). */
export const SOFT = 'color-mix(in srgb,var(--color-text) 80%,transparent)';
/** 78 % — текст ячеек таблиц макета. */
export const CELL = 'color-mix(in srgb,var(--color-text) 78%,transparent)';

export const Kicker: React.FC<{ children: React.ReactNode; mb?: number }> = ({ children, mb = 14 }) => (
  <span
    style={{
      display: 'block',
      fontSize: 13,
      lineHeight: '12px',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: 'var(--color-accent-700)',
      margin: `0 0 ${mb}px`,
    }}
  >
    {children}
  </span>
);

export const H2: React.FC<{ children: React.ReactNode; id?: string; style?: React.CSSProperties }> = ({ children, id, style }) => (
  <h2
    id={id}
    style={{
      fontFamily: 'var(--font-heading)',
      fontSize: 'clamp(26px,3.2vw,38px)',
      lineHeight: 1.1,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
      margin: '0 0 20px',
      ...style,
    }}
  >
    {children}
  </h2>
);

export const Lead: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{ fontSize: 15, lineHeight: 1.65, maxWidth: '74ch', margin: '0 0 32px', color: SOFT, ...style }}>{children}</p>
);

export const Rule: React.FC<{ mb?: number }> = ({ mb = 56 }) => (
  <hr style={{ height: 1, border: 0, margin: `0 0 ${mb}px`, background: 'var(--color-divider)' }} />
);
