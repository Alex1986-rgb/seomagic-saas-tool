import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Примитивы кабинета SeoMarket 2.0 — перевод повторяющейся разметки макета
 * design/seomarket-v2/SeoMarket v2.dc.html в компоненты.
 *
 * Раскладка в макете задана инлайн-стилями на токенах Industry; здесь так же — чтобы экраны
 * сверялись с макетом строка к строке, без перевода в классы Tailwind. Tailwind в кабинете не
 * используется: его палитра и скругления противоречат системе (квадратные углы, один акцент).
 */

/** Приглушённый текст: не светлее 68 % от основного (правило контраста проекта). */
export const MUTED = 'var(--color-muted)';
export const MONO = 'var(--font-mono)';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

/** Четыре метки «+» по углам — обязательны у каждой рамки-чертежа. */
export const Corners: React.FC = () => (
  <>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
  </>
);

export const Blueprint: React.FC<DivProps & { as?: 'div' | 'section' | 'article' }> = ({
  as = 'div',
  className,
  children,
  ...rest
}) => {
  const Tag = as;
  return (
    <Tag className={className ? `blueprint ${className}` : 'blueprint'} {...rest}>
      <Corners />
      {children}
    </Tag>
  );
};

/** Корень экрана: ширина из макета и появление снизу на 6px (risein 0.18s). */
export const Screen: React.FC<{ maxWidth?: number; children: React.ReactNode; gap?: string }> = ({
  maxWidth = 1180,
  children,
  gap = 'var(--space-8)',
}) => (
  <div data-screen style={{ maxWidth, display: 'grid', gap, minWidth: 0 }}>
    {children}
  </div>
);

export const PageHead: React.FC<{
  title: React.ReactNode;
  lead?: React.ReactNode;
  kicker?: React.ReactNode;
  actions?: React.ReactNode;
  titleSize?: number;
}> = ({ title, lead, kicker, actions, titleSize = 36 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
    }}
  >
    <div style={{ minWidth: 0 }}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1 style={{ fontSize: titleSize, margin: kicker ? 'var(--space-2) 0 4px' : '0 0 4px', wordBreak: 'break-word' }}>
        {title}
      </h1>
      {lead && <p style={{ fontSize: 14, color: MUTED, margin: 0, maxWidth: '72ch' }}>{lead}</p>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>{actions}</div>}
  </div>
);

/** Подпись над значением: 10px, разрядка, акцент. */
export const Kicker: React.FC<{ children: React.ReactNode; muted?: boolean; style?: React.CSSProperties }> = ({
  children,
  muted,
  style,
}) => (
  <span
    style={{
      display: 'block',
      fontSize: muted ? 11 : 10,
      letterSpacing: muted ? '.08em' : '.1em',
      textTransform: 'uppercase',
      color: muted ? MUTED : 'var(--color-accent)',
      ...style,
    }}
  >
    {children}
  </span>
);

/** Раздел экрана: волосяная рамка без меток, заголовок 20px и необязательный блок справа. */
export const Section: React.FC<{
  title?: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  padding?: string;
  style?: React.CSSProperties;
  id?: string;
}> = ({ title, lead, aside, children, padding = 'var(--space-6)', style, id }) => (
  <section id={id} style={{ border: '1px solid var(--color-divider)', padding, minWidth: 0, ...style }}>
    {(title || aside) && (
      <div
        style={{
          display: 'flex',
          alignItems: lead ? 'flex-end' : 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          flexWrap: 'wrap',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          {title && <h2 style={{ fontSize: 20, margin: lead ? '0 0 4px' : 0 }}>{title}</h2>}
          {lead && <p style={{ fontSize: 13, color: MUTED, margin: 0, maxWidth: '64ch' }}>{lead}</p>}
        </div>
        {aside}
      </div>
    )}
    {children}
  </section>
);

/** Плитка показателя в рамке-чертеже (Обзор, Результаты, Позиции). */
export const Stat: React.FC<{
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  note?: React.ReactNode;
  critical?: boolean;
  noteAccent?: boolean;
  size?: number;
}> = ({ label, value, unit, note, critical, noteAccent, size = 44 }) => (
  <Blueprint style={{ padding: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)', alignContent: 'start' }}>
    <Kicker>{label}</Kicker>
    <span style={{ display: 'flex', alignItems: critical ? 'center' : 'baseline', gap: critical ? 9 : 7 }}>
      {critical && <span data-dot-critical style={{ width: 9, height: 9, flex: 'none' }} />}
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: size, lineHeight: 1 }}>{value}</span>
      {unit && <span style={{ fontSize: 13, color: MUTED }}>{unit}</span>}
    </span>
    {note && <span style={{ fontSize: 12, color: noteAccent ? 'var(--color-accent-700)' : MUTED }}>{note}</span>}
  </Blueprint>
);

/** Сетка плиток: auto-fit, как в макете. */
export const StatGrid: React.FC<{ children: React.ReactNode; min?: number; gap?: string }> = ({
  children,
  min = 190,
  gap = 'var(--space-6)',
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap }}>{children}</div>
);

/** Ячейка «подпись + число» в сетке с волосяными линиями (outline, чтобы рамки не удваивались). */
export const Cell: React.FC<{ label: React.ReactNode; value: React.ReactNode; critical?: boolean; size?: number }> = ({
  label,
  value,
  critical,
  size = 30,
}) => (
  <div style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)', minWidth: 0 }}>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      {critical && <span data-dot-critical style={{ width: 9, height: 9, flex: 'none' }} />}
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: size }}>{value}</span>
    </div>
  </div>
);

export const CellGrid: React.FC<{ children: React.ReactNode; min?: number; style?: React.CSSProperties }> = ({
  children,
  min = 150,
  style,
}) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, gap: 1, ...style }}>
    {children}
  </div>
);

/** Шкала 0–100 с делениями через 10 %. Критичная — красная полоса. */
export const ScoreBar: React.FC<{ label: React.ReactNode; value: number | null; critical?: boolean }> = ({
  label,
  value,
  critical,
}) => {
  const v = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 13.5 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{value === null ? '—' : Math.round(v)}</span>
      </div>
      <Meter pct={v} critical={critical} />
    </div>
  );
};

export const Meter: React.FC<{ pct: number; critical?: boolean; height?: number }> = ({ pct, critical, height = 7 }) => (
  <div
    style={{
      height,
      background: 'color-mix(in srgb,var(--color-text) 9%,transparent)',
      position: 'relative',
      backgroundImage: 'repeating-linear-gradient(to right,var(--color-divider) 0 1px,transparent 1px 10%)',
    }}
  >
    <div
      {...(critical ? { 'data-bar-critical': '' } : {})}
      style={{
        position: 'absolute',
        inset: `0 ${100 - Math.max(0, Math.min(100, pct))}% 0 0`,
        ...(critical ? {} : { background: 'var(--color-accent)' }),
      }}
    />
  </div>
);

export const Tag: React.FC<{ tone?: 'accent' | 'neutral' | 'outline'; children: React.ReactNode; style?: React.CSSProperties }> = ({
  tone = 'accent',
  children,
  style,
}) => (
  <span className={`tag tag-${tone}`} style={style}>
    {children}
  </span>
);

export type Severity = 'critical' | 'warn' | 'ok';

/** Чип критичности: критичное — красным, предупреждение — сталью, норма — нейтрально. */
export const SevChip: React.FC<{ sev: Severity; children?: React.ReactNode }> = ({ sev, children }) => {
  const label = children ?? (sev === 'critical' ? 'Критично' : sev === 'warn' ? 'Важно' : 'Норма');
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 11,
    padding: '2px 8px',
    border: '1px solid var(--color-divider)',
    whiteSpace: 'nowrap',
  };
  if (sev === 'critical') return <span data-chip="critical" style={base}>{label}</span>;
  if (sev === 'warn')
    return (
      <span style={{ ...base, background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', borderColor: 'transparent' }}>
        {label}
      </span>
    );
  return <span style={{ ...base, color: MUTED }}>{label}</span>;
};

/** Сегментный переключатель на нативных радиокнопках (.seg из Industry). */
export function Seg<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: React.ReactNode }[];
  value: T;
  // NoInfer: тип значения выводится из options/value, а не из обработчика — иначе
  // setState с узким типом ('ru' | 'msk') не подходит к выведенному string.
  onChange: (value: NoInfer<T>) => void;
}) {
  return (
    <div className="seg" role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className="seg-opt">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** Вкладки с подчёркиванием (data-tab). */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: {
  tabs: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: NoInfer<T>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      role="tablist"
      style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--color-divider)', overflowX: 'auto', ...style }}
    >
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          data-tab
          data-active={value === t.value ? '1' : '0'}
          onClick={() => onChange(t.value)}
          style={{ padding: '8px 0', font: 'inherit', fontSize: 13.5, border: 0, borderBottom: '2px solid transparent', whiteSpace: 'nowrap' }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** Модальное окно Industry. Портал в body: класс ds-industry висит на <html>, стили доходят. */
export const Dialog: React.FC<{
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;
}> = ({ open, title, onClose, children, actions, width = 440 }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog blueprint"
        role="dialog"
        aria-modal="true"
        style={{ width: `min(${width}px, 100%)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <Corners />
        <div className="dialog-title">{title}</div>
        <div className="dialog-body">{children}</div>
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </div>,
    document.body,
  );
};

/** Кнопка «скопировать» с подтверждением на 1,6 с — как в макете. */
export const CopyButton: React.FC<{ text: string; label: string; done?: string; className?: string }> = ({
  text,
  label,
  done = 'Скопировано',
  className = 'btn btn-secondary',
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        // Буфер обмена бывает запрещён (iframe, http) — подтверждение показываем в любом случае,
        // а текст остаётся на экране, его можно выделить руками.
        try {
          void navigator.clipboard?.writeText(text);
        } catch {
          /* нет доступа к буферу */
        }
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1600);
      }}
      style={{ whiteSpace: 'nowrap' }}
    >
      {copied ? done : label}
    </button>
  );
};

/**
 * Честное состояние «не подключено».
 *
 * Макет рисует экраны, под которыми в продукте нет бэкенда (оплата с холдом, исправление копии,
 * конкуренты, частотность Wordstat, метрики сервера). Показывать там числа из макета — значит
 * врать клиенту (правило проекта: только измеримое). Вместо этого экран говорит, чего не хватает
 * и что будет, когда появится.
 */
export const NotConnected: React.FC<{
  title: React.ReactNode;
  children?: React.ReactNode;
  needs?: React.ReactNode[];
  action?: React.ReactNode;
}> = ({ title, children, needs, action }) => (
  <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)' }}>
    <Kicker muted>Не подключено</Kicker>
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, lineHeight: 1.15 }}>{title}</div>
    {children && <div style={{ fontSize: 13.5, color: MUTED, maxWidth: '68ch' }}>{children}</div>}
    {needs && needs.length > 0 && (
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: MUTED, display: 'grid', gap: 4 }}>
        {needs.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    )}
    {action && <div>{action}</div>}
  </Blueprint>
);

/** Пустое состояние: данных пока нет, но они появятся от действия пользователя. */
export const Empty: React.FC<{ title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  children,
  action,
}) => (
  <div
    style={{
      border: '1px dashed var(--color-divider)',
      padding: 'var(--space-8) var(--space-6)',
      display: 'grid',
      gap: 'var(--space-3)',
      justifyItems: 'start',
    }}
  >
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20 }}>{title}</div>
    {children && <div style={{ fontSize: 13.5, color: MUTED, maxWidth: '64ch' }}>{children}</div>}
    {action}
  </div>
);

export const Loading: React.FC<{ label?: string }> = ({ label = 'Загрузка…' }) => (
  <div role="status" style={{ fontSize: 13, color: MUTED, padding: 'var(--space-6) 0', display: 'flex', gap: 8, alignItems: 'center' }}>
    <span data-blink style={{ width: 7, height: 7, background: 'var(--color-accent)' }} />
    {label}
  </div>
);

export const ErrorNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div role="alert" style={{ border: '1px solid var(--color-critical)', padding: 'var(--space-3) var(--space-4)', fontSize: 13 }}>
    {children}
  </div>
);

/** Шаги процесса полосками 26×4 (заказ, онбординг). */
export const StepBars: React.FC<{ total: number; current: number }> = ({ total, current }) => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} aria-label={`Шаг ${current} из ${total}`}>
    {Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        style={{
          width: 26,
          height: 4,
          background: i < current ? 'var(--color-accent)' : 'color-mix(in srgb,var(--color-text) 16%,transparent)',
        }}
      />
    ))}
  </div>
);

/** Таблица в рамке с горизонтальной прокруткой на узком экране. */
export const TableFrame: React.FC<{ children: React.ReactNode; minWidth?: number }> = ({ children, minWidth = 640 }) => (
  <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }}>
    <table className="table" style={{ minWidth }}>
      {children}
    </table>
  </div>
);
