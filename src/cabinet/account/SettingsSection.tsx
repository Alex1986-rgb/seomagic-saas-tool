import React from 'react';
import { Blueprint } from '../ui';

/**
 * Раздел экрана настроек: в макете заголовок 18px (а не 20px, как у общего Section), сетка
 * с отступом space-4/space-6; важные разделы (наши адреса, поставщик выдачи) — в рамке-чертеже.
 */
export const SettingsSection: React.FC<{
  title?: React.ReactNode;
  head?: React.ReactNode;
  blueprint?: boolean;
  gap?: string;
  children: React.ReactNode;
  id?: string;
}> = ({ title, head, blueprint, gap = 'var(--space-4)', children, id }) => {
  const style: React.CSSProperties = { padding: 'var(--space-6)', display: 'grid', gap, minWidth: 0 };
  const inner = (
    <>
      {head ?? (title && <h2 style={{ fontSize: 18, margin: 0 }}>{title}</h2>)}
      {children}
    </>
  );
  return blueprint ? (
    <Blueprint as="section" id={id} style={style}>
      {inner}
    </Blueprint>
  ) : (
    <section id={id} style={{ ...style, border: '1px solid var(--color-divider)' }}>
      {inner}
    </section>
  );
};
