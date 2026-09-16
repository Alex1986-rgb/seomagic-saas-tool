import type React from 'react';

/** Ячейки таблиц документов — как в макете. Отдельный модуль: из файла с компонентами константы-объекты ломают fast refresh. */
export const SOFT_TEXT = 'color-mix(in srgb,var(--color-text) 78%,transparent)';
export const tdFirst: React.CSSProperties = { paddingLeft: 24, fontSize: 15 };
export const tdText: React.CSSProperties = { fontSize: 14, color: SOFT_TEXT };
export const tdRight: React.CSSProperties = { textAlign: 'right', whiteSpace: 'nowrap' };
