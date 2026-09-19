/**
 * Чистая модель «Истории аудитов»: что изменилось между аудитами и точки графика балла.
 *
 * «Что изменилось» в макете — редакторский текст («Контент категорий переписан»). Таких
 * записей в базе нет, и сочинять их нельзя, поэтому строка собирается из измеренного:
 * разница балла, числа проблем и проверенных страниц с предыдущим аудитом.
 */

export interface AuditPoint {
  id: string;
  createdAt: string | null;
  score: number | null;
  pages: number | null;
  /** Проблем из таблицы issues; null — не посчитано (аудит не завершён или запрос упал). */
  issues: number | null;
  critical: number | null;
}

/** «+6», «−67», «0» — со знаком минус, а не дефисом, как в макете. */
export function signed(n: number, digits = 0): string {
  const rounded = digits ? Number(n.toFixed(digits)) : Math.round(n);
  const abs = Math.abs(rounded).toLocaleString('ru-RU', { maximumFractionDigits: digits });
  if (rounded > 0) return `+${abs}`;
  if (rounded < 0) return `−${abs}`;
  return '0';
}

export function describeChange(prev: AuditPoint | null, cur: AuditPoint): string {
  if (!prev) return 'Первый аудит проекта';
  const parts: string[] = [];
  if (cur.score !== null && prev.score !== null) parts.push(`балл ${signed(cur.score - prev.score)}`);
  if (cur.issues !== null && prev.issues !== null) parts.push(`проблем ${signed(cur.issues - prev.issues)}`);
  if (cur.pages !== null && prev.pages !== null && cur.pages !== prev.pages) parts.push(`страниц ${signed(cur.pages - prev.pages)}`);
  if (parts.length === 0) return 'Нет данных для сравнения';
  const text = parts.join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Точки графика в координатах макета (viewBox 600×170): x от 20 до 580, балл 0–100 на высоте
 * от 160 до 20 — линии сетки макета стоят ровно на 0/25/50/75/100.
 */
export function chartPoints(scores: number[]): { x: number; y: number }[] {
  if (scores.length === 0) return [];
  const step = scores.length > 1 ? 560 / (scores.length - 1) : 0;
  return scores.map((s, i) => ({
    x: Math.round((scores.length > 1 ? 20 + i * step : 300) * 10) / 10,
    y: Math.round((160 - (Math.max(0, Math.min(100, s)) / 100) * 140) * 10) / 10,
  }));
}

/** Выбор двух аудитов для сравнения: третий щелчок вытесняет самый ранний выбор. */
export function toggleSelection(selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter((s) => s !== id);
  const next = [...selected, id];
  return next.length > 2 ? next.slice(next.length - 2) : next;
}
