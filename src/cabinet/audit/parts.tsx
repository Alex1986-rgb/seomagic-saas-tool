import React from 'react';
import { Blueprint, Kicker, MUTED } from '../ui';
import { dateShort } from '../format';

/**
 * Мелкие блоки экранов аудита, которых нет в общих примитивах ui.tsx.
 * Общие примитивы не правим (они принадлежат координатору), поэтому варианты — здесь.
 */

/**
 * Плитка «не подключено» в сетке показателей.
 * Полноразмерный NotConnected в ряд плиток 190px не помещается и ломает сетку, поэтому здесь
 * тот же смысл в размере плитки: подпись, прочерк вместо числа и чего не хватает.
 */
export const NotConnectedStat: React.FC<{ label: React.ReactNode; needs: React.ReactNode }> = ({ label, needs }) => (
  <Blueprint style={{ padding: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)', alignContent: 'start' }}>
    <Kicker>{label}</Kicker>
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 44, lineHeight: 1, color: MUTED }}>—</span>
    <span style={{ fontSize: 12, color: MUTED }}>Не подключено: {needs}</span>
  </Blueprint>
);

/** Строка категории без измерения — на месте шкалы ScoreBar. */
export const NotMeasuredBar: React.FC<{ label: React.ReactNode; needs: React.ReactNode }> = ({ label, needs }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5, gap: 8 }}>
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <span style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, whiteSpace: 'nowrap' }}>
        Не подключено
      </span>
    </div>
    <div style={{ height: 7, border: '1px dashed var(--color-divider)' }} />
    <div style={{ fontSize: 11.5, color: MUTED, marginTop: 4 }}>{needs}</div>
  </div>
);

/** «↑ 6», «↓ 3», «→ 0». Рост — акцентом, остальное приглушённым: красный только для критичного. */
export function deltaText(cur: number | null | undefined, prev: number | null | undefined): { text: string; up: boolean } | null {
  if (cur === null || cur === undefined || prev === null || prev === undefined) return null;
  const d = Math.round(cur) - Math.round(prev);
  if (d > 0) return { text: `↑ ${d}`, up: true };
  if (d < 0) return { text: `↓ ${Math.abs(d)}`, up: false };
  return { text: '→ 0', up: false };
}

export interface ScorePoint {
  date: string;
  score: number;
}

/**
 * График общего балла по готовым аудитам проекта. Точки — только настоящие аудиты, без
 * сглаживания и достроенных месяцев: если аудит был один раз в квартал, так и видно.
 * Шкала 0–100 (y=160 — ноль, y=20 — сто), линии сетки через 25 пунктов.
 */
export const ScoreChart: React.FC<{ points: ScorePoint[] }> = ({ points }) => {
  const n = points.length;
  const x = (i: number) => (n === 1 ? 300 : 20 + (560 * i) / (n - 1));
  const y = (s: number) => 160 - Math.max(0, Math.min(100, s)) * 1.4;
  const coords = points.map((p, i) => `${Math.round(x(i))},${Math.round(y(p.score))}`).join(' ');
  return (
    <>
      <svg
        viewBox="0 0 600 170"
        width="100%"
        height="170"
        preserveAspectRatio="none"
        role="img"
        aria-label={`График общего балла: ${points.map((p) => Math.round(p.score)).join(', ')}`}
      >
        {[20, 55, 90, 125, 160].map((gy) => (
          <line key={gy} x1="0" y1={gy} x2="600" y2={gy} stroke="var(--color-divider)" strokeWidth="1" />
        ))}
        <polyline points={coords} fill="none" stroke="var(--color-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.score)} r={i === n - 1 ? 4 : 3} fill="var(--color-accent)" />
        ))}
      </svg>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n},minmax(0,1fr))`,
          gap: 4,
          marginTop: 6,
          fontSize: 11,
          color: MUTED,
        }}
      >
        {points.map((p, i) => (
          <span
            key={i}
            style={{ color: i === n - 1 ? 'var(--color-text)' : undefined, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {dateShort(p.date, false)} · {Math.round(p.score)}
          </span>
        ))}
      </div>
    </>
  );
};

/** Подпись-ячейка «подпись сверху, число ниже» в сетке с волосяными линиями, с необязательной сноской. */
export const NoteCell: React.FC<{ label: React.ReactNode; value: React.ReactNode; note?: React.ReactNode; muted?: boolean }> = ({
  label,
  value,
  note,
  muted,
}) => (
  <div style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-4)', minWidth: 0 }}>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, color: muted ? MUTED : undefined }}>{value}</div>
    {note && <div style={{ fontSize: 11, color: MUTED }}>{note}</div>}
  </div>
);
