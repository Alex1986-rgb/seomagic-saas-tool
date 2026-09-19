import React from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '@/components/seo/PageSeo';
import { useCabinetTheme } from '../CabinetLayout';
import { MONO, MUTED } from '../ui';

/**
 * Мелкая разметка экранов аккаунта (настройки, вход, сброс, добавление сайта), повторяющаяся
 * в макете строками design/seomarket-v2/SeoMarket v2.dc.html 1588–1850, 2480–2588.
 * Держим здесь, а не в общем ui.tsx: общий файл не наш и правится только координатором.
 */

/** Приглушённый 78 % — поясняющий текст внутри акцентных плашек и карточек входа. */
export const SOFT = 'color-mix(in srgb,var(--color-text) 78%,transparent)';

const WRAP_NONE: React.CSSProperties = { overflowX: 'auto', whiteSpace: 'nowrap' };
const WRAP_ANY: React.CSSProperties = { wordBreak: 'break-all' };

/** Моноширинный блок «для копирования» (User-Agent, строки конфигурации). */
export const CodeBox: React.FC<{ children: React.ReactNode; nowrap?: boolean }> = ({ children, nowrap }) => (
  <div
    style={{
      border: '1px solid var(--color-divider)',
      background: 'color-mix(in srgb,var(--color-text) 4%,transparent)',
      padding: 'var(--space-3)',
      fontFamily: MONO,
      fontSize: 12,
      lineHeight: 1.6,
      ...(nowrap ? WRAP_NONE : WRAP_ANY),
    }}
  >
    {children}
  </div>
);

/** Строка раздела: название + пояснение слева, статус или кнопка справа. */
export const Row: React.FC<{
  title: React.ReactNode;
  sub?: React.ReactNode;
  right?: React.ReactNode;
  last?: boolean;
  mono?: boolean;
}> = ({ title, sub, right, last, mono }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      ...(last ? {} : { paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-divider)' }),
    }}
  >
    <span style={{ minWidth: 0 }}>
      <span style={{ display: 'block', fontSize: 14, wordBreak: 'break-word' }}>{title}</span>
      {sub && (
        <span style={{ fontSize: 12, color: MUTED, wordBreak: 'break-word', ...(mono ? { fontFamily: MONO } : {}) }}>{sub}</span>
      )}
    </span>
    {right}
  </div>
);

/** Метка «Не подключено» справа в строке — нейтральная: это не ошибка клиента. */
export const OffTag: React.FC<{ children?: React.ReactNode }> = ({ children = 'Не подключено' }) => (
  <span className="tag tag-neutral" style={{ whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

/** Плашка с акцентной рамкой и квадратом 8px — подсказка или подтверждённый факт. */
export const AccentNote: React.FC<{ children: React.ReactNode; action?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  action,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      border: '1px solid var(--color-accent)',
      padding: 'var(--space-3)',
      ...style,
    }}
  >
    <span style={{ width: 8, height: 8, background: 'var(--color-accent)', flex: 'none', marginTop: 5 }} />
    <span style={{ fontSize: 12.5, lineHeight: 1.55, color: SOFT, flex: 1, minWidth: 200 }}>{children}</span>
    {action}
  </div>
);

/** Сообщение об ошибке формы под полями — критичный цвет только на рамке, текст обычный. */
export const FormError: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div role="alert" style={{ border: '1px solid var(--color-critical)', padding: 'var(--space-2) var(--space-3)', fontSize: 13 }}>
    {children}
  </div>
);

/** Логотип SEOMARKET 2.0 экранов без оболочки. */
export const Logo: React.FC<{ to?: string }> = ({ to }) => {
  const inner = (
    <>
      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 22, letterSpacing: '.04em' }}>SEOMARKET</span>
      <span style={{ fontSize: 10, letterSpacing: '.12em', color: 'var(--color-accent)' }}>2.0</span>
    </>
  );
  const style: React.CSSProperties = { display: 'flex', alignItems: 'baseline', gap: 6, color: 'var(--color-text)', textDecoration: 'none' };
  return to ? (
    <Link to={to} style={style}>
      {inner}
    </Link>
  ) : (
    <div style={style}>{inner}</div>
  );
};

/**
 * Каркас экранов входа и сброса: без сайдбара и шапки проекта — у человека без входа их нет.
 * Тему и класс ds-industry ставит useCabinetTheme (на <html>, иначе порталы остались бы без токенов).
 * Страницы личные — noindex.
 */
export const AuthFrame: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  useCabinetTheme();
  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      <PageSeo title={`${title} — SeoMarket`} description="Личный кабинет SeoMarket" noindex />
      <div
        data-screen
        style={{
          maxWidth: 420,
          margin: '0 auto',
          padding: '72px var(--space-6) 64px',
          display: 'grid',
          gap: 'var(--space-6)',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Нижняя плашка экранов входа: волосяная рамка, 12.5px, приглушённый текст. */
export const FrameNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-4)', fontSize: 12.5, lineHeight: 1.55, color: MUTED }}>
    {children}
  </div>
);
